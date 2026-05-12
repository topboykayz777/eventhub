"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, UserCheck, Sparkles, Users, QrCode, Clock, Loader2, Megaphone, Camera, Timer } from 'lucide-react';
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
      // Prevent duplicates if the same ID comes through
      if (prev.some(a => a.id === activity.id)) return prev;
      return [newActivity, ...prev].slice(0, 6);
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Photo Slideshow Logic
  useEffect(() => {
    if (event?.gallery_urls?.length > 0) {
      const interval = setInterval(() => {
        setCurrentPhotoIndex(prev => (prev + 1) % event.gallery_urls.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [event]);

  const fetchInitialData = async (eventId: string) => {
    // Fetch last 10 RSVPs to ensure we have a full list
    const { data: rsvps } = await supabase
      .from('rsvps')
      .select('id, guest_name, created_at')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Fetch last 10 Sprays
    const { data: sprays } = await supabase
      .from('budget_items')
      .select('id, description, amount, created_at')
      .eq('event_id', eventId)
      .eq('type', 'income')
      .ilike('description', '%Digital Spray%')
      .order('created_at', { ascending: false })
      .limit(10);

    // Combine and sort by actual creation time
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
    ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 6);

    setActivities(initialActivities);

    // Fetch all guest names for ticker
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
      
      // Initial Stats
      const { count: rsvpCount } = await supabase.from('rsvps').select('*', { count: 'exact', head: true }).eq('event_id', data.id);
      const { data: sprays } = await supabase.from('budget_items').select('amount').eq('event_id', data.id).eq('type', 'income').ilike('description', '%Digital Spray%');
      
      setStats({
        rsvps: rsvpCount || 0,
        sprays: sprays?.reduce((acc, s) => acc + s.amount, 0) || 0
      });

      // Real-time Listeners - Manual filtering for 100% reliability
      const channel = supabase
        .channel(`vibe-screen-realtime-${data.id}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'events' },
          (payload) => {
            if (payload.new.id === data.id) {
              setHostMessage(payload.new.message);
              setEvent(prev => ({ ...prev, ...payload.new }));
            }
          }
        )
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'rsvps' },
          (payload) => {
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
          (payload) => {
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

  const eventUrl = `${window.location.origin}/event/${event.slug}`;
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
      {/* Background Ambient Glow */}
      <div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full ${config.glow} blur-[150px] animate-pulse`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full ${config.glow} blur-[150px] animate-pulse`} />

      <div className="relative z-10 h-screen flex flex-col p-6 md:p-12">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 md:mb-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <span className={`${config.accent} text-[8px] md:text-[10px] font-bold tracking-[0.6em] uppercase mb-2 md:mb-3 block`}>Live Event Feed</span>
            <h1 className="text-3xl md:text-6xl italic leading-tight">{event.event_name}</h1>
          </motion.div>
          <div className="text-right">
            <div className={`flex items-center gap-3 md:gap-4 text-xl md:text-4xl font-light tracking-widest mb-1`}>
              <Clock className={`${config.accent} w-5 h-5 md:w-8 md:h-8`} />
              {currentTime.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <p className={`${mutedColor} text-[8px] md:text-[10px] uppercase tracking-[0.4em]`}>{currentTime.toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {/* Hype Timer / Status */}
        <div className="mb-6 md:mb-10 flex justify-center">
          <div className={`px-6 md:px-8 py-2 md:py-3 rounded-full border ${config.border} bg-white/5 backdrop-blur-md flex items-center gap-3 md:gap-4`}>
            <Timer className={`${config.accent} w-4 h-4 md:w-5 md:h-5`} />
            {isLive ? (
              <span className="text-[8px] md:text-xs font-black uppercase tracking-[0.4em] animate-pulse">Celebration in Progress</span>
            ) : (
              <span className="text-[8px] md:text-xs font-black uppercase tracking-[0.4em]">Starts in: <span className={config.accent}>{getTimeRemaining()}</span></span>
            )}
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
              className={`mb-6 md:mb-10 bg-white/5 border ${config.border} p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] flex items-center gap-4 md:gap-6 backdrop-blur-xl`}
            >
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${config.accent.replace('text-', 'bg-')} text-black flex items-center justify-center shrink-0`}>
                <Megaphone size={20} />
              </div>
              <div className="flex-1">
                <p className={`${config.accent} text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em] mb-1`}>Host Announcement</p>
                <p className="text-lg md:text-3xl font-light italic">{hostMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-grow grid grid-cols-12 gap-6 md:gap-12 overflow-hidden">
          {/* Left: Live Feed */}
          <div className="col-span-12 lg:col-span-7 flex flex-col">
            <h2 className={`text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em] ${mutedColor} mb-4 md:mb-6 flex items-center gap-3 md:gap-4`}>
              <Sparkles className={`${config.accent} w-3 h-3 md:w-4 md:h-4`} /> Recent Activity
            </h2>
            
            <div className="flex-grow space-y-3 md:space-y-4 overflow-hidden">
              <AnimatePresence mode="popLayout">
                {activities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    layout
                    initial={{ opacity: 0, x: -50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    className="bg-white/[0.02] border border-white/5 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-between group hover:bg-white/[0.04] transition-all backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center ${activity.type === 'spray' ? config.accent.replace('text-', 'bg-') + ' text-black' : 'bg-white/10 ' + config.accent}`}>
                        {activity.type === 'spray' ? <Coins size={20} /> : <UserCheck size={20} />}
                      </div>
                      <div>
                        <p className={`${config.accent} text-[7px] md:text-[8px] font-bold uppercase tracking-[0.4em] mb-1`}>{activity.title}</p>
                        <p className="text-lg md:text-3xl font-light italic">{activity.subtitle}</p>
                      </div>
                    </div>
                    {activity.amount && (
                      <div className="text-2xl md:text-5xl font-serif italic">
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
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-6 md:gap-8">
            {/* Photo Slideshow */}
            {event.gallery_urls?.length > 0 && (
              <div className={`relative flex-grow rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border ${config.border} shadow-2xl bg-black/20`}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentPhotoIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 1.5 }}
                    src={event.gallery_urls[currentPhotoIndex]}
                    className="w-full h-full object-cover object-center"
                    alt="Event Moment"
                  />
                </AnimatePresence>
                <div className="absolute bottom-4 md:bottom-6 right-4 md:right-6 bg-black/50 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 rounded-full flex items-center gap-2">
                  <Camera size={10} className={config.accent} />
                  <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-white">Live Gallery</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <div className="bg-white/[0.02] border border-white/5 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] text-center backdrop-blur-sm">
                <Users className={`${config.accent} w-5 h-5 md:w-6 md:h-6 mx-auto mb-2 md:mb-3`} />
                <p className="text-2xl md:text-5xl font-light mb-1">{stats.rsvps}</p>
                <p className={`text-[7px] md:text-[8px] font-bold uppercase tracking-[0.3em] ${mutedColor}`}>Guests</p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] text-center backdrop-blur-sm">
                <Coins className={`${config.accent} w-5 h-5 md:w-6 md:h-6 mx-auto mb-2 md:mb-3`} />
                <p className="text-lg md:text-3xl font-light mb-1">₦{stats.sprays.toLocaleString()}</p>
                <p className={`text-[7px] md:text-[8px] font-bold uppercase tracking-[0.3em] ${mutedColor}`}>Sprayed</p>
              </div>
            </div>

            <div className={`h-[250px] md:h-[350px] ${config.accent.replace('text-', 'bg-')} p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] text-black text-center relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-white/20 -mr-12 -mt-12 md:-mr-16 md:-mt-16 rotate-45" />
              <div className="relative z-10 flex flex-col h-full justify-center">
                <QrCode className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-3 md:mb-4 opacity-50" />
                <h3 className="text-xl md:text-3xl font-serif italic mb-1 md:mb-2">Join the Vibe</h3>
                <p className="text-[7px] md:text-[8px] font-bold uppercase tracking-[0.2em] mb-4 md:mb-6 opacity-60">Scan to RSVP or Spray</p>
                
                <div className="bg-white p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] inline-block shadow-2xl transform group-hover:scale-105 transition-transform duration-500 mx-auto">
                  <QRCodeSVG value={eventUrl} size={isMobile ? 100 : 160} level="H" />
                </div>
                
                <p className="mt-4 md:mt-6 text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em]">eventhub.ng/event/{event.slug}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Ticker */}
        <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/5 overflow-hidden relative">
          <div className="flex items-center gap-6 md:gap-8 animate-marquee whitespace-nowrap">
            <div className="flex items-center gap-3 md:gap-4 shrink-0">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse" />
              <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em] md:tracking-[0.5em] ${mutedColor}`}>Checked-in Guests:</span>
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