"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, UserCheck, Ticket, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '@/utils/toast';

const VibeScreen = () => {
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [isLive, setIsLive] = useState<boolean | null>(null);
  const [stats, setStats] = useState({ checkedIn: 0, totalSprayed: 0 });
  const [activities, setActivities] = useState<any[]>([]);
  const [activeNotification, setActiveNotification] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'online' | 'offline'>('connecting');
  
  const notificationQueue = useRef<any[]>([]);
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
    silver: { bg: "bg-[#1f2937]", accent: "text-[#9ca3af]", border: "border-[#9ca3af]/20", glass: "bg-white/80", dark: true },
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

  useEffect(() => {
    if (!event?.id) return;
    
    const channel = supabase
      .channel(`vibe-realtime-${event.id}`, {
        config: {
          broadcast: { self: true },
          presence: { key: event.id }
        }
      })
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'budget_items' 
      }, (payload) => {
        if (eventRef.current?.event_id === payload.new.event_id && payload.new.type === 'income' && payload.new.description.includes('Digital Spray')) {
          const guestName = payload.new.alert_name || 'Anonymous Guest';
          const amount = payload.new.amount;
          
          // LOG TO ACTIVITIES (last 3)
          setActivities(prev => [...prev, {
            type: 'spray',
            title: 'Digital Spray Received',
            detail: guestName,
            amount          }].slice(-3));
          
          addNotification({ type: 'spray', title: 'Digital Spray Received', message: guestName, amount });
        }
      })
      .on('postgres_changes', {         event: 'UPDATE', 
        schema: 'public', 
        table: 'rsvps' 
      }, (payload) => {
        if (payload.new.checked_in && !payload.old?.checked_in) {
          addNotification({ type: 'checkin', title: 'Guest Arrival', detail: payload.new.guest_name });
          
          // LOG TO ACTIVITIES (last 3)
          setActivities(prev => [...prev, {
            type: 'checkin',
            title: 'Guest Arrival',
            detail: payload.new.guest_name
          }].slice(-3));
        }
        if (payload.new.plus_one_checked_in && !payload.old?.plus_one_checked_in) {
          const name = payload.new.plus_one_name || `${payload.new.guest_name}'s Guest`;
          addNotification({ type: 'checkin', title: 'Plus One Arrival', detail: name });
          
          // LOG TO ACTIVITIES (last 3)
          setActivities(prev => [...prev, {
            type: 'checkin',
            title: 'Plus One Arrival',
            detail: name
          }].slice(-3));
        }
      })
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'events' 
      }, (payload) => {
        setEvent(payload.new);
        eventRef.current = payload.new;
        
        if (payload.new.message && payload.new.message !== payload.old?.message) {
          addNotification({ type: 'message', title: 'Host Update', detail: payload.new.message });
          
          // LOG TO ACTIVITIES (last 3)
          setActivities(prev => [...prev, {
            type: 'message',
            title: 'Host Update',
            detail: payload.new.message          }].slice(-3));
        }
        
        if (payload.new.is_finished) {
          setIsLive(false);
        }
      })
      .subscribe();
    
    // Initialize Realtime Channel
    const channel = supabase
      .channel('global-event-notifications')
      .on('postgres_changes', { 
        event: 'INSERT',         schema: 'public', 
        table: 'budget_items' 
      }, (payload) => {
        // ... existing logic for global notifications ...
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [event?.id]);

  const addNotification = useCallback((notif: Omit<any, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).substring(7);
    const newNotif = { ...notif, id, timestamp: Date.now() };
    setNotifications(prev => [newNotif, ...prev].slice(0, 3));
    
    // LOG TO ACTIVITIES (last 3)
    setActivities(prev => [...prev, { ...newNotif, type: notif.type }].slice(-3));
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
      setActivities(prev => prev.filter(n => n.id !== id));
    }, 8000);
  }, []);

  // ... rest of component unchanged ...

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Live Activity</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 flex flex-col gap-3">
          <AnimatePresence initial={false} mode="popLayout">
            {activities.map((activity, i) => (
              <motion.div
                key={activity.id ?? i}
                layout                initial={{ opacity: 0, x: 30, filter: "blur(5px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={`p-4 rounded-2xl border ${
                  activity.type === 'spray' 
                    ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30' 
                    : isDark ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    activity.type === 'spray' ? 'bg-[#D4AF37] text-black' : 
                    activity.type === 'checkin' ? 'bg-green-500/20 text-green-500' : 'bg-white/10 text-[#D4AF37]'
                  }`}>
                    {activity.type === 'spray' ? <Coins className="w-6 h-6" /> : 
                    activity.type === 'checkin' ? <UserCheck className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                  </div>
                                    <div className="flex-1 min-w-0">
                    <p className={`text-[7px] font-black uppercase tracking-widest mb-0.5 ${
                      activity.type === 'spray' ? 'text-[#D4AF37]' : 'opacity-40'
                    }`}>
                      {activity.title}
                    </p>
                    <h4 className={`text-sm font-serif italic truncate ${isDark ? 'text-white' : 'text-black'}`}>
                      {activity.detail}
                    </h4>
                    {activity.amount && (
                      <p className="text-lg font-serif italic text-[#D4AF37] mt-0.5">
                        ₦{activity.amount.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div className={`absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t ${
            isDark ? `from-${config.bg.replace('bg-[', '').replace(']', '')} to-transparent` : 'from-white to-transparent'
          } pointer-events-none`} />
        </div>
      </div>
    </div>
  );
};

export default VibeScreen;