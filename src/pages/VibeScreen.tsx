"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, UserCheck, Sparkles, Users, Clock, Loader2, Megaphone, Camera, Timer, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import confetti from 'canvas-confetti';

interface Activity {
  id: string;
  type: 'spray' | 'checkin' | 'rsvp';
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
  const [stats, setStats] = useState({ rsvps: 0, sprays: 0, checkins: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [tickerGuests, setTickerGuests] = useState<string[]>([]);

  const addActivity = useCallback((activity: Omit<Activity, 'timestamp'>) => {
    const newActivity = { ...activity, timestamp: Date.now() };
    
    if (activity.type === 'spray') {
      confetti({ 
        particleCount: 150, 
        spread: 70, 
        origin: { y: 0.6 }, 
        colors: ['#D4AF37', '#ffffff', '#F9E4B7'],
        zIndex: 1000
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
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [event]);

  const fetchInitialData = async (eventId: string) => {
    const { data: rsvps } = await supabase.from('rsvps').select('id, guest_name, checked_in, updated_at, created_at').eq('event_id', eventId).order('updated_at', { ascending: false }).limit(20);
    const { data: sprays } = await supabase.from('budget_items').select('id, description, amount, created_at').eq('event_id', eventId).eq('type', 'income').ilike('description', '%Digital Spray%').order('created_at', { ascending: false }).limit(10);

    const initialActivities: Activity[] = [
      ...(rsvps || []).filter(r => r.checked_in).map(r => ({ id: `checkin-${r.id}`, type: 'checkin' as const, title: 'GUEST ARRIVED', subtitle: r.guest_name, timestamp: new Date(r.updated_at).getTime() })),
      ...(sprays || []).map(s => ({ id: `spray-${s.id}`, type: 'spray' as const, title: 'DIGITAL SPRAY', subtitle: s.description, amount: s.amount, timestamp: new Date(s.created_at).getTime() }))
    ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 8);

    setActivities(initialActivities);
    const { data: checkedInGuests } = await supabase.from('rsvps').select('guest_name').eq('event_id', eventId).eq('checked_in', true).order('updated_at', { ascending: false });
    setTickerGuests((checkedInGuests || []).map(g => g.guest_name));

    const { count: rsvpCount } = await supabase.from('rsvps').select('*', { count: 'exact', head: true }).eq('event_id', eventId);
    const { count: checkinCount } = await supabase.from('rsvps').select('*', { count: 'exact', head: true }).eq('event_id', eventId).eq('checked_in', true);
    const totalSprays = sprays?.reduce((acc, s) => acc + s.amount, 0) || 0;

    setStats({ rsvps: rsvpCount || 0, checkins: checkinCount || 0, sprays: totalSprays });
  };

  const fetchEvent = async () => {
    const { data } = await supabase.from('events').select('*').ilike('slug', slug?.trim() || '').maybeSingle();
    if (data) {
      setEvent(data);
      await fetchInitialData(data.id);
      const channel = supabase.channel(`vibe-realtime-${data.id}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rsvps', filter: `event_id=eq.${data.id}` }, (payload: any) => {
          if (payload.new.checked_in && !payload.old.checked_in) {
            addActivity({ id: `checkin-${payload.new.id}`, type: 'checkin', title: 'GUEST ARRIVED', subtitle: payload.new.guest_name });
            setStats(prev => ({ ...prev, checkins: prev.checkins + 1 }));
            setTickerGuests(prev => [payload.new.guest_name, ...prev]);
          }
        })
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'budget_items', filter: `event_id=eq.${data.id}` }, (payload: any) => {
          if (payload.new.type === 'income' && payload.new.description.includes('Digital Spray')) {
            addActivity({ id: `spray-${payload.new.id}`, type: 'spray', title: 'DIGITAL SPRAY', subtitle: payload.new.description, amount: payload.new.amount });
            setStats(prev => ({ ...prev, sprays: prev.sprays + payload.new.amount }));
          }
        }).subscribe();
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
    vintage: { bg: "bg-[#fef3c7]", accent: "text-[#92400e]", border: "border-[#92400e]/30", glow: "bg-[#92400e]/10", dark: true },
    onyx: { bg: "bg-[#1a1a1a]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/30", glow: "bg-[#D4AF37]/5" },
    champagne: { bg: "bg-[#fdf2f8]", accent: "text-[#be185d]", border: "border-[#be185d]/20", glow: "bg-[#be185d]/5", dark: true },
    pearl: { bg: "bg-[#0f172a]", accent: "text-[#38bdf8]", border: "border-[#38bdf8]/30", glow: "bg-[#38bdf8]/10" },
    tuscan: { bg: "bg-[#fefce8]", accent: "text-[#ca8a04]", border: "border-[#ca8a04]/30", glow: "bg-[#ca8a04]/10", dark: true },
    frost: { bg: "bg-[#f0f9ff]", accent: "text-[#0ea5e9]", border: "border-[#0ea5e9]/30", glow: "bg-[#0ea5e9]/10", dark: true },
    magenta: { bg: "bg-[#fdf2f8]", accent: "text-[#db2777]", border: "border-[#db2777]/30", glow: "bg-[#db2777]/10", dark: true },
    jade: { bg: "bg-[#f0fdf4]", accent: "text-[#166534]", border: "border-[#166534]/30", glow: "bg-[#166534]/10", dark: true },
    saffron: { bg: "bg-[#fff7ed]", accent: "text-[#9a3412]", border: "border-[#9a3412]/30", glow: "bg-[#9a3412]/10", dark: true },
    slate: { bg: "bg-[#f8fafc]", accent: "text-[#475569]", border: "border-[#475569]/30", glow: "bg-[#475569]/10", dark: true },
    lavender: { bg: "bg-[#f5f3ff]", accent: "text-[#5b21b6]", border: "border-[#5b21b6]/30", glow: "bg-[#5b21b6]/10", dark: true },
    ruby: { bg: "bg-[#fff1f2]", accent: "text-[#9f1239]", border: "border-[#9f1239]/30", glow: "bg-[#9f1239]/10", dark: true },
    golden: { bg: "bg-[#fffbeb]", accent: "text-[#854d0e]", border: "border-[#854d0e]/30", glow: "bg-[#854d0e]/10", dark: true },
    birch: { bg: "bg-[#f9fafb]", accent: "text-[#4b5563]", border: "border-[#4b5563]/30", glow: "bg-[#4b5563]/10", dark: true },
    bronze: { bg: "bg-[#fff7ed]", accent: "text-[#9a3412]", border: "border-[#9a3412]/30", glow: "bg-[#9a3412]/10", dark: true },
    plum: { bg: "bg-[#faf5ff]", accent: "text-[#6b21a8]", border: "border-[#6b21a8]/30", glow: "bg-[#6b21a8]/10", dark: true },
    teal: { bg: "bg-[#f0fdfa]", accent: "text-[#115e59]", border: "border-[#115e59]/30", glow: "bg-[#115e59]/10", dark: true },
    charcoal: { bg: "bg-[#111827]", accent: "text-[#f43f5e]", border: "border-[#f43f5e]/30", glow: "bg-[#f43f5e]/10" },
    sand: { bg: "bg-[#fafaf9]", accent: "text-[#78716c]", border: "border-[#78716c]/30", glow: "bg-[#78716c]/10", dark: true },
    forest: { bg: "bg-[#022c22]", accent: "text-[#10b981]", border: "border-[#10b981]/30", glow: "bg-[#10b981]/10" },
    ember: { bg: "bg-[#450a0a]", accent: "text-[#ef4444]", border: "border-[#ef4444]/30", glow: "bg-[#ef4444]/10" },
    blossom: { bg: "bg-[#fff1f2]", accent: "text-[#fb7185]", border: "border-[#fb7185]/30", glow: "bg-[#fb7185]/10", dark: true },
    solstice: { bg: "bg-[#1e1b4b]", accent: "text-[#818cf8]", border: "border-[#818cf8]/30", glow: "bg-[#818cf8]/10" },
    breeze: { bg: "bg-[#f0f9ff]", accent: "text-[#38bdf8]", border: "border-[#38bdf8]/30", glow: "bg-[#38bdf8]/10", dark: true }
  };

  const config = themeConfigs[theme] || themeConfigs.modern;
  const textColor = config.dark ? 'text-black' : 'text-white';
  const mutedColor = config.dark ? 'text-black/60' : 'text-gray-500';

  return (
    <div className={`min-h-screen ${config.bg} ${textColor} overflow-hidden relative font-serif flex flex-col`}>
      <div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full ${config.glow} blur-[150px] animate-pulse`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full ${config.glow} blur-[150px] animate-pulse`} />

      <div className="relative z-10 flex-1 flex flex-col p-4 md:p-10 max-h-screen">
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

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-10 min-h-0 overflow-hidden">
          <div className="lg:col-span-7 flex flex-col min-h-0">
            <h2 className={`text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em] ${mutedColor} mb-3 flex items-center gap-2`}>
              <Sparkles className={`${config.accent} w-3 h-3`} /> Recent Activity
            </h2>
            <div className="flex-1 space-y-3 md:space-y-4 overflow-y-auto custom-scrollbar pr-2">
              <AnimatePresence mode="popLayout">
                {activities.map((activity) => (
                  <motion.div key={activity.id} layout initial={{ opacity: 0, x: -50, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} className={`p-4 md:p-6 rounded-3xl flex items-center justify-between backdrop-blur-2xl border shadow-2xl ${activity.type === 'spray' ? 'bg-amber-500/10 border-amber-500/30 shadow-amber-500/5' : 'bg-emerald-500/10 border-emerald-500/30 shadow-emerald-500/5'}`}>
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center ${activity.type === 'spray' ? 'bg-amber-500 text-black' : 'bg-emerald-500 text-white'}`}>
                        {activity.type === 'spray' ? <Coins size={24} /> : <UserCheck size={24} />}
                      </div>
                      <div><p className={`text-[7px] md:text-[9px] font-black uppercase tracking-[0.4em] mb-1 ${activity.type === 'spray' ? 'text-amber-400' : 'text-emerald-400'}`}>{activity.title}</p><p className="text-lg md:text-3xl font-light italic truncate max-w-[200px] md:max-w-none">{activity.subtitle}</p></div>
                    </div>
                    {activity.amount && <div className="text-2xl md:text-5xl font-serif italic text-amber-400">₦{activity.amount.toLocaleString()}</div>}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4 md:gap-8 min-h-0">
            <div className={`flex-1 rounded-[3rem] overflow-hidden border ${config.border} shadow-2xl bg-black/40 relative min-h-[250px]`}>
              {event.gallery_urls?.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.img key={currentPhotoIndex} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} src={event.gallery_urls[currentPhotoIndex]} className="w-full h-full object-cover" alt="" />
                </AnimatePresence>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 opacity-20"><Camera size={40} /></div>
              )}
              <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 border border-white/10"><Camera size={12} className={config.accent} /><span className="text-[8px] font-black uppercase tracking-widest text-white">Live Gallery</span></div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:gap-6 shrink-0">
              <div className="bg-white/[0.02] border border-white/5 p-6 md:p-10 rounded-[2rem] text-center backdrop-blur-xl"><Users className={`${config.accent} w-6 h-6 mx-auto mb-3`} /><p className="text-3xl md:text-6xl font-light">{stats.checkins}</p><p className={`text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] ${mutedColor}`}>Guests Arrived</p></div>
              <div className="bg-white/[0.02] border border-white/5 p-6 md:p-10 rounded-[2rem] text-center backdrop-blur-xl"><Coins className={`${config.accent} w-6 h-6 mx-auto mb-3`} /><p className="text-2xl md:text-4xl font-light">₦{stats.sprays.toLocaleString()}</p><p className={`text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] ${mutedColor}`}>Total Sprayed</p></div>
            </div>
          </div>
        </div>

        <div className="mt-6 md:mt-10 pt-6 border-t border-white/5 overflow-hidden relative shrink-0">
          <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
            <span className={`text-[9px] md:text-[11px] font-black uppercase tracking-[0.5em] ${mutedColor} flex items-center gap-3`}><CheckCircle2 size={14} className="text-emerald-400" /> Verified Entry:</span>
            {tickerGuests.length > 0 ? (
              <>
                {tickerGuests.map((name, i) => (<span key={i} className="text-base md:text-2xl font-light italic flex items-center gap-6">{name} <span className={config.accent}>•</span></span>))}
                {tickerGuests.map((name, i) => (<span key={`dup-${i}`} className="text-base md:text-2xl font-light italic flex items-center gap-6">{name} <span className={config.accent}>•</span></span>))}
              </>
            ) : (
              <span className="text-base md:text-2xl font-light italic opacity-30">Waiting for first arrival...</span>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-marquee { display: inline-flex; animation: marquee 60s linear infinite; }`}} />
    </div>
  );
};

export default VibeScreen;