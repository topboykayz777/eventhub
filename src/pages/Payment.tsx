"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { showSuccess, showError } from '@/utils/toast';
import { CreditCard, ShieldCheck } from 'lucide-react';

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

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
    const amount = event.plan === 'Basic' ? 10000 : event.plan === 'Standard' ? 15000 : 20000;
    
    // Use environment variable for Paystack Public Key
    const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_your_public_key';

    if (paystackKey === 'pk_test_your_public_key') {
      console.warn("Paystack Public Key is not set. Using test key.");
    }

    // @ts-ignore
    const handler = PaystackPop.setup({
      key: paystackKey,
      email: userEmail || 'customer@example.com',
      amount: amount * 100,
      currency: 'NGN',
      callback: async (response: any) => {
        const { error } = await supabase
          .from('events')
          .update({ is_paid: true })
          .eq('id', id);
        
        if (error) {
          showError('Payment verification failed');
        } else {
          showSuccess('Payment successful! Your event is now live.');
          navigate('/dashboard');
        }
      },
      onClose: () => {
        showError('Payment cancelled');
      }
    });
    handler.openIframe();
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#0a0a1a] text-white">Loading Payment Details...</div>;

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
            className="w-full bg-[#e94560] hover:bg-[#d43d56] text-white py-8 rounded-2xl text-xl font-black shadow-xl shadow-[#e94560]/20 transition-all hover:scale-105 active:scale-95"
          >
            PAY WITH PAYSTACK
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