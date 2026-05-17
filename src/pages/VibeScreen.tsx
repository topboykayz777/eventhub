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
    // Theme configs preserved from previous version
  };

  const processQueue = useCallback(async () => {
    if (isProcessingQueue.current || notificationQueue.current.length === 0) return;
    isProcessingQueue.current = true;
    
    const next = notificationQueue.current.shift()!;
    setActiveNotification(next);
    setActivities(prev => [next, ...prev].slice(0, 3));

    if (next.type === 'spray') {
      confetti({ 
        particleCount: 500, 
        spread: 160, 
        origin: { y: 0.6 }, 
        colors: ['#D4AF37', '#ffffff', '#F9E4B7'], 
        zIndex: 200,
        scalar: 2
      });
    }
    
    await new Promise(resolve => setTimeout(resolve, 5500));
    setActiveNotification(null);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    isProcessingQueue.current = false;
    processQueue();
  }, []);

  const addToQueue = useCallback((notif: Omit<VibeEvent, 'id' | 'config'>) => {
    const currentEvent = eventRef.current;
    const config = themeConfigs[currentEvent?.theme || 'modern'] || {};
    
    notificationQueue.current.push({ 
      ...notif, 
      id: Math.random().toString(36).substring(7), 
      config,
      timestamp: Date.now()
    } as VibeEvent);
    
    processQueue();
  }, [processQueue]);

  useEffect(() => {
    const fetchInitialAndSubscribe = async () => {
      if (!slug) return;
      
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug.trim())
        .maybeSingle();
      
      if (eventError || !eventData) {
        console.error("Event fetch error:", eventError);
        return;
      }

      setEvent(eventData);
      eventRef.current = eventData;
      
      const started = new Date() >= new Date(eventData.event_date);
      setIsLive(started && !eventData.is_finished);

      const [rsvpsRes, budgetRes] = await Promise.all([
        supabase.from('rsvps').select('checked_in').eq('event_id', eventData.id),
        supabase.from('budget_items').select('amount').eq('event_id', eventData.id).eq('status', 'approved').eq('type', 'income')
      ]);
      
      setStats({
        checkedIn: rsvpsRes.data?.filter(r => r.checked_in).length || 0,
        totalSprayed: budgetRes.data?.reduce((acc, curr) => acc + curr.amount, 0) || 0
      });

      // Proper Realtime Setup
      const channel = supabase
        .channel(`vibe-realtime-${eventData.id}`, {
          config: {
            broadcast: { self: true },
            presence: { key: eventData.id }
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'budget_items', filter: `event_id=eq.${eventData.id}` }, (payload) => {
          const isNewlyApproved = (payload.eventType === 'INSERT' && payload.new.status === 'approved') || 
            (payload.eventType === 'UPDATE' && payload.new.status === 'approved' && payload.old?.status !== 'approved');

          if (isNewlyApproved && payload.new.type === 'income') {
            const guestName = payload.new.description.replace('Digital Spray from ', '');
            addToQueue({ type: 'spray', title: 'Digital Spray Received', detail: guestName, amount: payload.new.amount });
            setStats(prev => ({ ...prev, totalSprayed: prev.totalSprayed + payload.new.amount }));
          }
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rsvps', filter: `event_id=eq.${eventData.id}` }, (payload) => {
          if (payload.new.checked_in && !payload.old?.checked_in) {
            addToQueue({ type: 'checkin', title: 'Guest Arrival', detail: payload.new.guest_name });
            setStats(prev => ({ ...prev, checkedIn: prev.checkedIn + 1 }));
          }
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'events', filter: `id=eq.${eventData.id}` }, (payload) => {
          setEvent(payload.new);
          eventRef.current = payload.new;
          if (payload.new.is_finished) setIsLive(false);
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') setConnectionStatus('online');
          else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') setConnectionStatus('offline');
        });

      return () => {
        // CRITICAL: Cleanup subscription to prevent memory leaks
        supabase.removeChannel(channel);
      };
    };
    
    fetchInitialAndSubscribe();
  }, [slug, addToQueue]);

  if (!event || isLive === null) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" /></div>;

  if (!isLive) return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-12 text-center">
      <Lock className="text-[#D4AF37] w-12 h-12 mb-12" />
      <h1 className="text-5xl md:text-7xl font-serif italic mb-6">Vibe Screen Inactive</h1>
      <Button onClick={() => navigate('/')} variant="outline" className="border-white/10 rounded-none px-12 py-8 text-[10px] font-bold uppercase tracking-widest">Return to Portal</Button>
    </div>
  );

  const config = themeConfigs[event.theme || 'modern'] || {};

  return (
    <div className={`min-h-screen ${config.bg || 'bg-[#050505]'} ${config.dark !== false ? 'text-white' : 'text-black'} overflow-hidden relative`}>
      <VibeHeroNotification event={activeNotification} />

      <div className="fixed top-6 left-6 z-[110]">
        <div className={`flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-md border ${
          connectionStatus === 'online' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
        }`}>
          {connectionStatus === 'online' ? <Wifi size={12} /> : <WifiOff size={12} />}
          <span className="text-[8px] font-black uppercase tracking-widest">{connectionStatus === 'online' ? 'Live Sync Active' : 'Offline'}</span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row h-screen">
        <div className="h-[45vh] lg:h-full lg:w-3/4 relative overflow-hidden">
          <VibeBackground mediaUrls={event.gallery_urls || []} fallbackUrl={event.photo_url} />
        </div>

        <div className={`h-[55vh] lg:h-full lg:w-1/4 ${config.glass || 'bg-white/5'} backdrop-blur-3xl border-t lg:border-t-0 lg:border-l ${config.border || 'border-white/10'} flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.4)]`}>
          <div className="p-6 lg:p-10 flex flex-col justify-between border-b border-white/5 shrink-0">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className={config.accent || 'text-[#D4AF37]'} size={16} />
                  <span className={`${config.accent || 'text-[#D4AF37]'} text-[10px] font-black tracking-[0.4em] uppercase`}>Live Feed</span>
                </div>
                <div className={`w-10 h-10 border-2 ${config.dark !== false ? 'border-[#D4AF37]' : 'border-black'} flex items-center justify-center rotate-45 shrink-0`}>
                  <span className={`${config.dark !== false ? 'text-[#D4AF37]' : 'text-black'} font-serif text-lg -rotate-45`}>E</span>
                </div>
              </div>
              <h1 className="text-2xl lg:text-4xl font-serif italic leading-tight line-clamp-2">{event.event_name}</h1>
            </div>
            <div className="mt-8">
              <VibeStats stats={stats} config={config} />
            </div>
          </div>

          <div className="flex-1 p-6 lg:p-10 overflow-hidden">
            <VibeSidebar activities={activities} config={config} />
          </div>

          <div className="p-6 lg:p-10 bg-black/20 mt-auto shrink-0 border-t border-white/5">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <span className="text-[7px] font-black uppercase tracking-[0.3em] opacity-30 block">Powered by EventHub Nigeria</span>
                <p className="text-[9px] font-bold tracking-[0.1em] uppercase opacity-50">Orchestration Suite v2.0</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_100px_rgba(34,197,94,0.5)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VibeScreen;