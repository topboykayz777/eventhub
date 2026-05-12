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
    const newActivity = { ...activity, timestamp: Date.now() };
    if (activity.type === 'spray') {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#D4AF37', '#ffffff'] });
    }
    setActivities(prev => {
      if (prev.some(a => a.id === activity.id)) return prev;
      return [newActivity, ...prev].slice(0, 6);
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
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [event]);

  const fetchEvent = async () => {
    const { data } = await supabase.from('events').select('*').ilike('slug', slug?.trim() || '').maybeSingle();
    if (data) {
      setEvent(data);
      setHostMessage(data.message);
      
      // Initial Data Fetch
      const { data: rsvps } = await supabase.from('rsvps').select('id, guest_name, created_at').eq('event_id', data.id).order('created_at', { ascending: false }).limit(10);
      const { data: sprays } = await supabase.from('budget_items').select('id, description, amount, created_at').eq('event_id', data.id).eq('type', 'income').ilike('description', '%Digital Spray%').order('created_at', { ascending: false }).limit(10);
      
      const initial = [...(rsvps || []).map(r => ({ id: r.id, type: 'rsvp' as const, title: 'Guest Confirmed', subtitle: r.guest_name, timestamp: new Date(r.created_at).getTime() })), ...(sprays || []).map(s => ({ id: s.id, type: 'spray' as const, title: 'Digital Spray', subtitle: s.description, amount: s.amount, timestamp: new Date(s.created_at).getTime() }))].sort((a, b) => b.timestamp - a.timestamp).slice(0, 6);
      setActivities(initial);

      const { count: rsvpCount } = await supabase.from('rsvps').select('*', { count: 'exact', head: true }).eq('event_id', data.id);
      const { data: sprayData } = await supabase.from('budget_items').select('amount').eq('event_id', data.id).eq('type', 'income').ilike('description', '%Digital Spray%');
      setStats({ rsvps: rsvpCount || 0, sprays: sprayData?.reduce((acc, s) => acc + s.amount, 0) || 0 });
      setTickerGuests((rsvps || []).map(g => g.guest_name));

      const channel = supabase.channel(`vibe-${data.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, (p: any) => { if (p.new.id === data.id) { setHostMessage(p.new.message); setEvent((prev: any) => ({ ...prev, ...p.new })); } })
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rsvps' }, (p: any) => { if (p.new.event_id === data.id) { addActivity({ id: p.new.id, type: 'rsvp', title: 'New Guest Confirmed', subtitle: p.new.guest_name }); setStats(prev => ({ ...prev, rsvps: prev.rsvps + 1 })); setTickerGuests(prev => [p.new.guest_name, ...prev]); } })
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'budget_items' }, (p: any) => { if (p.new.event_id === data.id && p.new.description.includes('Digital Spray')) { addActivity({ id: p.new.id, type: 'spray', title: 'Digital Spray Received', subtitle: p.new.description, amount: p.new.amount }); setStats(prev => ({ ...prev, sprays: prev.sprays + p.new.amount })); } })
        .subscribe();

      setLoading(false);
      return () => { supabase.removeChannel(channel); };
    }
  };

  useEffect(() => { if (slug) fetchEvent(); }, [slug]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" /></div>;

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
    <div className={`min-h-screen ${config.bg} ${textColor} overflow-hidden relative font-serif flex flex-col`}>
      <div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full ${config.glow} blur-[150px] animate-pulse`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full ${config.glow} blur-[150px] animate-pulse`} />

      <div className="relative z-10 flex-1 flex flex-col p-4 md:p-10 max-h-screen">
        {/* Header */}
        <div className="flex justify-between items-start mb-4 md:mb-8 shrink-0">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <span className={`${config.accent} text-[8px] md:text-[10px] font-bold tracking-[0.6em] uppercase mb-1 block`}>Live Event Feed</span>
            <h1 className="text-2xl md:text-5xl italic leading-tight truncate max-w-[250px] md:max-w-none">{event.event_name}</h1>
          </motion.div>
          <div className="text-right">
            <div className={`flex items-center gap-2 md:gap-3 text-lg md:text-3xl font-light tracking-widest`}>
              <Clock className={`${config.accent} w-4 h-4 md:w-7 md:h-7`} />
              {currentTime.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <p className={`${mutedColor} text-[7px] md:text-[10px] uppercase tracking-[0.4em]`}>{currentTime.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}</p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-10 min-h-0 overflow-hidden">
          {/* Left: Live Feed */}
          <div className="lg:col-span-7 flex flex-col min-h-0">
            <h2 className={`text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em] ${mutedColor} mb-3 flex items-center gap-2`}>
              <Sparkles className={`${config.accent} w-3 h-3`} /> Recent Activity
            </h2>
            
            <div className="flex-1 space-y-2 md:space-y-3 overflow-y-auto custom-scrollbar pr-2">
              <AnimatePresence mode="popLayout">
                {activities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    layout
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/[0.02] border border-white/5 p-3 md:p-5 rounded-2xl flex items-center justify-between backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3 md:gap-5">
                      <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center ${activity.type === 'spray' ? config.accent.replace('text-', 'bg-') + ' text-black' : 'bg-white/10 ' + config.accent}`}>
                        {activity.type === 'spray' ? <Coins size={18} /> : <UserCheck size={18} />}
                      </div>
                      <div>
                        <p className={`${config.accent} text-[6px] md:text-[8px] font-bold uppercase tracking-[0.4em] mb-0.5`}>{activity.title}</p>
                        <p className="text-base md:text-2xl font-light italic truncate max-w-[150px] md:max-w-none">{activity.subtitle}</p>
                      </div>
                    </div>
                    {activity.amount && <div className="text-xl md:text-4xl font-serif italic">₦{activity.amount.toLocaleString()}</div>}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Media & Stats */}
          <div className="lg:col-span-5 flex flex-col gap-4 md:gap-8 min-h-0">
            {/* Photo Slideshow */}
            <div className={`flex-1 rounded-[2rem] overflow-hidden border ${config.border} shadow-2xl bg-black/40 relative min-h-[200px]`}>
              {event.gallery_urls?.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentPhotoIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    src={event.gallery_urls[currentPhotoIndex]}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </AnimatePresence>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 opacity-20"><Camera size={40} /></div>
              )}
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2">
                <Camera size={10} className={config.accent} />
                <span className="text-[7px] font-black uppercase tracking-widest text-white">Live Gallery</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 shrink-0">
              <div className="bg-white/[0.02] border border-white/5 p-4 md:p-8 rounded-[1.5rem] text-center backdrop-blur-sm">
                <Users className={`${config.accent} w-5 h-5 mx-auto mb-2`} />
                <p className="text-2xl md:text-5xl font-light">{stats.rsvps}</p>
                <p className={`text-[7px] md:text-[8px] font-bold uppercase tracking-[0.3em] ${mutedColor}`}>Guests</p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-4 md:p-8 rounded-[1.5rem] text-center backdrop-blur-sm">
                <Coins className={`${config.accent} w-5 h-5 mx-auto mb-2`} />
                <p className="text-lg md:text-3xl font-light">₦{stats.sprays.toLocaleString()}</p>
                <p className={`text-[7px] md:text-[8px] font-bold uppercase tracking-[0.3em] ${mutedColor}`}>Sprayed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Ticker */}
        <div className="mt-4 md:mt-8 pt-4 border-t border-white/5 overflow-hidden relative shrink-0">
          <div className="flex items-center gap-6 animate-marquee whitespace-nowrap">
            <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em] ${mutedColor}`}>Checked-in:</span>
            {tickerGuests.map((name, i) => (
              <span key={i} className="text-sm md:text-xl font-light italic flex items-center gap-4">{name} <span className={config.accent}>•</span></span>
            ))}
            {tickerGuests.map((name, i) => (
              <span key={`dup-${i}`} className="text-sm md:text-xl font-light italic flex items-center gap-4">{name} <span className={config.accent}>•</span></span>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: inline-flex; animation: marquee 40s linear infinite; }
      `}} />
    </div>
  );
};

export default VibeScreen;