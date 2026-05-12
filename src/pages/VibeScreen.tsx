"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, UserCheck, Sparkles, Users, QrCode, Clock, Loader2, Megaphone } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '@/integrations/supabase/client';
import confetti from 'canvas-confetti';
import { useIsMobile } from '@/hooks/use-mobile';

interface Activity {
  id: string;
  type: 'spray' | 'rsvp';
  title: string;
  subtitle: string;
  amount?: number;
  timestamp: number;
}

const VibeScreen = () => {
  const { slug } = useParams();
  const isMobile = useIsMobile();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState({ rsvps: 0, sprays: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hostMessage, setHostMessage] = useState<string | null>(null);

  const addActivity = useCallback((activity: Omit<Activity, 'id' | 'timestamp'>) => {
    const newActivity = {
      ...activity,
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now()
    };
    
    if (activity.type === 'spray') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#ffffff']
      });
    }

    setActivities(prev => [newActivity, ...prev].slice(0, 5));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (slug) fetchEvent();
  }, [slug]);

  const fetchEvent = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .ilike('slug', slug?.trim() || '')
      .maybeSingle();

    if (data) {
      setEvent(data);
      setHostMessage(data.message);
      
      // Initial Stats
      const { count: rsvpCount } = await supabase.from('rsvps').select('*', { count: 'exact', head: true }).eq('event_id', data.id);
      const { data: sprays } = await supabase.from('budget_items').select('amount').eq('event_id', data.id).eq('type', 'income').ilike('description', '%Digital Spray%');
      
      setStats({
        rsvps: rsvpCount || 0,
        sprays: sprays?.reduce((acc, s) => acc + s.amount, 0) || 0
      });

      // Real-time Listeners
      const channel = supabase
        .channel(`vibe-screen-${data.id}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'events', filter: `id=eq.${data.id}` },
          (payload) => {
            console.log("[VibeScreen] Host update received:", payload.new.message);
            setHostMessage(payload.new.message);
          }
        )
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'rsvps', filter: `event_id=eq.${data.id}` },
          (payload) => {
            addActivity({
              type: 'rsvp',
              title: 'New Guest Confirmed',
              subtitle: payload.new.guest_name
            });
            setStats(prev => ({ ...prev, rsvps: prev.rsvps + 1 }));
          }
        )
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'budget_items', filter: `event_id=eq.${data.id}` },
          (payload) => {
            if (payload.new.type === 'income' && payload.new.description.includes('Digital Spray')) {
              addActivity({
                type: 'spray',
                title: 'Digital Spray Received',
                subtitle: payload.new.description,
                amount: payload.new.amount
              });
              setStats(prev => ({ ...prev, sprays: prev.sprays + payload.new.amount }));
            }
          }
        )
        .subscribe();

      setLoading(false);
      return () => { supabase.removeChannel(channel); };
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" />
    </div>
  );

  const eventUrl = `${window.location.origin}/event/${event.slug}`;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative font-serif">
      {/* Background Ambient Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#D4AF37]/5 blur-[150px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#D4AF37]/5 blur-[150px] animate-pulse" />

      <div className="relative z-10 h-screen flex flex-col p-8 md:p-16">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.6em] uppercase mb-4 block">Live Event Feed</span>
            <h1 className="text-5xl md:text-7xl italic leading-tight">{event.event_name}</h1>
          </motion.div>
          <div className="text-right">
            <div className="flex items-center gap-4 text-3xl md:text-4xl font-light tracking-widest mb-2">
              <Clock className="text-[#D4AF37] w-6 h-6 md:w-8 md:h-8" />
              {currentTime.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <p className="text-gray-500 text-xs md:text-sm uppercase tracking-[0.4em]">{currentTime.toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {/* Host Message Ticker */}
        <AnimatePresence mode="wait">
          {hostMessage && (
            <motion.div 
              key={hostMessage}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-12 bg-[#D4AF37]/10 border border-[#D4AF37]/30 p-6 md:p-8 rounded-[2rem] flex items-center gap-6"
            >
              <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-black flex items-center justify-center shrink-0">
                <Megaphone size={24} />
              </div>
              <div className="flex-1">
                <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.4em] mb-1">Host Announcement</p>
                <p className="text-2xl md:text-4xl font-light italic text-white">{hostMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-grow grid grid-cols-12 gap-12 md:gap-20">
          {/* Left: Live Feed */}
          <div className="col-span-12 lg:col-span-7 space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-gray-500 mb-8 flex items-center gap-4">
              <Sparkles className="text-[#D4AF37] w-4 h-4" /> Recent Activity
            </h2>
            
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {activities.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-700 text-2xl italic">
                    Waiting for the first celebration moment...
                  </motion.div>
                ) : (
                  activities.map((activity) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -50, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                      className="bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-[2.5rem] flex items-center justify-between group hover:bg-white/[0.04] transition-all"
                    >
                      <div className="flex items-center gap-6 md:gap-8">
                        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center ${activity.type === 'spray' ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-[#D4AF37]'}`}>
                          {activity.type === 'spray' ? <Coins size={28} /> : <UserCheck size={28} />}
                        </div>
                        <div>
                          <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.4em] mb-1">{activity.title}</p>
                          <p className="text-2xl md:text-4xl font-light italic">{activity.subtitle}</p>
                        </div>
                      </div>
                      {activity.amount && (
                        <div className="text-4xl md:text-6xl font-serif italic text-white">
                          ₦{activity.amount.toLocaleString()}
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Stats & QR */}
          <div className="col-span-12 lg:col-span-5 space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-[3rem] text-center">
                <Users className="text-[#D4AF37] w-8 h-8 mx-auto mb-4" />
                <p className="text-4xl md:text-6xl font-light mb-2">{stats.rsvps}</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">Guests Confirmed</p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-[3rem] text-center">
                <Coins className="text-[#D4AF37] w-8 h-8 mx-auto mb-4" />
                <p className="text-2xl md:text-4xl font-light mb-2">₦{stats.sprays.toLocaleString()}</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">Total Sprayed</p>
              </div>
            </div>

            <div className="bg-[#D4AF37] p-10 md:p-16 rounded-[4rem] text-black text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 -mr-16 -mt-16 rotate-45" />
              <div className="relative z-10">
                <QrCode className="w-10 h-10 mx-auto mb-6 opacity-50" />
                <h3 className="text-3xl md:text-4xl font-serif italic mb-4">Join the Celebration</h3>
                <p className="text-xs font-bold uppercase tracking-[0.2em] mb-8 opacity-60">Scan to RSVP or Spray the Host</p>
                
                <div className="bg-white p-6 md:p-8 rounded-[2.5rem] inline-block shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
                  <QRCodeSVG value={eventUrl} size={isMobile ? 180 : 240} level="H" />
                </div>
                
                <p className="mt-8 text-[10px] font-black uppercase tracking-[0.4em]">eventhub.ng/event/{event.slug}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Ticker */}
        <div className="mt-auto pt-8 border-t border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-500">Live Connection Established</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-500">© 2026 Event Hub Nigeria | The Art of Celebration</p>
        </div>
      </div>
    </div>
  );
};

export default VibeScreen;