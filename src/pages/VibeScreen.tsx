"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, UserCheck, Sparkles } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';

interface VibeNotification {
  id: string;
  type: 'spray' | 'checkin' | 'rsvp';
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

        const channel = supabase
          .channel(`vibe-live-${eventData.id}`)
          .on('postgres_changes', 
            { event: 'INSERT', schema: 'public', table: 'budget_items', filter: `event_id=eq.${eventData.id}` }, 
            (payload) => {
              if (payload.new.type === 'income' && payload.new.description.includes('Digital Spray')) {
                const guestName = payload.new.description.replace('Digital Spray from ', '');
                addNotification({ 
                  type: 'spray', 
                  title: 'Digital Spray Received!', 
                  detail: `${guestName} just sprayed the host`, 
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
                  detail: `${payload.new.guest_name} just checked in!` 
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
                title: 'New RSVP',
                detail: `${payload.new.guest_name} is joining the guest list`
              });
              setStats(prev => ({ ...prev, rsvps: prev.rsvps + 1 }));
            }
          )
          .subscribe();

        return () => { supabase.removeChannel(channel); };
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, [slug]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

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

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 15000);
  };

  if (!event) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 md:w-16 md:h-16 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#D4AF37] font-serif italic text-lg md:text-2xl">Initializing Vibe...</p>
      </div>
    </div>
  );

  const sprayUrl = `${window.location.origin}/spray/${event.slug}`;

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden flex flex-col">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <motion.img 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 30, repeat: Infinity }}
          src={event.photo_url} 
          className="w-full h-full object-cover opacity-20 blur-3xl" 
          alt="" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/80 to-[#050505]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen p-4 md:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 lg:mb-12 gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }}
            className="max-w-full"
          >
            <span className="text-[#D4AF37] text-[10px] md:text-[12px] font-bold tracking-[0.5em] md:tracking-[0.8em] uppercase mb-2 md:mb-4 block">
              Live Celebration Feed
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif italic leading-tight mb-2 md:mb-4">
              {event.event_name}
            </h1>
            <div className="h-1 w-24 md:w-32 lg:w-48 bg-gradient-to-r from-[#D4AF37] to-transparent" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="self-center md:self-end"
          >
            <div className="bg-white p-2 md:p-3 lg:p-4 rounded-xl md:rounded-2xl shadow-2xl border-2 md:border-4 border-[#D4AF37]/20">
              <QRCodeSVG value={sprayUrl} size={isMobile ? 120 : 150} level="H" />
            </div>
            <div className="text-center mt-2 md:mt-4">
              <p className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[#D4AF37] mb-1">
                Scan to Spray
              </p>
              <p className="text-gray-500 font-mono text-[10px] md:text-xs truncate max-w-[200px] mx-auto">
                {sprayUrl.replace('https://', '')}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
          {/* Notifications Feed */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <AnimatePresence mode="popLayout">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <motion.div
                    key={n.id}
                    layout
                    initial={{ opacity: 0, x: -100, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5, x: 50 }}
                    className="glass-premium p-4 md:p-6 lg:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-2xl md:rounded-[3.5rem] border border-[#D4AF37]/30 shadow-[0_0_50px_-12px_rgba(212,175,55,0.2)] mb-4"
                  >
                    <div className="flex items-center gap-3 md:gap-6 lg:gap-10 w-full sm:w-auto mb-3 sm:mb-0">
                      <div className={`w-12 h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 rounded-full flex items-center justify-center shrink-0 ${
                        n.type === 'spray' ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-[#D4AF37]'
                      }`}>
                        {n.type === 'spray' ? <Coins size={isMobile ? 20 : 30} /> : <UserCheck size={isMobile ? 20 : 30} />}
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p className="text-[#D4AF37] text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] mb-1">
                          {n.title}
                        </p>
                        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl font-serif italic text-white break-words">
                          {n.detail}
                        </h3>
                      </div>
                    </div>
                    {n.amount && (
                      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-serif italic text-[#D4AF37] sm:ml-4 lg:ml-6 shrink-0">
                        ₦{n.amount.toLocaleString()}
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="h-48 sm:h-64 md:h-96 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-2xl md:rounded-[3.5rem] p-4">
                  <Sparkles className="text-gray-800 w-8 h-8 md:w-12 md:h-12 mb-4" />
                  <p className="text-gray-600 text-sm md:text-base lg:text-xl font-light tracking-[0.3em] md:tracking-[0.4em] uppercase">
                    Waiting for the next big moment...
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Stats Sidebar */}
          <div className="lg:col-span-4 order-1 lg:order-2 space-y-4 md:space-y-6 lg:space-y-8">
            <div className="glass-premium p-4 md:p-6 lg:p-10 rounded-2xl md:rounded-[3rem] border border-white/5">
              <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-gray-500 mb-2 md:mb-4 lg:mb-6">
                Total Digital Sprays
              </p>
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif italic text-[#D4AF37]">
                ₦{stats.totalSprayed.toLocaleString()}
              </div>
            </div>
            
            <div className="glass-premium p-4 md:p-6 lg:p-10 rounded-2xl md:rounded-[3rem] border border-white/5">
              <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-gray-500 mb-2 md:mb-4 lg:mb-6">
                Guest Attendance
              </p>
              <div className="flex items-baseline gap-2 md:gap-4">
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif italic text-white">
                  {stats.checkedIn}
                </span>
                <span className="text-gray-600 text-sm md:text-base lg:text-xl font-light">
                  / {stats.rsvps} Verified
                </span>
              </div>
              {/* Progress bar */}
              <div className="mt-3 md:mt-4 h-1 md:h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#D4AF37] transition-all duration-1000"
                  style={{ width: `${stats.rsvps > 0 ? (stats.checkedIn / stats.rsvps) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-6 md:pt-8 lg:pt-12 flex flex-col sm:flex-row justify-between items-start sm:items-end border-t border-white/5 gap-4 sm:gap-0">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="w-6 h-6 md:w-8 md:h-8 border border-[#D4AF37] flex items-center justify-center rotate-45">
              <span className="text-[#D4AF37] font-serif text-xs md:text-sm -rotate-45">E</span>
            </div>
            <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-gray-600">
              Powered by EventHub Nigeria
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 w-full sm:w-auto">
            <div className="text-left sm:text-right">
              <p className="text-[7px] md:text-[8px] font-bold uppercase tracking-widest text-gray-600 mb-0.5">Venue</p>
              <p className="text-xs md:text-sm font-light truncate max-w-[200px] sm:max-w-none">{event.venue}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-[7px] md:text-[8px] font-bold uppercase tracking-widest text-gray-600 mb-0.5">Date</p>
              <p className="text-xs md:text-sm font-light">
                {new Date(event.event_date).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VibeScreen;