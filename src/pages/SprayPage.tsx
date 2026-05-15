"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';
import { Coins, Loader2, ShieldCheck, ArrowLeft, AlertTriangle, Lock } from 'lucide-react';
import { usePaystackPayment } from 'react-paystack';
import confetti from 'canvas-confetti';

const SprayPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [guestName, setGuestName] = useState('');
  const [subaccount, setSubaccount] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventAndConfig = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .ilike('slug', slug?.trim() || '')
        .maybeSingle();

      if (error || !data) {
        showError("Event not found.");
        navigate('/');
        return;
      }
      setEvent(data);

      try {
        const response = await fetch('https://vilknsbrvakthefsgfwg.supabase.co/functions/v1/event-security', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'get-spray-config', payload: { eventId: data.id } })
        });
        const config = await response.json();
        if (config.subaccount) setSubaccount(config.subaccount);
      } catch (err) {
        console.error("Config Error:", err);
      }

      setLoading(false);
    };
    fetchEventAndConfig();
  }, [slug, navigate]);

  const config = {
    reference: (new Date()).getTime().toString(),
    email: "guest@eventhub.ng",
    amount: parseInt(amount) * 100,
    publicKey: 'pk_live_b34e33d09dceeebd5dfa469b9139257b308a2c9d',
    subaccount: subaccount || undefined,
    metadata: {
      custom_fields: [
        { display_name: "Event ID", variable_name: "event_id", value: event?.id || "" },
        { display_name: "Payment Type", variable_name: "payment_type", value: "gift" },
        { display_name: "Guest Name", variable_name: "guest_name", value: guestName || "Anonymous Guest" }
      ]
    }
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = () => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    showSuccess(`Thank you for spraying! Your gift has been announced.`);
    setAmount('');
    setGuestName('');
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" /></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-10">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-8">
            <Coins className="text-[#D4AF37] w-10 h-10" />
          </div>
          <h1 className="text-4xl font-serif italic mb-2">Digital Spray</h1>
          <p className="text-gray-500 text-sm uppercase tracking-widest">For {event.event_name}</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 space-y-8">
          {!subaccount ? (
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto">
                <Lock className="text-amber-500 w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-serif italic mb-2">Vault Not Ready</h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  The host is currently setting up their digital vault. Please check back in a few moments to spray.
                </p>
              </div>
              <Button variant="outline" onClick={() => window.location.reload()} className="w-full border-white/10 text-white rounded-none py-6 text-[10px] font-bold uppercase tracking-widest">
                Refresh Status
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Your Name (Optional)</Label>
                <Input placeholder="e.g. David Adeleke" className="h-16 bg-white/5 border-white/10 rounded-none text-lg font-light" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Amount to Spray (₦)</Label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4AF37] font-serif text-xl">₦</span>
                  <Input type="number" placeholder="Enter Amount" className="h-16 pl-12 bg-white/5 border-white/10 rounded-none text-2xl font-serif italic" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
              </div>

              <Button 
                onClick={() => {
                  if (!amount || parseInt(amount) < 100) { showError("Minimum spray is ₦100"); return; }
                  initializePayment({ onSuccess, onClose: () => {} });
                }}
                className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all"
              >
                Spray Now
              </Button>

              <div className="flex items-center justify-center gap-2 text-gray-600">
                <ShieldCheck size={14} />
                <span className="text-[8px] font-bold uppercase tracking-widest">Verified Host Vault</span>
              </div>
            </>
          )}
        </div>

        <button onClick={() => navigate(`/event/${event.slug}`)} className="w-full text-center text-gray-500 hover:text-[#D4AF37] transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
          <ArrowLeft size={12} /> Back to Event Page
        </button>
      </div>
    </div>
  );
};

export default SprayPage;