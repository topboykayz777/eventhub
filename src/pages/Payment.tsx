"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { showSuccess, showError } from '@/utils/toast';
import { CreditCard } from 'lucide-react';

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
      if (error) {
        showError('Event not found');
        navigate('/dashboard');
      } else {
        setEvent(data);
      }
      setLoading(false);
    };
    fetchEvent();
  }, [id, navigate]);

  const handlePayment = () => {
    const amount = event.plan === 'Basic' ? 10000 : event.plan === 'Standard' ? 15000 : 20000;
    
    // @ts-ignore
    const handler = PaystackPop.setup({
      key: 'pk_test_your_public_key', // Replace with actual key or use env
      email: 'host@example.com', // Should get from user profile
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

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto py-20 px-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center">
          <div className="bg-[#1a1a2e]/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="text-[#e94560] w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Activate Your Event</h1>
          <p className="text-gray-600 mb-8">You selected the <span className="font-bold">{event.plan}</span> plan for <span className="font-bold">{event.event_name}</span>.</p>
          
          <div className="text-4xl font-extrabold text-[#1a1a2e] mb-10">
            ₦{event.plan === 'Basic' ? '10,000' : event.plan === 'Standard' ? '15,000' : '20,000'}
          </div>

          <Button 
            onClick={handlePayment}
            className="w-full bg-[#e94560] hover:bg-[#d43d56] text-white py-6 rounded-xl text-lg"
          >
            Pay Now with Paystack
          </Button>
          <p className="mt-4 text-sm text-gray-400">Secure payment powered by Paystack</p>
        </div>
      </div>
    </div>
  );
};

export default Payment;