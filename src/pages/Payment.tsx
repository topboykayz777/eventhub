"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { showSuccess, showError } from '@/utils/toast';
import { CreditCard, ShieldCheck, Loader2 } from 'lucide-react';

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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
      showError("Payment system is still loading. Please refresh or wait 5 seconds.");
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
          console.log("[Payment] Success:", response);
          
          // We update the database and wait for confirmation
          const { error } = await supabase
            .from('events')
            .update({ 
              is_paid: true
            })
            .eq('id', id);

          if (error) {
            console.error("[Payment] Database update error:", error);
            showError("Payment received, but we couldn't update your event status. Please contact support.");
            setIsProcessing(false);
          } else {
            showSuccess('Payment successful! Your event is now live.');
            // Small delay to ensure DB consistency before redirect
            setTimeout(() => {
              navigate('/dashboard', { replace: true });
              setIsProcessing(false);
            }, 1500);
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
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a1a] text-white">
      <Loader2 className="w-8 h-8 animate-spin text-[#e94560]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      <Navbar />
      <div className="max-w-md mx-auto py-20 px-6">
        <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 text-center shadow-2xl">
          <div className="bg-[#e94560]/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
            <CreditCard className="text-[#e94560] w-12 h-12" />
          </div>
          
          <h1 className="text-3xl font-black mb-2 tracking-tight">Activate Event</h1>
          <p className="text-gray-400 mb-10">
            You selected the <span className="text-white font-bold">{event.plan}</span> plan for <br/>
            <span className="text-[#e94560] italic">"{event.event_name}"</span>
          </p>
          
          <div className="bg-white/5 rounded-3xl p-8 mb-10 border border-white/5">
            <div className="text-5xl font-black text-white mb-2">
              ₦{event.plan === 'Basic' ? '10,000' : event.plan === 'Standard' ? '15,000' : '20,000'}
            </div>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold">One-time payment</p>
          </div>

          <Button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-[#e94560] hover:bg-[#d43d56] text-white py-8 rounded-2xl text-xl font-black shadow-xl shadow-[#e94560]/20 transition-all hover:scale-105 active:scale-95"
          >
            {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : 'PAY WITH PAYSTACK'}
          </Button>
          
          <div className="mt-8 flex items-center justify-center gap-2 text-gray-500">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;