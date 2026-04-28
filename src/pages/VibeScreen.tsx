"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, UserCheck, Sparkles, Heart, Crown, Music, QrCode, Users } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';

interface VibeNotification {
  id: string;
  type: 'spray' | 'checkin' | 'rsvp' | 'song';
  title: string;
  detail: string;
  amount?: number;
  timestamp: number;
}

const VibeScreen = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [notifications, setNotifications] = useState<VibeNotification[]>([]);
  const [stats, setStats] = useState({ rsvps: 0, checkedIn: 0, totalSprayed: 0 });

  const fetchEventAndStats = useCallback(async () => {
    if (!slug) return;
    
    const { data: eventData } = await supabase
      .from('events')
      .select('*')
      .ilike('slug', slug.trim())
      .maybeSingle();

    if (eventData) {
      setEvent(eventData);
      
      // Fetch initial stats
      const { data: rsvps } = await supabase.from('rsvps').select('checked_in').eq('event_id', eventData.id);
      const { data: budget } = await supabase.from('budget_items').select('amount').eq('event_id', eventData.id).eq('type', 'income');
      
      setStats({
        rsvps: rsvps?.length || 0,
        checkedIn: rsvps?.filter(r => r.checked_in).length || 0,
        totalSprayed: budget?.reduce((acc, curr) => acc + curr.amount, 0) || 0
      });

      setupRealtime(eventData.id);
    }
  }, [slug]);

  useEffect(() => {
    fetchEventAndStats();
  }, [fetchEventAndStats]);

  const addNotification = (notif: Omit<VibeNotification, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).substring(7);
    const newNotif = { ...notif, id, timestamp: Date.now() };
    
    setNotifications(prev => [newNotif, ...prev].slice(0, 4));
    
    if (notif.type === 'spray') {
      confetti({ 
        particleCount: 150, 
        spread: 70, 
        origin: { y: 0.6 }, 
        colors: ['#D4AF37', '#ffffff', '#F9E4B7'],
        zIndex: 1000
      });
    }

    // Auto-remove after 15 seconds to keep the screen clean
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 15000);
  };

  const setupRealtime = (eventId: string) => {
    const channel = supabase
      .channel(`vibe-live-${eventId}`)
      .on(
        'postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'budget_items', filter: `event_id=eq.${eventId}` }, 
        (payload) => {
          if (payload.new.type === 'income' && payload.new.description.includes('Digital Spray')) {
            addNotification({ 
              type: 'spray', 
              title: 'New Digital Spray!', 
              detail: payload.new.description, 
              amount: payload.new.amount 
            });
            setStats(prev => ({ ...prev, totalSprayed: prev.totalSprayed + payload.new.amount }));
          }
        }
      )
      .on(
        'postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'rsvps', filter: `event_id=eq.${eventId}` }, 
        (payload) => {
          if (payload.new.checked_in && !payload.old.checked_in) {
            addNotification({ 
              type: 'checkin', 
              title: 'Guest Verified', 
              detail: `${payload.new.guest_name} has arrived` 
            });
            setStats(prev => ({ ...prev, checkedIn: prev.checkedIn + 1 }));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'rsvps', filter: `event_id=eq.${eventId}` },
        (payload) => {
          addNotification({
            type: 'rsvp',
            title: 'New RSVP',
            detail: `${payload.new.guest_name} is joining the celebration`
          });
          setStats(prev => ({ ...prev, rsvps: prev.rsvps + 1 }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  if (!event) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <motion.div 
        animate={{ opacity: [0.4, 1, 0.4] }} 
        transition={{ duration: 2, repeat: Infinity }}
        className="text-[#D4AF37] font-serif italic text-2xl tracking-widest"
      >
        Initializing Vibe...
      </motion.div>
    </div>
  );

  const eventUrl = `${window.location.origin}/event/${event.slug}`;

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden flex flex-col p-12 md:p-20 relative">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          src={event.photo_url} 
          className="w-full h-full object-cover opacity-20 blur-2xl" 
          alt="" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80" />
      </div>

      {/* Header Section */}
      <div className="relative z-10 flex justify-between items-start mb-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="text-[#D4AF37] text-[12px] font-bold tracking-[0.8em] uppercase mb-6 block">Live Celebration Feed</span>
          <h1 className="text-6xl md:text-8xl font-serif italic leading-tight mb-4">{event.event_name}</h1>
          <div className="h-1 w-48 bg-gradient-to-r from-[#D4AF37] to-transparent" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="hidden md:flex flex-col items-end gap-6"
        >
          <div className="bg-white p-4 rounded-[2rem] shadow-2xl border-4 border-[#D4AF37]/20">
            <QRCodeSVG value={eventUrl} size={180} level="H" />
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-2">Scan to RSVP & Spray</p>
            <p className="text-gray-500 font-mono text-xs">{eventUrl.replace('https://', '')}</p>
          </div>
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-grow grid md:grid-cols-12 gap-20 items-center">
        {/* Notifications Column */}
        <div className="md:col-span-8 space-y-8">
          <AnimatePresence mode="popLayout">
            {notifications.map((n) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, x: -100, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, x: 50 }}
                className="glass-premium p-10 flex items-center justify-between rounded-[3.5rem] border border-[#D4AF37]/30 shadow-[0_0_50px_-12px_rgba(212,175,55,0.2)]"
              >
                <div className="flex items-center gap-10">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center shrink-0 ${
                    n.type === 'spray' ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-[#D4AF37]'
                  }`}>
                    {n.type === 'spray' ? <Coins size={40} /> : n.type === 'checkin' ? <UserCheck size={40} /> : <Users size={40} />}
                  </div>
                  <div className="text-left">
                    <p className="text-[#D4AF37] text-[12px] font-black uppercase tracking-[0.5em] mb-2">{n.title}</p>
                    <h3 className="text-4xl md:text-5xl font-serif italic text-white">{n.detail}</h3>
                  </div>
                </div>
                {n.amount && (
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-5xl md:text-7xl font-serif italic text-[#D4AF37] pr-6"
                  >
                    ₦{n.amount.toLocaleString()}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {notifications.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="h-64 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-[3.5rem]"
            >
              <Sparkles className="text-gray-800 w-12 h-12 mb-6" />
              <p className="text-gray-600 text-xl font-light tracking-[0.4em] uppercase">Waiting for the next big moment...</p>
            </motion.div>
          )}
        </div>

        {/* Stats Column */}
        <div className="md:col-span-4 space-y-8">
          <div className="glass-premium p-10 rounded-[3rem] border border-white/5">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500 mb-6">Total Digital Sprays</p>
            <div className="text-5xl font-serif italic text-[#D4AF37]">₦{stats.totalSprayed.toLocaleString()}</div>
          </div>
          <div className="glass-premium p-10 rounded-[3rem] border border-white/5">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500 mb-6">Guest Attendance</p>
            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-serif italic text-white">{stats.checkedIn}</span>
              <span className="text-gray-600 text-xl font-light">/ {stats.rsvps} Verified</span>
            </div>
          </div>
          
          {/* Mobile QR */}
          <div className="md:hidden flex flex-col items-center gap-6 pt-8">
            <div className="bg-white p-4 rounded-[2rem]">
              <QRCodeSVG value={eventUrl} size={140} />
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Scan to Join the Celebration</p>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="relative z-10 mt-auto pt-12 flex justify-between items-end border-t border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 border border-[#D4AF37] flex items-center justify-center rotate-45">
            <span className="text-[#D4AF37] font-serif text-sm -rotate-45">E</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-600">Powered by EventHub Nigeria</span>
        </div>
        <div className="flex gap-12">
          <div className="text-right">
            <p className="text-[8px] font-bold uppercase tracking-widest text-gray-600 mb-1">Venue</p>
            <p className="text-sm font-light">{event.venue}</p>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-bold uppercase tracking-widest text-gray-600 mb-1">Date</p>
            <p className="text-sm font-light">{new Date(event.event_date).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VibeScreen;