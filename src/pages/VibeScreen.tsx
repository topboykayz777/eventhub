"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, UserCheck, Sparkles, Heart, Camera, Music } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VibeNotification {
  id: string;
  type: 'spray' | 'checkin' | 'rsvp' | 'gallery';
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

  const fetchInitialData = useCallback(async () => {
    if (!slug) return;
    
    try {
      const { data: eventData } = await supabase
        .from('events')
        .select('*')
        .ilike('slug', slug.trim())
        .maybeSingle();

      if (eventData) {
        setEvent(eventData);
        
        const { data: rsvps } = await supabase.from('rsvps').select('checked_in').eq('event_id', eventData.id);
        const { data: budget } = await supabase.from('budget_items').select('amount').eq('event_id', eventData.id).eq('type', 'income');
        
        setStats({
          rsvps: rsvps?.length || 0,
          checkedIn: rsvps?.filter(r => r.checked_in).length || 0,
          totalSprayed: budget?.reduce((acc, curr) => acc + curr.amount, 0) || 0
        });

        // Real-time Orchestration
        const channel = supabase
          .channel(`vibe-live-${eventData.id}`)
          .on('postgres_changes', 
            { event: 'INSERT', schema: 'public', table: 'budget_items', filter: `event_id=eq.${eventData.id}` }, 
            (payload) => {
              if (payload.new.type === 'income' && payload.new.description.includes('Digital Spray')) {
                const guestName = payload.new.description.replace('Digital Spray from ', '');
                addNotification({ 
                  type: 'spray', 
                  title: 'Digital Spray Received', 
                  detail: `${guestName} just honored the host`, 
                  amount: payload.new.amount 
                });
                setStats(prev => ({ ...prev, totalSprayed: prev.totalSprayed + payload.new.amount }));
              }
            }
          )
          .on('postgres_changes', 
            { event: 'UPDATE', schema: 'public', table: 'rsvps', filter: `event_id=eq.${eventData.id}` }, 
            (payload) => {
              if (payload.new.checked_in && !payload.old.checked_in) {
                addNotification({ 
                  type: 'checkin', 
                  title: 'Guest Arrival', 
                  detail: `${payload.new.guest_name} has entered the celebration` 
                });
                setStats(prev => ({ ...prev, checkedIn: prev.checkedIn + 1 }));
              }
            }
          )
          .on('postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'rsvps', filter: `event_id=eq.${eventData.id}` },
            (payload) => {
              addNotification({
                type: 'rsvp',
                title: 'New RSVP Confirmed',
                detail: `${payload.new.guest_name} is joining the guest list`
              });
              setStats(prev => ({ ...prev, rsvps: prev.rsvps + 1 }));
            }
          )
          .on('postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'events', filter: `id=eq.${eventData.id}` },
            (payload) => {
              setEvent(payload.new);
              if (payload.new.gallery_urls?.length > payload.old.gallery_urls?.length) {
                addNotification({
                  type: 'gallery',
                  title: 'New Memories Captured',
                  detail: 'Fresh photos have been added to the gallery'
                });
              }
            }
          )
          .subscribe();

        return () => { supabase.removeChannel(channel); };
      }
    } catch (error) {
      console.error('Vibe Error:', error);
    }
  }, [slug]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const addNotification = (notif: Omit<VibeNotification, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).substring(7);
    const newNotif = { ...notif, id, timestamp: Date.now() };
    
    setNotifications(prev => [newNotif, ...prev].slice(0, 5));
    
    if (notif.type === 'spray') {
      confetti({ 
        particleCount: 150, 
        spread: 70, 
        origin: { y: 0.6 }, 
        colors: ['#D4AF37', '#ffffff', '#F9E4B7'],
        zIndex: 1000
      });
    }

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 20000); // Keep on screen longer for TV visibility
  };

  if (!event) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-8" />
        <p className="text-[#D4AF37] font-serif italic text-3xl tracking-widest animate-pulse">Initializing Vibe...</p>
      </div>
    </div>
  );

  const theme = event.theme || 'modern';
  const themeConfigs: Record<string, any> = {
    modern: { bg: "bg-[#050505]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/20", glass: "bg-white/5", glow: "shadow-[#D4AF37]/10" },
    traditional: { bg: "bg-[#064e3b]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/30", glass: "bg-black/20", glow: "shadow-[#D4AF37]/20" },
    elegant: { bg: "bg-[#f8f8f8]", accent: "text-black", border: "border-black/10", glass: "bg-white/80", glow: "shadow-black/5", dark: false },
    sahara: { bg: "bg-[#451a03]", accent: "text-[#fbbf24]", border: "border-[#fbbf24]/20", glass: "bg-black/20", glow: "shadow-[#fbbf24]/10" },
    velvet: { bg: "bg-[#2e1065]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/20", glass: "bg-black/20", glow: "shadow-[#D4AF37]/10" },
    garden: { bg: "bg-[#064e3b]", accent: "text-[#10b981]", border: "border-[#10b981]/20", glass: "bg-black/20", glow: "shadow-[#10b981]/10" },
    oceanic: { bg: "bg-[#1e3a8a]", accent: "text-[#93c5fd]", border: "border-[#93c5fd]/20", glass: "bg-black/20", glow: "shadow-[#93c5fd]/10" },
    rose: { bg: "bg-[#831843]", accent: "text-[#fbcfe8]", border: "border-[#fbcfe8]/20", glass: "bg-black/20", glow: "shadow-[#fbcfe8]/10" },
    earth: { bg: "bg-[#431407]", accent: "text-[#fb923c]", border: "border-[#fb923c]/20", glass: "bg-black/20", glow: "shadow-[#fb923c]/10" },
    silver: { bg: "bg-[#1f2937]", accent: "text-[#9ca3af]", border: "border-[#9ca3af]/20", glass: "bg-black/20", glow: "shadow-[#9ca3af]/10" },
    dynasty: { bg: "bg-[#7f1d1d]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/20", glass: "bg-black/20", glow: "shadow-[#D4AF37]/10" },
    vintage: { bg: "bg-[#fef3c7]", accent: "text-[#92400e]", border: "border-[#92400e]/20", glass: "bg-white/40", glow: "shadow-[#92400e]/10", dark: false }
  };

  const config = themeConfigs[theme] || themeConfigs.modern;
  const isDark = config.dark !== false;

  return (
    <div className={`min-h-screen ${config.bg} ${isDark ? 'text-white' : 'text-black'} overflow-hidden flex flex-col relative`}>
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0">
        <motion.img 
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          src={event.photo_url} 
          className="w-full h-full object-cover blur-2xl" 
          alt="" 
        />
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-transparent via-black/40 to-black' : 'bg-gradient-to-b from-transparent via-white/40 to-white'}`} />
      </div>

      <div className="relative z-10 flex flex-col h-screen p-12 lg:p-20">
        {/* Header - Large & Elegant */}
        <div className="flex justify-between items-start mb-20">
          <motion.div 
            initial={{ opacity: 0, y: -50 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className={`${config.accent} text-sm font-bold tracking-[1em] uppercase mb-6 block`}>
              Live Celebration Feed
            </span>
            <h1 className="text-6xl lg:text-9xl font-serif italic leading-tight mb-4">
              {event.event_name}
            </h1>
            <div className={`h-1 w-64 bg-gradient-to-r ${isDark ? 'from-[#D4AF37] to-transparent' : 'from-black to-transparent'}`} />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="text-right"
          >
            <p className="text-sm font-bold uppercase tracking-[0.5em] opacity-50 mb-4">Engagement Stats</p>
            <div className="flex gap-12">
              <div>
                <p className="text-4xl lg:text-6xl font-serif italic mb-1">{stats.checkedIn}</p>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Verified Guests</p>
              </div>
              <div>
                <p className={`${config.accent} text-4xl lg:text-6xl font-serif italic mb-1`}>₦{stats.totalSprayed.toLocaleString()}</p>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Digital Sprays</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Feed Area */}
        <div className="flex-grow grid grid-cols-12 gap-12">
          <div className="col-span-8">
            <AnimatePresence mode="popLayout">
              {notifications.length > 0 ? (
                notifications.map((n, i) => (
                  <motion.div
                    key={n.id}
                    layout
                    initial={{ opacity: 0, x: -100, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, x: 50 }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className={`${config.glass} backdrop-blur-3xl p-10 lg:p-16 flex items-center justify-between rounded-[4rem] border ${config.border} ${config.glow} mb-8`}
                  >
                    <div className="flex items-center gap-12">
                      <div className={`w-24 h-24 lg:w-32 lg:h-32 rounded-full flex items-center justify-center shrink-0 ${
                        n.type === 'spray' ? 'bg-[#D4AF37] text-black' : 
                        n.type === 'checkin' ? 'bg-green-500 text-white' :
                        n.type === 'gallery' ? 'bg-blue-500 text-white' : 'bg-white/10 text-[#D4AF37]'
                      }`}>
                        {n.type === 'spray' ? <Coins size={48} /> : 
                         n.type === 'checkin' ? <UserCheck size={48} /> :
                         n.type === 'gallery' ? <Camera size={48} /> : <Sparkles size={48} />}
                      </div>
                      <div>
                        <p className={`${config.accent} text-xs font-black uppercase tracking-[0.6em] mb-3`}>
                          {n.title}
                        </p>
                        <h3 className="text-4xl lg:text-6xl font-serif italic leading-tight">
                          {n.detail}
                        </h3>
                      </div>
                    </div>
                    {n.amount && (
                      <div className="text-6xl lg:text-8xl font-serif italic text-[#D4AF37] ml-8">
                        ₦{n.amount.toLocaleString()}
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center border border-dashed border-white/5 rounded-[5rem]">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="text-gray-800 w-24 h-24 mb-8 opacity-20" />
                  </motion.div>
                  <p className="text-gray-600 text-2xl font-light tracking-[0.5em] uppercase">
                    The celebration is in motion...
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar - Event Info */}
          <div className="col-span-4 space-y-8">
            <div className={`${config.glass} backdrop-blur-2xl p-12 rounded-[4rem] border ${config.border}`}>
              <div className="flex items-center gap-6 mb-8">
                <Heart className={config.accent} size={32} />
                <h4 className="text-xl font-serif italic">The Host's Message</h4>
              </div>
              <p className="text-2xl font-light leading-relaxed italic opacity-80">
                "{event.message || 'Thank you for being part of our special day. Your presence makes this celebration complete.'}"
              </p>
            </div>

            <div className={`${config.glass} backdrop-blur-2xl p-12 rounded-[4rem] border ${config.border}`}>
              <div className="flex items-center gap-6 mb-8">
                <Music className={config.accent} size={32} />
                <h4 className="text-xl font-serif italic">Celebration Vibe</h4>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-40">Venue</span>
                  <span className="text-lg font-light">{event.venue}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-40">Date</span>
                  <span className="text-lg font-light">
                    {new Date(event.event_date).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Minimal & Clean */}
        <div className="mt-auto pt-12 flex justify-between items-end border-t border-white/5">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 border border-[#D4AF37] flex items-center justify-center rotate-45">
              <span className="text-[#D4AF37] font-serif text-xl -rotate-45">E</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.5em] opacity-30">
              Powered by EventHub Nigeria Orchestration Suite
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-widest opacity-30 mb-2">Live Portal</p>
            <p className="text-xl font-light tracking-widest">eventhub.ng/event/{event.slug}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VibeScreen;