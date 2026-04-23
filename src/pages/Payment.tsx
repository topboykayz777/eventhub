"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { showSuccess, showError } from '@/utils/toast';
import { CreditCard, ShieldCheck, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { usePaystackPayment } from 'react-paystack';

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
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

  const amount = event ? (event.plan === 'Basic' ? 10000 : event.plan === 'Standard' ? 15000 : 20000) : 0;

  const config = {
    reference: (new Date()).getTime().toString(),
    email: userEmail || "customer@eventhub.ng",
    amount: amount * 100, // Paystack expects kobo
    publicKey: 'pk_test_8a5989e07b1762ec4037cc3318626f1e4fda67cb',
    metadata: {
      custom_fields: [
        {
          display_name: "Event ID",
          variable_name: "event_id",
          value: id || ""
        }
      ]
    }
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = async (reference: any) => {
    console.log("[Payment] Success:", reference);
    const { error } = await supabase
      .from('events')
      .update({ is_paid: true })
      .eq('id', id);

    if (error) {
      showError("Payment confirmed, but activation failed. Contact support.");
    } else {
      setPaymentSuccess(true);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      showSuccess('Masterpiece Activated!');
      setTimeout(() => navigate('/dashboard'), 3000);
    }
  };

  const onClose = () => {
    showError("Payment window closed.");
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
              ₦{amount.toLocaleString()}
            </div>
          </div>
          
          <Button 
            onClick={() => initializePayment({ onSuccess, onClose })}
            className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black py-8 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500"
          >
            Secure Activation
          </Button>

          <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex items-start gap-3 text-left">
            <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[9px] text-blue-200/70 leading-relaxed">
              If the window doesn't open, check your browser's **Address Bar** for a "Pop-up Blocked" icon and click "Allow".
            </p>
          </div>

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