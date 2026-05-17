"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, UserCheck, MessageSquare, Sparkles, Gift } from 'lucide-react';

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
  const [stage, setStage] = useState<'box' | 'reveal'>('box');

  useEffect(() => {
    if (event) {
      setStage('box');
      if (event.type === 'spray') {
        const timer = setTimeout(() => setStage('reveal'), 800);
        return () => clearTimeout(timer);
      } else {
        setStage('reveal');
      }
    }
  }, [event]);

  if (!event) return null;

  const isDark = event.config.dark !== false;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={event.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-6 pointer-events-none"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        <div className="relative z-10 w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {stage === 'box' && event.type === 'spray' ? (
              <motion.div
                key="gift-box"
                initial={{ scale: 0, rotate: -20, y: 100 }}
                animate={{ scale: 1.2, rotate: 0, y: 0 }}
                exit={{ scale: 2, opacity: 0, filter: "blur(10px)" }}
                transition={{ type: "spring", damping: 12, stiffness: 200 }}
                className="flex flex-col items-center justify-center"
              >
                <div className="w-48 h-48 bg-[#D4AF37] rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.5)] relative">
                  <Gift className="w-24 h-24 text-black animate-bounce" />
                  <div className="absolute -top-4 w-full h-8 bg-[#B8860B] rounded-full blur-xl opacity-50" />
                </div>
                <motion.p 
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="text-[#D4AF37] text-xs font-black uppercase tracking-[0.5em] mt-8"
                >
                  Unlocking Gift...
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                key="content-reveal"
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 1.1, opacity: 0, filter: "blur(20px)" }}
                className={`${event.config.glass} backdrop-blur-3xl rounded-[3rem] border-2 ${event.config.border} p-10 md:p-16 text-center shadow-2xl relative overflow-hidden`}
              >
                <div className="relative z-10">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className={`w-20 h-20 md:w-28 md:h-28 rounded-full mx-auto mb-8 flex items-center justify-center shadow-xl ${
                      event.type === 'spray' ? 'bg-[#D4AF37] text-black' : 
                      event.type === 'checkin' ? 'bg-green-500 text-white' : 'bg-white/10 text-[#D4AF37]'
                    }`}
                  >
                    {event.type === 'spray' ? <Coins size={40} /> : 
                     event.type === 'checkin' ? <UserCheck size={40} /> : <MessageSquare size={40} />}
                  </motion.div>

                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Sparkles className={event.config.accent} size={14} />
                    <p className={`${event.config.accent} text-[10px] md:text-sm font-black uppercase tracking-[0.4em]`}>
                      {event.title}
                    </p>
                    <Sparkles className={event.config.accent} size={14} />
                  </div>

                  <h2 className={`text-2xl md:text-5xl font-serif italic leading-tight mb-4 ${isDark ? 'text-white' : 'text-black'}`}>
                    {event.detail}
                  </h2>

                  {event.amount && (
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-5xl md:text-8xl font-serif italic text-[#D4AF37] drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                    >
                      ₦{event.amount.toLocaleString()}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VibeHeroNotification;