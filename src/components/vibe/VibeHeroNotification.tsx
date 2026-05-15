"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, UserCheck, MessageSquare } from 'lucide-react';

export interface VibeEvent {
  id: string;
  type: 'spray' | 'checkin' | 'message';
  title: string;
  detail: string;
  amount?: number;
  config: any;
}

interface VibeHeroNotificationProps {
  event: VibeEvent | null;
}

const VibeHeroNotification = ({ event }: VibeHeroNotificationProps) => {
  if (!event) return null;

  const isDark = event.config.dark !== false;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={event.id}
        initial={{ opacity: 0, y: 100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-12 pointer-events-none"
      >
        <div className={`max-w-5xl w-full ${event.config.glass} backdrop-blur-3xl rounded-[5rem] border-2 ${event.config.border} p-20 text-center shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden`}>
          <motion.div 
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`absolute inset-0 bg-gradient-to-b from-${event.config.accent.replace('text-', '')}/20 to-transparent`}
          />

          <div className="relative z-10">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className={`w-32 h-32 rounded-full mx-auto mb-12 flex items-center justify-center ${
                event.type === 'spray' ? 'bg-[#D4AF37] text-black' : 
                event.type === 'checkin' ? 'bg-green-500 text-white' : 'bg-white/10 text-[#D4AF37]'
              }`}
            >
              {event.type === 'spray' ? <Coins size={64} /> : 
               event.type === 'checkin' ? <UserCheck size={64} /> : <MessageSquare size={64} />}
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`${event.config.accent} text-xl font-black uppercase tracking-[0.8em] mb-6`}
            >
              {event.title}
            </motion.p>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`text-6xl md:text-8xl font-serif italic leading-tight ${isDark ? 'text-white' : 'text-black'}`}
            >
              {event.detail}
            </motion.h2>

            {event.amount && (
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
                className="mt-12 text-8xl md:text-9xl font-serif italic text-[#D4AF37]"
              >
                ₦{event.amount.toLocaleString()}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VibeHeroNotification;