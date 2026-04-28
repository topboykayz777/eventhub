"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, UserCheck, X, Sparkles, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  type: 'spray' | 'rsvp' | 'system';
  title: string;
  message: string;
  amount?: number;
  timestamp: number;
}

const DigitalSpray = ({ eventIds }: { eventIds: string[] }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notif: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).substring(7);
    const newNotif = { ...notif, id, timestamp: Date.now() };
    setNotifications(prev => [newNotif, ...prev].slice(0, 3));
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 8000);
  }, []);

  useEffect(() => {
    if (eventIds.length === 0) return;

    const channel = supabase
      .channel('global-event-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'budget_items' },
        (payload) => {
          if (eventIds.includes(payload.new.event_id) && payload.new.type === 'income' && payload.new.description.includes('Digital Spray')) {
            addNotification({
              type: 'spray',
              title: 'Digital Spray Received',
              message: payload.new.description,
              amount: payload.new.amount
            });
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'rsvps' },
        (payload) => {
          if (eventIds.includes(payload.new.event_id)) {
            addNotification({
              type: 'rsvp',
              title: 'New RSVP Confirmed',
              message: `${payload.new.guest_name} has joined the guest list.`
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventIds, addNotification]);

  return (
    <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-4 w-full max-w-sm pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            layout
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="pointer-events-auto"
          >
            <div className="glass-premium p-6 rounded-[2rem] border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden group">
              {/* Animated Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex items-start gap-4 relative z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                  notif.type === 'spray' ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-[#D4AF37]'
                }`}>
                  {notif.type === 'spray' ? <Coins size={20} /> : <UserCheck size={20} />}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                      {notif.title}
                    </h4>
                    <button 
                      onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
                      className="text-gray-500 hover:text-white transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  
                  <p className="text-sm font-light text-gray-300 leading-tight mb-2">
                    {notif.message}
                  </p>
                  
                  {notif.amount && (
                    <div className="text-2xl font-serif italic text-white">
                      ₦{notif.amount.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Progress Bar */}
              <motion.div 
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 8, ease: "linear" }}
                className="absolute bottom-0 left-0 h-0.5 bg-[#D4AF37]/50"
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default DigitalSpray;