"use client";

import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';
import { Crown, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import TicketQR from './TicketQR';

const VIPCheckout = () => {
  const [email, setEmail] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);

  const payWithPaystack = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      showError("Please enter your email.");
      return;
    }

    // Key Check: Use env var or the provided test key fallback
    const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_8a5989e07b1762ec4037cc3318626f1e4fda67cb';

    setLoading(true);

    try {
      // @ts-ignore - PaystackPop is loaded via script tag in index.html
      const handler = window.PaystackPop.setup({
        key: paystackKey,
        email: email,
        amount: 5000 * 100, // ₦5,000 in kobo
        currency: 'NGN',
        callback: async (response: any) => {
          const ref = response.reference;
          
          // Save to Supabase
          const { error } = await supabase.from('tickets').insert({
            user_email: email,
            reference: ref
          });

          if (error) {
            console.error("Supabase error:", error);
            showError("Payment verified, but failed to save ticket.");
          } else {
            setReference(ref);
            setIsPaid(true);
            showSuccess("VIP Ticket Secured.");
          }
          setLoading(false);
        },
        onClose: () => {
          showError("Transaction cancelled.");
          setLoading(false);
        }
      });

      handler.openIframe();
    } catch (err) {
      console.error("Paystack initialization failed:", err);
      showError("Could not load payment window. Please refresh.");
      setLoading(false);
    }
  };

  if (isPaid) {
    return <TicketQR reference={reference} email={email} />;
  }

  return (
    <div className="bg-black border border-[#D4AF37]/30 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
        <Crown size={120} className="text-[#D4AF37]" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
            <Crown className="text-[#D4AF37] w-5 h-5" />
          </div>
          <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.4em] uppercase">Elite Access</span>
        </div>

        <h2 className="text-3xl font-serif italic text-white mb-4">VIP Experience</h2>
        <p className="text-gray-500 text-sm font-light leading-relaxed mb-10">
          Unlock exclusive access to the main gala, premium seating, and the after-party concierge.
        </p>

        <div className="bg-white/5 rounded-2xl p-6 mb-10 border border-white/5">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[8px] font-bold uppercase tracking-widest text-gray-500 mb-1">One-time Pass</p>
              <p className="text-3xl font-serif italic text-white">₦5,000</p>
            </div>
            <Sparkles className="text-[#D4AF37] w-6 h-6 animate-pulse" />
          </div>
        </div>

        <form onSubmit={payWithPaystack} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-[8px] font-bold uppercase tracking-widest text-gray-500 ml-2">Delivery Email</Label>
            <Input 
              type="email" 
              required 
              placeholder="your@email.com"
              className="h-14 bg-white/5 border-white/10 rounded-xl focus:border-[#D4AF37]/50 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black py-8 rounded-xl text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-500 shadow-xl shadow-[#D4AF37]/10"
          >
            {loading ? 'Initializing...' : 'Buy VIP Ticket'} <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-gray-600">
          <ShieldCheck size={14} />
          <span className="text-[8px] font-bold uppercase tracking-widest">Secured by Paystack</span>
        </div>
      </div>
    </div>
  );
};

export default VIPCheckout;