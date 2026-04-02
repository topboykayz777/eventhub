"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { showSuccess, showError } from '@/utils/toast';
import { CreditCard, ShieldCheck, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const fetchEventAndUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserEmail(user.email || '');

      const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
      if (error) {
        showError('Event not found');
        navigate('/dashboard');
      } else {
        setEvent(data);
      }
      setLoading(false);
    };
    fetchEventAndUser();
  }, [id, navigate]);

  const handlePayment = () => {
    if (isProcessing) return;
    
    const paystack = (window as any).PaystackPop;
    
    if (!paystack) {
      showError("Payment system is still loading. Please wait 5 seconds.");
      return;
    }

    setIsProcessing(true);
    const amount = event.plan === 'Basic' ? 10000 : event.plan === 'Standard' ? 15000 : 20000;
    const paystackKey = 'pk_test_8a5989e07b1762ec4037cc3318626f1e4fda67cb';

    try {
      const handler = paystack.setup({
        key: paystackKey,
        email: userEmail || 'customer@eventhub.ng',
        amount: amount * 100,
        currency: 'NGN',
        metadata: {
          event_id: id,
          plan: event.plan
        },
        callback: async function(response: any) {
          console.log("[Payment] Success Callback Received:", response.reference);
          
          // CRITICAL: Update the database immediately
          const { error } = await supabase
            .from('events')
            .update({ 
              is_paid: true,
              status: 'Active'
            })
            .eq('id', id);

          if (error) {
            console.error("[Payment] Database update failed:", error);
            showError("Payment confirmed, but activation failed. Please refresh your dashboard.");
            setIsProcessing(false);
          } else {
            setPaymentSuccess(true);
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 }
            });
            showSuccess('Masterpiece Activated!');
            
            // Give the DB a moment to propagate before redirecting
            setTimeout(() => {
              navigate('/dashboard');
            }, 3000);
          }
        },
        onClose: function() {
          showError('Payment window closed');
          setIsProcessing(false);
        }
      });
      
      handler.openIframe();
    } catch (err) {
      console.error("[Payment] Initialization Error:", err);
      showError("Could not open payment window.");
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f] text-white">
      <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
    </div>
  );

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="bg-green-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="text-green-500 w-12 h-12" />
          </div>
          <h1 className="text-4xl font-serif italic mb-4">Activation Complete</h1>
          <p className="text-gray-500 mb-10">Your event is now live and viewable by all guests. Redirecting to your dashboard...</p>
          <div className="flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] animate-pulse">
            <Sparkles className="w-4 h-4" /> Syncing with the Cloud...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      <div className="max-w-md mx-auto py-20 px-6">
        <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 text-center shadow-2xl">
          <div className="bg-[#D4AF37]/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
            <CreditCard className="text-[#D4AF37] w-12 h-12" />
          </div>
          
          <h1 className="text-3xl font-serif italic mb-2 tracking-tight">Activate Event</h1>
          <p className="text-gray-400 mb-10">
            You selected the <span className="text-white font-bold">{event.plan}</span> plan for <br/>
            <span className="text-[#D4AF37] italic">"{event.event_name}"</span>
          </p>
          
          <div className="bg-white/5 rounded-3xl p-8 mb-10 border border-white/5">
            <div className="text-5xl font-serif italic text-white mb-2">
              ₦{event.plan === 'Basic' ? '10,000' : event.plan === 'Standard' ? '15,000' : '20,000'}
            </div>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold">One-time activation</p>
          </div>

          <Button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black py-8 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500 shadow-xl shadow-[#D4AF37]/10"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Secure Activation'}
          </Button>
          
          <div className="mt-8 flex items-center justify-center gap-2 text-gray-500">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Secured by Paystack</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;