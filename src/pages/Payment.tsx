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

  const loadPaystackScript = () => {
    return new Promise((resolve) => {
      if ((window as any).PaystackPop) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    const scriptLoaded = await loadPaystackScript();
    
    if (!scriptLoaded || !(window as any).PaystackPop) {
      showError("Payment gateway blocked. Please disable browser 'Shields' or 'Tracking Protection' and open this in a NEW TAB.");
      setIsProcessing(false);
      return;
    }

    const paystack = (window as any).PaystackPop;
    const amount = event.plan === 'Basic' ? 10000 : event.plan === 'Standard' ? 15000 : 20000;
    const paystackKey = 'pk_test_8a5989e07b1762ec4037cc3318626f1e4fda67cb';

    try {
      const handler = paystack.setup({
        key: paystackKey,
        email: userEmail || 'customer@eventhub.ng',
        amount: amount * 100,
        currency: 'NGN',
        metadata: {
          custom_fields: [
            { display_name: "Event ID", variable_name: "event_id", value: id },
            { display_name: "Plan", variable_name: "plan", value: event.plan }
          ]
        },
        callback: async function(response: any) {
          const { error } = await supabase
            .from('events')
            .update({ is_paid: true })
            .eq('id', id);

          if (error) {
            showError("Payment confirmed, but activation failed. Contact support.");
            setIsProcessing(false);
          } else {
            setPaymentSuccess(true);
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            showSuccess('Masterpiece Activated!');
            setTimeout(() => navigate('/dashboard'), 3000);
          }
        },
        onClose: function() {
          showError('Payment cancelled.');
          setIsProcessing(false);
        }
      });
      
      handler.openIframe();
    } catch (err: any) {
      showError("Security block detected. Please open this page in a NEW TAB to pay.");
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
          <p className="text-gray-500 mb-10">Your event is now live. Redirecting...</p>
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
            Plan: <span className="text-white font-bold">{event.plan}</span><br/>
            <span className="text-[#D4AF37] italic">"{event.event_name}"</span>
          </p>
          <div className="bg-white/5 rounded-3xl p-8 mb-10 border border-white/5">
            <div className="text-5xl font-serif italic text-white mb-2">
              ₦{event.plan === 'Basic' ? '10,000' : event.plan === 'Standard' ? '15,000' : '20,000'}
            </div>
          </div>
          <Button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black py-8 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500"
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