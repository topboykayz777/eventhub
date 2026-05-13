"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, UserCheck, Sparkles, Heart, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';

const VibeScreen = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetchEvent();
  }, [slug]);

  const fetchEvent = async () => {
    const { data } = await supabase.from('events').select('*').eq('slug', slug).single();
    if (data) {
      setEvent(data);
      setupRealtime(data.id);
    }
  };

  const addNotification = (notif: any) => {
    setNotifications(prev => [notif, ...prev].slice(0, 5));
    if (notif.type === 'spray') {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#D4AF37', '#ffffff'] });
    }
  };

  const setupRealtime = (eventId: string) => {
    supabase
      .channel(`vibe-screen-${eventId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'budget_items', filter: `event_id=eq.${eventId}` }, (payload) => {
        if (payload.new.type === 'income' && payload.new.description.includes('Digital Spray')) {
          addNotification({ id: payload.new.id, type: 'spray', title: 'New Digital Spray!', detail: payload.new.description, amount: payload.new.amount });
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rsvps', filter: `event_id=eq.${eventId}` }, (payload) => {
        if (payload.new.checked_in && !payload.old.checked_in) {
          addNotification({ id: payload.new.id, type: 'checkin', title: 'Guest Arrived', detail: payload.new.guest_name });
        }
      })
      .subscribe();
  };

  if (!event) return <div className="min-h-screen bg-black flex items-center justify-center text-[#D4AF37] font-serif italic">Initializing Vibe...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden flex flex-col items-center justify-center p-12">
      <div className="absolute inset-0 opacity-20">
        <img src={event.photo_url} className="w-full h-full object-cover blur-3xl" alt="" />
      </div>

      <div className="relative z-10 text-center mb-24">
        <span className="text-[#D4AF37] text-[12px] font-bold tracking-[0.8em] uppercase mb-6 block">Live Event Feed</span>
        <h1 className="text-6xl md:text-9xl font-serif italic mb-4">{event.event_name}</h1>
        <div className="h-1 w-48 bg-[#D4AF37] mx-auto" />
      </div>

      <div className="relative z-10 w-full max-w-4xl space-y-8">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="bg-white/5 backdrop-blur-2xl border border-[#D4AF37]/30 p-10 flex items-center justify-between rounded-[3rem] shadow-2xl"
            >
              <div className="flex items-center gap-10">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center ${n.type === 'spray' ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-[#D4AF37]'}`}>
                  {n.type === 'spray' ? <Coins size={40} /> : <UserCheck size={40} />}
                </div>
                <div className="text-left">
                  <p className="text-[#D4AF37] text-[12px] font-black uppercase tracking-[0.4em] mb-2">{n.title}</p>
                  <h3 className="text-4xl md:text-5xl font-serif italic">{n.detail}</h3>
                </div>
              </div>
              {n.amount && (
                <div className="text-5xl md:text-7xl font-serif italic text-[#D4AF37]">
                  ₦{n.amount.toLocaleString()}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {notifications.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p className="text-gray-600 text-xl font-light tracking-[0.3em] uppercase">Waiting for the next big moment...</p>
          </motion.div>
        )}
      </div>

      <div className="fixed bottom-12 left-12 right-12 flex justify-between items-end">
        <div className="flex items-center gap-4">
          <Crown className="text-[#D4AF37]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Powered by EventHub NG</span>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Scan to RSVP / Spray</p>
          <p className="text-[#D4AF37] font-mono text-sm">eventhub.ng/event/{event.slug}</p>
        </div>
      </div>
    </div>
  );
};

export default VibeScreen;