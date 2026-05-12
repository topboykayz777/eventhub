"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, UserCheck, Sparkles, Users, Clock, Loader2, Megaphone, Camera, Timer } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import confetti from 'canvas-confetti';

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
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState({ rsvps: 0, sprays: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hostMessage, setHostMessage] = useState<string | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [tickerGuests, setTickerGuests] = useState<string[]>([]);

  const addActivity = useCallback((activity: Omit<Activity, 'timestamp'>) => {
    const newActivity = {
      ...activity,
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

    setActivities(prev => {
      if (prev.some(a => a.id === activity.id)) return prev;
      return [newActivity, ...prev].slice(0, 8);
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (event?.gallery_urls?.length > 0) {
      const interval = setInterval(() => {
        setCurrentPhotoIndex(prev => (prev + 1) % event.gallery_urls.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [event]);

  const fetchInitialData = async (eventId: string) => {
    const { data: rsvps } = await supabase
      .from('rsvps')
      .select('id, guest_name, created_at')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false })
      .limit(15);

    const { data: sprays } = await supabase
      .from('budget_items')
      .select('id, description, amount, created_at')
      .eq('event_id', eventId)
      .eq('type', 'income')
      .ilike('description', '%Digital Spray%')
      .order('created_at', { ascending: false })
      .limit(15);

    const initialActivities: Activity[] = [
      ...(rsvps || []).map(r => ({
        id: r.id,
        type: 'rsvp' as const,
        title: 'Guest Confirmed',
        subtitle: r.guest_name,
        timestamp: new Date(r.created_at).getTime()
      })),
      ...(sprays || []).map(s => ({
        id: s.id,
        type: 'spray' as const,
        title: 'Digital Spray',
        subtitle: s.description,
        amount: s.amount,
        timestamp: new Date(s.created_at).getTime()
      }))
    ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 8);

    setActivities(initialActivities);

    const { data: allGuests } = await supabase
      .from('rsvps')
      .select('guest_name')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });
    
    setTickerGuests((allGuests || []).map(g => g.guest_name));
  };

  const fetchEvent = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .ilike('slug', slug?.trim() || '')
      .maybeSingle();

    if (data) {
      setEvent(data);
      setHostMessage(data.message);
      await fetchInitialData(data.id);
      
      const { count: rsvpCount } = await supabase.from('rsvps').select('*', { count: 'exact', head: true }).eq('event_id', data.id);
      const { data: sprays } = await supabase.from('budget_items').select('amount').eq('event_id', data.id).eq('type', 'income').ilike('description', '%Digital Spray%');
      
      setStats({
        rsvps: rsvpCount || 0,
        sprays: sprays?.reduce((acc, s) => acc + s.amount, 0) || 0
      });

      const channel = supabase
        .channel(`vibe-realtime-${data.id}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'events' },
          (payload: any) => {
            if (payload.new.id === data.id) {
              setHostMessage(payload.new.message);
              setEvent((prev: any) => ({ ...prev, ...payload.new }));
            }
          }
        )
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'rsvps' },
          (payload: any) => {
            if (payload.new.event_id === data.id) {
              addActivity({
                id: payload.new.id,
                type: 'rsvp',
                title: 'New Guest Confirmed',
                subtitle: payload.new.guest_name
              });
              setStats(prev => ({ ...prev, rsvps: prev.rsvps + 1 }));
              setTickerGuests(prev => [payload.new.guest_name, ...prev]);
            }
          }
        )
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'budget_items' },
          (payload: any) => {
            if (payload.new.event_id === data.id && payload.new.type === 'income' && payload.new.description.includes('Digital Spray')) {
              addActivity({
                id: payload.new.id,
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

  useEffect(() => {
    if (slug) fetchEvent();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" />
    </div>
  );

  const eventDate = new Date(event.event_date);
  const isLive = currentTime >= eventDate;

  const getTimeRemaining = () => {
    const diff = eventDate.getTime() - currentTime.getTime();
    if (diff <= 0) return null;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}h ${mins}m ${secs}s`;
  };

  const theme = event.theme || 'modern';
  const themeConfigs: Record<string, any> = {
    modern: { bg: "bg-black", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/30", glow: "bg-[#D4AF37]/5" },
    traditional: { bg: "bg-[#064e3b]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/40", glow: "bg-[#D4AF37]/10" },
    elegant: { bg: "bg-white", accent: "text-black", border: "border-black/10", glow: "bg-black/5", dark: true },
    sahara: { bg: "bg-[#78350f]", accent: "text-[#fbbf24]", border: "border-[#fbbf24]/30", glow: "bg-[#fbbf24]/10" },
    velvet: { bg: "bg-[#2e1065]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/30", glow: "bg-[#D4AF37]/10" },
    garden: { bg: "bg-[#064e3b]", accent: "text-[#10b981]", border: "border-[#10b981]/30", glow: "bg-[#10b981]/10" },
    oceanic: { bg: "bg-[#1e3a8a]", accent: "text-[#93c5fd]", border: "border-[#93c5fd]/30", glow: "bg-[#93c5fd]/10" },
    rose: { bg: "bg-[#831843]", accent: "text-[#fbcfe8]", border: "border-[#fbcfe8]/30", glow: "bg-[#fbcfe8]/10" },
    earth: { bg: "bg-[#431407]", accent: "text-[#fb923c]", border: "border-[#fb923c]/30", glow: "bg-[#fb923c]/10" },
    silver: { bg: "bg-[#1f2937]", accent: "text-[#9ca3af]", border: "border-[#9ca3af]/30", glow: "bg-[#9ca3af]/10" },
    dynasty: { bg: "bg-[#7f1d1d]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/30", glow: "bg-[#D4AF37]/10" },
    vintage: { bg: "bg-[#fef3c7]", accent: "text-[#92400e]", border: "border-[#92400e]/30", glow: "bg-[#92400e]/10", dark: true }
  };

  const config = themeConfigs[theme] || themeConfigs.modern;
  const textColor = config.dark ? 'text-black' : 'text-white';
  const mutedColor = config.dark ? 'text-black/60' : 'text-gray-500';

  return (
    <div className={`min-h-screen ${config.bg} ${textColor} overflow-hidden relative font-serif transition-colors duration-1000`}>
      <div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full ${config.glow} blur-[150px] animate-pulse`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full ${config.glow} blur-[150px] animate-pulse`} />

      <div className="relative z-10 h-screen flex flex-col p-6 md:p-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <span className={`${config.accent} text-[8px] md:text-[10px] font-bold tracking-[0.6em] uppercase mb-2 block`}>Live Event Feed</span>
            <h1 className="text-3xl md:text-5xl italic leading-tight">{event.event_name}</h1>
          </motion.div>
          <div className="text-right">
            <div className={`flex items-center gap-3 text-xl md:text-3xl font-light tracking-widest mb-1`}>
              <Clock className={`${config.accent} w-5 h-5 md:w-7 md:h-7`} />
              {currentTime.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <p className={`${mutedColor} text-[8px] md:text-[10px] uppercase tracking-[0.4em]`}>{currentTime.toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {/* Hype Timer */}
        <div className="mb-6 flex justify-center">
          <div className={`px-6 py-2 rounded-full border ${config.border} bg-white/5 backdrop-blur-md flex items-center gap-3`}>
            <Timer className={`${config.accent} w-4 h-4`} />
            {isLive ? (
              <span className="text-[8px] md:text-xs font-black uppercase tracking-[0.4em] animate-pulse">Celebration in Progress</span>
            ) : (
              <span className="text-[8px] md:text-xs font-black uppercase tracking-[0.4em]">Starts in: <span className={config.accent}>{getTimeRemaining()}</span></span>
            )}
          </div>
        </div>

        {/* Host Message */}
        <AnimatePresence mode="wait">
          {hostMessage && (
            <motion.div 
              key={hostMessage}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`mb-6 bg-white/5 border ${config.border} p-4 rounded-[1.5rem] flex items-center gap-4 backdrop-blur-xl`}
            >
              <div className={`w-10 h-10 rounded-full ${config.accent.replace('text-', 'bg-')} text-black flex items-center justify-center shrink-0`}>
                <Megaphone size={20} />
              </div>
              <div className="flex-1">
                <p className={`${config.accent} text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em] mb-1`}>Host Announcement</p>
                <p className="text-lg md:text-2xl font-light italic">{hostMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Grid */}
        <div className="flex-1 grid grid-cols-12 gap-6 md:gap-10 min-h-0">
          {/* Left: Live Feed */}
          <div className="col-span-12 lg:col-span-7 flex flex-col min-h-0">
            <h2 className={`text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em] ${mutedColor} mb-4 flex items-center gap-3`}>
              <Sparkles className={`${config.accent} w-3 h-3`} /> Recent Activity
            </h2>
            
            <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
              <AnimatePresence mode="popLayout">
                {activities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    layout
                    initial={{ opacity: 0, x: -50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    className="bg-white/[0.02] border border-white/5 p-4 rounded-[1.5rem] flex items-center justify-between group hover:bg-white/[0.04] transition-all backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${activity.type === 'spray' ? config.accent.replace('text-', 'bg-') + ' text-black' : 'bg-white/10 ' + config.accent}`}>
                        {activity.type === 'spray' ? <Coins size={20} /> : <UserCheck size={20} />}
                      </div>
                      <div>
                        <p className={`${config.accent} text-[7px] md:text-[8px] font-bold uppercase tracking-[0.4em] mb-1`}>{activity.title}</p>
                        <p className="text-lg md:text-2xl font-light italic">{activity.subtitle}</p>
                      </div>
                    </div>
                    {activity.amount && (
                      <div className="text-2xl md:text-4xl font-serif italic">
                        ₦{activity.amount.toLocaleString()}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {activities.length === 0 && (
                <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-[2rem]">
                  <p className={`${mutedColor} text-[10px] font-bold uppercase tracking-[0.4em]`}>Waiting for the first moment...</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Media & Stats */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-6 min-h-0">
            {/* Photo Slideshow - Expanded to fill space */}
            <div className={`flex-1 rounded-[2rem] overflow-hidden border ${config.border} shadow-2xl bg-black/40 relative`}>
              {event.gallery_urls?.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentPhotoIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 1.5 }}
                    src={event.gallery_urls[currentPhotoIndex]}
                    className="w-full h-full object-contain"
                    alt="Event Moment"
                  />
                </AnimatePresence>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 opacity-20">
                  <Camera size={40} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Gallery Empty</p>
                </div>
              )}
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2">
                <Camera size={10} className={config.accent} />
                <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-white">Live Gallery</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 shrink-0">
              <div className="bg-white/[0.02] border border-white/5 p-4 rounded-[1.5rem] text-center backdrop-blur-sm">
                <Users className={`${config.accent} w-5 h-5 mx-auto mb-2`} />
                <p className="text-2xl md:text-4xl font-light mb-1">{stats.rsvps}</p>
                <p className={`text-[7px] md:text-[8px] font-bold uppercase tracking-[0.3em] ${mutedColor}`}>Guests</p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-4 rounded-[1.5rem] text-center backdrop-blur-sm">
                <Coins className={`${config.accent} w-5 h-5 mx-auto mb-2`} />
                <p className="text-lg md:text-2xl font-light mb-1">₦{stats.sprays.toLocaleString()}</p>
                <p className={`text-[7px] md:text-[8px] font-bold uppercase tracking-[0.3em] ${mutedColor}`}>Sprayed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Ticker */}
        <div className="mt-6 pt-4 border-t border-white/5 overflow-hidden relative shrink-0">
          <div className="flex items-center gap-6 animate-marquee whitespace-nowrap">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em] ${mutedColor}`}>Checked-in Guests:</span>
            </div>
            {tickerGuests.length > 0 ? (
              tickerGuests.map((name, i) => (
                <span key={i} className="text-base md:text-xl font-light italic flex items-center gap-4">
                  {name} <span className={config.accent}>•</span>
                </span>
              ))
            ) : (
              <span className="text-base italic opacity-30">Waiting for the first guest to arrive...</span>
            )}
            {/* Duplicate for seamless loop */}
            {tickerGuests.map((name, i) => (
              <span key={`dup-${i}`} className="text-base md:text-xl font-light italic flex items-center gap-4">
                {name} <span className={config.accent}>•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />
    </div>
  );
};

export default VibeScreen;