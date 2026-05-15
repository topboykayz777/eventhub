"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Heart, Sparkles, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';

import VibeBackground from '@/components/vibe/VibeBackground';
import VibeHeroNotification, { VibeEvent } from '@/components/vibe/VibeHeroNotification';
import VibeStats from '@/components/vibe/VibeStats';
import VibeSidebar from '@/components/vibe/VibeSidebar';

const VibeScreen = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [isLive, setIsLive] = useState<boolean | null>(null);
  const [stats, setStats] = useState({ checkedIn: 0, totalSprayed: 0 });
  const [activities, setActivities] = useState<any[]>([]);
  const [activeNotification, setActiveNotification] = useState<VibeEvent | null>(null);
  const notificationQueue = useRef<VibeEvent[]>([]);
  const isProcessingQueue = useRef(false);

  const themeConfigs: Record<string, any> = {
    modern: { bg: "bg-[#050505]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/20", glass: "bg-white/5", dark: true },
    traditional: { bg: "bg-[#064e3b]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/30", glass: "bg-black/20", dark: true },
    elegant: { bg: "bg-[#f8f8f8]", accent: "text-black", border: "border-black/10", glass: "bg-white/80", dark: false },
    sahara: { bg: "bg-[#451a03]", accent: "text-[#fbbf24]", border: "border-[#fbbf24]/20", glass: "bg-black/20", dark: true },
    velvet: { bg: "bg-[#2e1065]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/20", glass: "bg-black/20", dark: true },
    garden: { bg: "bg-[#064e3b]", accent: "text-[#10b981]", border: "border-[#10b981]/20", glass: "bg-black/20", dark: true },
    oceanic: { bg: "bg-[#1e3a8a]", accent: "text-[#93c5fd]", border: "border-[#93c5fd]/20", glass: "bg-black/20", dark: true },
    rose: { bg: "bg-[#831843]", accent: "text-[#fbcfe8]", border: "border-[#fbcfe8]/20", glass: "bg-black/20", dark: true },
    earth: { bg: "bg-[#431407]", accent: "text-[#fb923c]", border: "border-[#fb923c]/20", glass: "bg-black/20", dark: true },
    silver: { bg: "bg-[#1f2937]", accent: "text-[#9ca3af]", border: "border-[#9ca3af]/20", glass: "bg-black/20", dark: true },
    dynasty: { bg: "bg-[#7f1d1d]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/20", glass: "bg-black/20", dark: true },
    vintage: { bg: "bg-[#fef3c7]", accent: "text-[#92400e]", border: "border-[#92400e]/20", glass: "bg-white/40", dark: false },
    onyx: { bg: "bg-[#050505]", accent: "text-[#06b6d4]", border: "border-[#06b6d4]/20", glass: "bg-white/5", dark: true },
    lavender: { bg: "bg-[#f5f3ff]", accent: "text-[#8b5cf6]", border: "border-[#8b5cf6]/20", glass: "bg-white/80", dark: false },
    midnight: { bg: "bg-[#020617]", accent: "text-[#38bdf8]", border: "border-[#38bdf8]/20", glass: "bg-white/5", dark: true },
    champagne: { bg: "bg-[#fafaf9]", accent: "text-[#d97706]", border: "border-[#d97706]/20", glass: "bg-white/80", dark: false },
    forest: { bg: "bg-[#022c22]", accent: "text-[#10b981]", border: "border-[#10b981]/20", glass: "bg-white/5", dark: true },
    sunset: { bg: "bg-[#451a03]", accent: "text-[#f97316]", border: "border-[#f97316]/20", glass: "bg-white/5", dark: true },
    marble: { bg: "bg-[#f9fafb]", accent: "text-[#111827]", border: "border-[#e5e7eb]", glass: "bg-white/80", dark: false },
    platinum: { bg: "bg-[#f3f4f6]", accent: "text-[#1f2937]", border: "border-[#d1d5db]", glass: "bg-white/80", dark: false }
  };

  const processQueue = useCallback(async () => {
    if (isProcessingQueue.current || notificationQueue.current.length === 0) return;
    isProcessingQueue.current = true;
    const next = notificationQueue.current.shift()!;
    
    setActiveNotification(next);
    setActivities(prev => [next, ...prev].slice(0, 10));

    if (next.type === 'spray') {
      confetti({ 
        particleCount: 300, 
        spread: 100, 
        origin: { y: 0.6 }, 
        colors: ['#D4AF37', '#ffffff', '#F9E4B7'], 
        zIndex: 200,
        scalar: 1.2
      });
    }
    
    await new Promise(resolve => setTimeout(resolve, 6000));
    setActiveNotification(null);
    await new Promise(resolve => setTimeout(resolve, 1000));
    isProcessingQueue.current = false;
    processQueue();
  }, []);

  const addToQueue = useCallback((notif: Omit<VibeEvent, 'id' | 'config'>) => {
    const config = themeConfigs[event?.theme || 'modern'];
    notificationQueue.current.push({ 
      ...notif, 
      id: Math.random().toString(36).substring(7), 
      config,
      timestamp: Date.now()
    } as VibeEvent);
    processQueue();
  }, [event?.theme, processQueue]);

  useEffect(() => {
    const fetchInitial = async () => {
      if (!slug) return;
      const { data: eventData } = await supabase.from('events').select('*').ilike('slug', slug.trim()).maybeSingle();
      if (eventData) {
        setEvent(eventData);
        const started = new Date() >= new Date(eventData.event_date);
        setIsLive(started && !eventData.is_finished);

        const { data: rsvps } = await supabase.from('rsvps').select('checked_in').eq('event_id', eventData.id);
        const { data: budget } = await supabase.from('budget_items').select('amount').eq('event_id', eventData.id).eq('status', 'approved').eq('type', 'income');
        
        setStats({
          checkedIn: rsvps?.filter(r => r.checked_in).length || 0,
          totalSprayed: budget?.reduce((acc, curr) => acc + curr.amount, 0) || 0
        });

        const channel = supabase
          .channel(`vibe-live-${eventData.id}`)
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'budget_items', filter: `event_id=eq.${eventData.id}` }, (payload) => {
            if (payload.new.status === 'approved' && payload.old.status === 'pending') {
              const guestName = payload.new.description.replace('Digital Spray from ', '');
              addToQueue({ type: 'spray', title: 'Digital Spray Received', detail: guestName, amount: payload.new.amount });
              setStats(prev => ({ ...prev, totalSprayed: prev.totalSprayed + payload.new.amount }));
            }
          })
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rsvps', filter: `event_id=eq.${eventData.id}` }, (payload) => {
            if (payload.new.checked_in && !payload.old.checked_in) {
              addToQueue({ type: 'checkin', title: 'Guest Arrival', detail: payload.new.guest_name });
              setStats(prev => ({ ...prev, checkedIn: prev.checkedIn + 1 }));
            }
          })
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'events', filter: `id=eq.${eventData.id}` }, (payload) => {
            setEvent(payload.new);
            if (payload.new.message !== payload.old.message && payload.new.message) {
              addToQueue({ type: 'message', title: "Host's Live Update", detail: payload.new.message });
            }
            if (payload.new.is_finished) setIsLive(false);
          })
          .subscribe();

        return () => { supabase.removeChannel(channel); };
      }
    };
    fetchInitial();
  }, [slug, addToQueue]);

  if (!event || isLive === null) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="w-16 h-16 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" /></div>;

  if (!isLive) return <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-12 text-center"><Lock className="text-[#D4AF37] w-10 h-10 mb-12" /><h1 className="text-5xl font-serif italic mb-6">Vibe Screen Inactive</h1><Button onClick={() => navigate('/')} variant="outline">Return to Portal</Button></div>;

  const config = themeConfigs[event.theme || 'modern'];
  const isDark = config.dark !== false;

  return (
    <div className={`min-h-screen ${config.bg} ${isDark ? 'text-white' : 'text-black'} overflow-hidden relative`}>
      <VibeBackground mediaUrls={event.gallery_urls || []} fallbackUrl={event.photo_url} />
      
      {/* Cinematic Scrims for Visibility */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        <div className={`absolute top-0 left-0 right-0 h-64 bg-gradient-to-b ${isDark ? 'from-black/80' : 'from-white/60'} to-transparent`} />
        <div className={`absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t ${isDark ? 'from-black/80' : 'from-white/60'} to-transparent`} />
      </div>

      <VibeHeroNotification event={activeNotification} />

      <div className="relative z-10 flex h-screen">
        {/* Left Section: Pure Memory Wall (70%) */}
        <div className="flex-1" />

        {/* Right Section: Live Sidebar (30%) */}
        <div className={`w-[480px] ${config.glass} backdrop-blur-3xl border-l ${config.border} p-10 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.3)]`}>
          {/* Sidebar Header: Event Identity */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className={config.accent} size={18} />
              <span className={`${config.accent} text-[10px] font-black tracking-[0.5em] uppercase block`}>Live Celebration Feed</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif italic leading-tight mb-6 drop-shadow-xl">{event.event_name}</h1>
            <div className={`h-1 w-32 bg-gradient-to-r ${isDark ? 'from-[#D4AF37] to-transparent' : 'from-black to-transparent'}`} />
          </div>

          {/* Sidebar Stats */}
          <div className="mb-10">
            <VibeStats stats={stats} config={config} />
          </div>

          {/* Sidebar Activity Stream (Flexible) */}
          <div className="flex-1 min-h-0 mb-10">
            <VibeSidebar activities={activities} config={config} />
          </div>

          {/* Sidebar Footer: Host Message & Branding */}
          <div className="space-y-8 pt-8 border-t border-white/10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Heart className={config.accent} size={16} />
                <span className="text-[8px] font-black uppercase tracking-widest opacity-50">The Host's Message</span>
              </div>
              <p className="text-xl font-light leading-relaxed italic opacity-90">"{event.message || 'Thank you for being part of our special day.'}"</p>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className={`w-12 h-12 border-2 ${isDark ? 'border-[#D4AF37]' : 'border-black'} flex items-center justify-center rotate-45 shrink-0`}>
                <span className={`${isDark ? 'text-[#D4AF37]' : 'text-black'} font-serif text-xl -rotate-45`}>E</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[7px] font-black uppercase tracking-[0.4em] opacity-40 block">Powered by EventHub Nigeria</span>
                <p className="text-sm font-light tracking-[0.1em] uppercase opacity-80">Orchestration Suite</p>
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3 mb-1">
                <Globe size={12} className="opacity-30" />
                <p className="text-[7px] font-black uppercase tracking-widest opacity-30">Live Portal</p>
              </div>
              <p className="text-sm font-medium tracking-widest truncate">eventhub.ng/event/{event.slug}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VibeScreen;