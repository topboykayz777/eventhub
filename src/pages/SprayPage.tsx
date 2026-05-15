"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';
import { Coins, Loader2, ShieldCheck, ArrowLeft, User } from 'lucide-react';
import confetti from 'canvas-confetti';

const SprayPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [hostProfile, setHostProfile] = useState<any>(null);
  const [rsvp, setRsvp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [amount, setAmount] = useState('');
  const [alertName, setAlertName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: eventData } = await supabase.from('events').select('*').ilike('slug', slug?.trim() || '').maybeSingle();
      if (!eventData) { navigate('/'); return; }
      setEvent(eventData);

      const { data: profile } = await supabase.from('profiles').select('bank_name, account_number, account_name').eq('id', eventData.host_id).single();
      setHostProfile(profile);

      const savedRsvpId = localStorage.getItem(`eventhub_rsvp_${eventData.id}`);
      if (savedRsvpId) {
        const { data: rsvpData } = await supabase.from('rsvps').select('*').eq('id', savedRsvpId).maybeSingle();
        if (rsvpData) {
          setRsvp(rsvpData);
          setAlertName(rsvpData.guest_name);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [slug, navigate]);

  const handleSent = async () => {
    if (!amount || parseFloat(amount) < 100) {
      showError("Please enter a valid amount (Min ₦100)");
      return;
    }

    setSubmitting(true);
    try {
      // We explicitly structure the payload to avoid 'undefined' values which cause 400 errors
      const payload = {
        event_id: event.id,
        rsvp_id: rsvp?.id || null,
        description: `Digital Spray from ${rsvp?.guest_name || alertName || 'Guest'}`,
        alert_name: alertName || 'Anonymous',
        amount: parseFloat(amount),
        type: 'income',
        status: 'pending'
      };

      const { error } = await supabase.from('budget_items').insert(payload);

      if (error) throw error;

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      showSuccess("Notification sent to Host. Waiting for verification...");
      
      setTimeout(() => navigate(`/event/${event.slug}`), 3000);
    } catch (err: any) {
      console.error("Insert Error:", err);
      showError(err.message || "Failed to record spray. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" /></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-6">
            <Coins className="text-[#D4AF37] w-8 h-8" />
          </div>
          <h1 className="text-3xl font-serif italic mb-1">Digital Spray</h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Honoring {event.event_name}</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 space-y-8">
          <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <User className="text-[#D4AF37] w-4 h-4" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500">Spraying As</span>
              </div>
              <button onClick={() => setIsEditingName(!isEditingName)} className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37] hover:underline">
                {isEditingName ? 'Save' : 'Change'}
              </button>
            </div>
            
            {isEditingName ? (
              <Input 
                className="bg-white/5 border-white/10 h-12 rounded-none text-sm"
                value={alertName}
                onChange={(e) => setAlertName(e.target.value)}
                placeholder="Name on your bank app"
              />
            ) : (
              <p className="text-xl font-serif italic">{alertName || 'Anonymous Guest'}</p>
            )}
            <p className="text-[7px] text-gray-600 uppercase tracking-widest mt-2">
              The host will look for a transfer from: <span className="text-gray-400">{alertName || 'Anonymous'}</span>
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Amount to Spray</Label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4AF37] font-serif text-2xl">₦</span>
              <Input 
                type="number"
                placeholder="0.00"
                className="h-20 pl-14 bg-white/5 border-white/10 rounded-none text-3xl font-light focus:border-[#D4AF37]/50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-center text-[#D4AF37]">Host Bank Details</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                <p className="text-[7px] font-bold text-gray-600 uppercase mb-1">Bank</p>
                <p className="text-xs font-medium truncate">{hostProfile?.bank_name}</p>
              </div>
              <div 
                className="p-4 bg-black/20 rounded-xl border border-white/5 cursor-pointer hover:border-[#D4AF37]/30 transition-all"
                onClick={() => { 
                  if (hostProfile?.account_number) {
                    navigator.clipboard.writeText(hostProfile.account_number); 
                    showSuccess("Copied!"); 
                  }
                }}
              >
                <p className="text-[7px] font-bold text-gray-600 uppercase mb-1">Account (Tap to copy)</p>
                <p className="text-xs font-medium tracking-widest">{hostProfile?.account_number}</p>
              </div>
            </div>
            <div className="p-4 bg-black/20 rounded-xl border border-white/5 text-center">
              <p className="text-[7px] font-bold text-gray-600 uppercase mb-1">Account Name</p>
              <p className="text-xs font-bold text-[#D4AF37] uppercase">{hostProfile?.account_name}</p>
            </div>
          </div>

          <Button 
            onClick={handleSent}
            disabled={submitting || !amount}
            className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all shadow-2xl"
          >
            {submitting ? <Loader2 className="animate-spin" /> : "I've Sent the Transfer"}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-gray-600">
          <ShieldCheck size={14} className="text-[#D4AF37]" />
          <span className="text-[8px] font-bold uppercase tracking-widest">Secure Direct Transfer</span>
        </div>

        <button onClick={() => navigate(-1)} className="w-full text-center text-gray-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
          <ArrowLeft size={12} /> Back
        </button>
      </div>
    </div>
  );
};

export default SprayPage;