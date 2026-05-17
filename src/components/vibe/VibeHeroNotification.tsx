"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, UserCheck, MessageSquare, Sparkles, Gift, Star } from 'lucide-react';

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
        // High-tension build up: 4 seconds of shaking
        const timer = setTimeout(() => setStage('reveal'), 4000);
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
        className="fixed inset-0 z-[150] flex items-center justify-center p-6 pointer-events-none"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        />

        <div className="relative z-10 w-full max-w-4xl">
          <AnimatePresence mode="wait">
            {stage === 'box' && event.type === 'spray' ? (
              <motion.div
                key="gift-box-sequence"
                initial={{ scale: 0, y: 200, rotate: -15 }}
                animate={{ 
                  scale: [0, 1.2, 1], 
                  y: 0, 
                  rotate: 0,
                  // The Shake: Violent jitter that intensifies
                  x: [0, -5, 5, -5, 5, -10, 10, -10, 10, 0],
                }}
                transition={{ 
                  x: { repeat: Infinity, duration: 0.15, ease: "linear" },
                  scale: { duration: 0.8, type: "spring" },
                  y: { duration: 0.8, type: "spring" }
                }}
                className="flex flex-col items-center justify-center"
              >
                <div className="relative">
                  {/* Glowing Aura */}
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute inset-0 bg-[#D4AF37] rounded-full blur-[100px]"
                  />
                  
                  <div className="w-64 h-64 md:w-80 md:h-80 bg-[#D4AF37] rounded-[3rem] flex items-center justify-center shadow-[0_0_100px_rgba(212,175,55,0.6)] relative border-4 border-white/20">
                    <Gift className="w-32 h-32 md:w-40 md:h-40 text-black" />
                    
                    {/* Ribbons */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-full bg-black/10" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-full bg-black/10" />
                  </div>
                </div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="mt-16 flex items-center gap-4"
                >
                  <Sparkles className="text-[#D4AF37] animate-spin" />
                  <span className="text-[#D4AF37] text-xl font-black uppercase tracking-[0.8em]">Incoming Gift</span>
                  <Sparkles className="text-[#D4AF37] animate-spin" />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="content-reveal"
                initial={{ scale: 0.5, opacity: 0, filter: "blur(20px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                exit={{ scale: 1.2, opacity: 0, filter: "blur(40px)" }}
                transition={{ type: "spring", damping: 15, stiffness: 100 }}
                className={`${event.config.glass} backdrop-blur-3xl rounded-[4rem] border-2 ${event.config.border} p-12 md:p-24 text-center shadow-[0_0_150px_rgba(0,0,0,1)] relative overflow-hidden`}
              >
                <div className="relative z-10">
                  <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center"
                  >
                    <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full mb-10 flex items-center justify-center shadow-2xl ${
                      event.type === 'spray' ? 'bg-[#D4AF37] text-black shadow-[#D4AF37]/40' : 
                      event.type === 'checkin' ? 'bg-green-500 text-white shadow-green-500/40' : 'bg-white/10 text-[#D4AF37]'
                    }`}>
                      {event.type === 'spray' ? <Coins size={48} /> : 
                       event.type === 'checkin' ? <UserCheck size={48} /> : <MessageSquare size={48} />}
                    </div>

                    <div className="flex items-center justify-center gap-6 mb-8">
                      <Star className={`${event.config.accent} fill-current`} size={20} />
                      <p className={`${event.config.accent} text-sm md:text-xl font-black uppercase tracking-[0.6em]`}>
                        {event.title}
                      </p>
                      <Star className={`${event.config.accent} fill-current`} size={20} />
                    </div>

                    <h2 className={`text-4xl md:text-8xl font-serif italic leading-tight mb-8 drop-shadow-2xl ${isDark ? 'text-white' : 'text-black'}`}>
                      {event.detail}
                    </h2>

                    {event.amount && (
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="text-7xl md:text-[10rem] font-serif italic text-[#D4AF37] drop-shadow-[0_0_50px_rgba(212,175,55,0.6)]"
                      >
                        ₦{event.amount.toLocaleString()}
                      </motion.div>
                    )}
                  </motion.div>
                </div>
                
                {/* Animated Light Beams in background */}
                <div className="absolute inset-0 z-0 opacity-20">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent,white,transparent)]"
                  />
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