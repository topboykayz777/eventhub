"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Heart, Sparkles, Wifi, WifiOff, Loader2 } from 'lucide-react';
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
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'online' | 'offline'>('connecting');
  
  const notificationQueue = useRef<VibeEvent[]>([]);
  const isProcessingQueue = useRef(false);
  const eventRef = useRef<any>(null);

  const themeConfigs: Record<string, any> = {
    modern: { bg: "bg-[#050505]", accent: "text-[#D4AF37]", glass: "bg-white/5", border: "border-white/10", dark: true },
    traditional: { bg: "bg-[#064e3b]", accent: "text-[#D4AF37]", glass: "bg-black/20", border: "border-[#D4AF37]/20", dark: true },
    elegant: { bg: "bg-[#f8f8f8]", accent: "text-black", glass: "bg-white/80", border: "border-gray-200", dark: false },
    sahara: { bg: "bg-[#451a03]", accent: "text-[#fbbf24]", glass: "bg-black/20", border: "border-[#fbbf24]/20", dark: true },
    velvet: { bg: "bg-[#2e1065]", accent: "text-[#D4AF37]", glass: "bg-black/20", border: "border-[#D4AF37]/20", dark: true },
    garden: { bg: "bg-[#064e3b]", accent: "text-[#10b981]", glass: "bg-black/20", border: "border-[#10b981]/20", dark: true },
    oceanic: { bg: "bg-[#1e3a8a]", accent: "text-[#93c5fd]", glass: "bg-black/20", border: "border-[#93c5fd]/20", dark: true },
    rose: { bg: "bg-[#831843]", accent: "text-[#fbcfe8]", glass: "bg-black/20", border: "border-[#fbcfe8]/20", dark: true },
    earth: { bg: "bg-[#431407]", accent: "text-[#fb923c]", glass: "bg-black/20", border: "border-[#fb923c]/20", dark: true },
    silver: { bg: "bg-[#1f2937]", accent: "text-[#9ca3af]", glass: "bg-black/20", border: "border-[#9ca3af]/20", dark: true },
    dynasty: { bg: "bg-[#7f1d1d]", accent: "text-[#D4AF37]", glass: "bg-black/20", border: "border-[#D4AF37]/20", dark: true },
    vintage: { bg: "bg-[#fef3c7]", accent: "text-[#92400e]", glass: "bg-white/40", border: "border-[#92400e]/20", dark: false },
    neon: { bg: "bg-black", accent: "text-[#00f3ff]", glass: "bg-[#00f3ff]/5", border: "border-[#00f3ff]/30", dark: true },
    royal: { bg: "bg-[#3b0764]", accent: "text-[#D4AF37]", glass: "bg-black/20", border: "border-[#D4AF37]/20", dark: true },
    blossom: { bg: "bg-[#fff1f2]", accent: "text-[#f43f5e]", glass: "bg-white/80", border: "border-pink-200", dark: false },
    tropic: { bg: "bg-[#022c22]", accent: "text-[#10b981]", glass: "bg-black/20", border: "border-[#10b981]/20", dark: true },
    desert: { bg: "bg-[#451a03]", accent: "text-[#f97316]", glass: "bg-black/20", border: "border-[#f97316]/20", dark: true },
    glitch: { bg: "bg-black", accent: "text-red-600", glass: "bg-red-900/5", border: "border-red-600/30", dark: true },
    minimal: { bg: "bg-[#f9fafb]", accent: "text-[#2563eb]", glass: "bg-white/80", border: "border-gray-300", dark: false },
    noir: { bg: "bg-[#0a0a0a]", accent: "text-white", glass: "bg-white/5", border: "border-white/20", dark: true }
  };

  const processQueue = useCallback(async () => {
    if (isProcessingQueue.current || notificationQueue.current.length === 0) return;
    isProcessingQueue.current = true;
    const next = notificationQueue.current.shift()!;
    setActiveNotification(next);
    setActivities(prev => [next, ...prev].slice(0, 3));
    if (next.type === 'spray') {
      confetti({ particleCount: 500, spread: 160, origin: { y: 0.6 }, colors: ['#D4AF37', '#ffffff', '#F9E4B7'], zIndex: 200, scalar: 2 });
    }
    await new Promise(resolve => setTimeout(resolve, 5500));
    setActiveNotification(null);
    await new Promise(resolve => setTimeout(resolve, 800));
    isProcessingQueue.current = false;
    processQueue();
  }, []);

  const addToQueue = useCallback((notif: Omit<VibeEvent, 'id' | 'config'>) => {
    const config = themeConfigs[eventRef.current?.theme || 'modern'] || themeConfigs.modern;
    notificationQueue.current.push({ ...notif, id: Math.random().toString(36).substring(7), config, timestamp: Date.now() } as VibeEvent);
    processQueue();
  }, [processQueue]);

  useEffect(() => {
    const fetchInitialAndSubscribe = async () => {
      if (!slug) return;
      const { data: eventData } = await supabase.from('events').select('*').eq('slug', slug.trim()).maybeSingle();
      if (!eventData) return;
      setEvent(eventData);
      eventRef.current = eventData;
      setIsLive(new Date() >= new Date(eventData.event_date) && !eventData.is_finished);

      const [rsvpsRes, budgetRes] = await Promise.all([
        supabase.from('rsvps').select('checked_in').eq('event_id', eventData.id),
        supabase.from('budget_items').select('amount').eq('event_id', eventData.id).eq('status', 'approved').eq('type', 'income')
      ]);
      setStats({ checkedIn: rsvpsRes.data?.filter(r => r.checked_in).length || 0, totalSprayed: budgetRes.data?.reduce((acc, curr) => acc + curr.amount, 0) || 0 });

      const channel = supabase.channel(`vibe-realtime-${eventData.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'budget_items', filter: `event_id=eq.${eventData.id}` }, (payload) => {
          const anyNew = payload.new as any;
          const anyOld = payload.old as any;
          if (anyNew.status === 'approved' && (payload.eventType === 'INSERT' || anyOld?.status !== 'approved')) {
            const guestName = anyNew.description.replace('Digital Spray from ', '');
            addToQueue({ type: 'spray', title: 'Digital Spray Received', detail: guestName, amount: anyNew.amount });
            setStats(prev => ({ ...prev, totalSprayed: prev.totalSprayed + anyNew.amount }));
          }
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rsvps', filter: `event_id=eq.${eventData.id}` }, (payload) => {
          const anyNew = payload.new as any;
          const anyOld = payload.old as any;
          if (anyNew.checked_in && !anyOld?.checked_in) {
            addToQueue({ type: 'checkin', title: 'Guest Arrival', detail: anyNew.guest_name });
            setStats(prev => ({ ...prev, checkedIn: prev.checkedIn + 1 }));
          }
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'events', filter: `id=eq.${eventData.id}` }, (payload) => {
          const anyNew = payload.new as any;
          setEvent(anyNew);
          eventRef.current = anyNew;
          if (anyNew.is_finished) setIsLive(false);
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') setConnectionStatus('online');
          else setConnectionStatus('offline');
        });
      return () => { supabase.removeChannel(channel); };
    };
    fetchInitialAndSubscribe();
  }, [slug, addToQueue]);

  if (!event || isLive === null) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" /></div>;
  if (!isLive) return <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-12 text-center"><Lock className="text-[#D4AF37] w-12 h-12 mb-12" /><h1 className="text-5xl md:text-7xl font-serif italic mb-6">Vibe Screen Inactive</h1><Button onClick={() => navigate('/')} variant="outline" className="border-white/10 rounded-none px-12 py-8 text-[10px] font-bold uppercase tracking-widest">Return to Portal</Button></div>;

  const config = themeConfigs[event.theme || 'modern'] || themeConfigs.modern;

  return (
    <div className={`min-h-screen ${config.bg} ${config.dark !== false ? 'text-white' : 'text-black'} overflow-hidden relative`}>
      <VibeHeroNotification event={activeNotification} />
      <div className="fixed top-6 left-6 z-[110] flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 bg-black/20">
        {connectionStatus === 'online' ? <Wifi size={12} className="text-green-500" /> : <WifiOff size={12} className="text-red-500" />}
        <span className="text-[8px] font-black uppercase tracking-widest">{connectionStatus === 'online' ? 'Live Sync Active' : 'Offline'}</span>
      </div>
      <div className="relative z-10 flex flex-col lg:flex-row h-screen">
        <div className="h-[45vh] lg:h-full lg:w-3/4 relative overflow-hidden"><VibeBackground mediaUrls={event.gallery_urls || []} fallbackUrl={event.photo_url} /></div>
        <div className={`h-[55vh] lg:h-full lg:w-1/4 ${config.glass} backdrop-blur-3xl border-t lg:border-t-0 lg:border-l ${config.border} flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.4)]`}>
          <div className="p-6 lg:p-10 flex flex-col justify-between border-b border-white/5 shrink-0">
            <div className="space-y-6"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><Sparkles className={config.accent} size={16} /><span className={`${config.accent} text-[10px] font-black tracking-[0.4em] uppercase`}>Live Feed</span></div><div className={`w-10 h-10 border-2 ${config.dark !== false ? 'border-[#D4AF37]' : 'border-black'} flex items-center justify-center rotate-45 shrink-0`}><span className={`${config.dark !== false ? 'text-[#D4AF37]' : 'text-black'} font-serif text-lg -rotate-45`}>E</span></div></div><h1 className="text-2xl lg:text-4xl font-serif italic leading-tight line-clamp-2">{event.event_name}</h1></div>
            <div className="mt-8"><VibeStats stats={stats} config={config} /></div>
          </div>
          <div className="flex-1 p-6 lg:p-10 overflow-hidden"><VibeSidebar activities={activities} config={config} /></div>
          <div className="p-6 lg:p-10 bg-black/20 mt-auto shrink-0 border-t border-white/5 text-center"><div className="space-y-1"><span className="text-[7px] font-black uppercase tracking-[0.3em] opacity-30 block">Powered by EventHub Nigeria</span></div></div>
        </div>
      </div>
    </div>
  );
};

export default VibeScreen;