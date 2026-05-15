"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Heart, Sparkles } from 'lucide-react';
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
  const eventRef = useRef<any>(null);

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
    const currentEvent = eventRef.current;
    const config = themeConfigs[currentEvent?.theme || 'modern'];
    
    notificationQueue.current.push({ 
      ...notif, 
      id: Math.random().toString(36).substring(7), 
      config,
      timestamp: Date.now()
    } as VibeEvent);
    
    processQueue();
  }, [processQueue]);

  useEffect(() => {
    const fetchInitial = async () => {
      if (!slug) return;
      const { data: eventData } = await supabase.from('events').select('*').ilike('slug', slug.trim()).maybeSingle();
      
      if (eventData) {
        setEvent(eventData);
        eventRef.current = eventData;
        
        const started = new Date() >= new Date(eventData.event_date);
        setIsLive(started && !eventData.is_finished);

        // Initial Stats
        const { data: rsvps } = await supabase.from('rsvps').select('checked_in').eq('event_id', eventData.id);
        const { data: budget } = await supabase.from('budget_items').select('amount').eq('event_id', eventData.id).eq('status', 'approved').eq('type', 'income');
        
        setStats({
          checkedIn: rsvps?.filter(r => r.checked_in).length || 0,
          totalSprayed: budget?.reduce((acc, curr) => acc + curr.amount, 0) || 0
        });

        // Real-time Subscription
        const channel = supabase
          .channel(`vibe-live-${eventData.id}`)
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'budget_items', 
            filter: `event_id=eq.${eventData.id}` 
          }, (payload) => {
            const isNewlyApproved = (payload.eventType === 'INSERT' && payload.new.status === 'approved') || 
                                   (payload.eventType === 'UPDATE' && payload.new.status === 'approved' && payload.old?.status !== 'approved');

            if (isNewlyApproved && payload.new.type === 'income') {
              const guestName = payload.new.description.replace('Digital Spray from ', '');
              addToQueue({ type: 'spray', title: 'Digital Spray Received', detail: guestName, amount: payload.new.amount });
              setStats(prev => ({ ...prev, totalSprayed: prev.totalSprayed + payload.new.amount }));
            }
          })
          .on('postgres_changes', { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'rsvps', 
            filter: `event_id=eq.${eventData.id}` 
          }, (payload) => {
            if (payload.new.checked_in && !payload.old?.checked_in) {
              addToQueue({ type: 'checkin', title: 'Guest Arrival', detail: payload.new.guest_name });
              setStats(prev => ({ ...prev, checkedIn: prev.checkedIn + 1 }));
            }
          })
          .on('postgres_changes', { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'events', 
            filter: `id=eq.${eventData.id}` 
          }, (payload) => {
            setEvent(payload.new);
            eventRef.current = payload.new;
            
            if (payload.new.message !== payload.old?.message && payload.new.message) {
              addToQueue({ type: 'message', title: "Host's Live Update", detail: payload.new.message });
            }
            if (payload.new.is_finished) setIsLive(false);
          })
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }
    };
    
    fetchInitial();
  }, [slug, addToQueue]);

  if (!event || isLive === null) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-16 h-16 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!isLive) return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-12 text-center">
      <Lock className="text-[#D4AF37] w-10 h-10 mb-12" />
      <h1 className="text-5xl font-serif italic mb-6">Vibe Screen Inactive</h1>
      <Button onClick={() => navigate('/')} variant="outline">Return to Portal</Button>
    </div>
  );

  const config = themeConfigs[event.theme || 'modern'];
  const isDark = config.dark !== false;

  return (
    <div className={`min-h-screen ${config.bg} ${isDark ? 'text-white' : 'text-black'} overflow-hidden relative`}>
      <VibeHeroNotification event={activeNotification} />

      <div className="relative z-10 flex h-screen">
        {/* Left Section: Memory Wall (75%) */}
        <div className="w-3/4 relative overflow-hidden">
          <VibeBackground mediaUrls={event.gallery_urls || []} fallbackUrl={event.photo_url} />
        </div>

        {/* Right Section: Sidebar (25%) */}
        <div className={`w-1/4 ${config.glass} backdrop-blur-3xl border-l ${config.border} flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.3)]`}>
          
          {/* Top 25%: Details & Branding */}
          <div className="h-1/4 p-8 flex flex-col justify-between border-b border-white/5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className={config.accent} size={14} />
                  <span className={`${config.accent} text-[8px] font-black tracking-[0.4em] uppercase`}>Live Feed</span>
                </div>
                <div className={`w-8 h-8 border-2 ${isDark ? 'border-[#D4AF37]' : 'border-black'} flex items-center justify-center rotate-45 shrink-0`}>
                  <span className={`${isDark ? 'text-[#D4AF37]' : 'text-black'} font-serif text-sm -rotate-45`}>E</span>
                </div>
              </div>
              <h1 className="text-2xl lg:text-3xl font-serif italic leading-tight line-clamp-2">{event.event_name}</h1>
            </div>

            <VibeStats stats={stats} config={config} />
          </div>

          {/* Bottom 75%: Live Activity & Footer */}
          <div className="h-3/4 flex flex-col">
            <div className="flex-1 p-8 min-h-0">
              <VibeSidebar activities={activities} config={config} />
            </div>

            {/* Footer Info */}
            <div className="p-8 pt-0 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 opacity-40">
                  <Heart size={12} />
                  <span className="text-[7px] font-black uppercase tracking-widest">Host's Message</span>
                </div>
                <p className="text-sm font-light italic opacity-80 line-clamp-3">"{event.message || 'Thank you for being part of our special day.'}"</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5">
                <div className="space-y-0.5">
                  <span className="text-[6px] font-black uppercase tracking-[0.3em] opacity-30 block">Powered by EventHub Nigeria</span>
                  <p className="text-[8px] font-bold tracking-[0.1em] uppercase opacity-50">Orchestration Suite</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VibeScreen;