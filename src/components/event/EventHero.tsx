"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Countdown from '@/components/Countdown';

interface EventHeroProps {
  event: any;
  isFinished: boolean;
  config: any;
}

const EventHero = ({ event, isFinished, config }: EventHeroProps) => {
  const isVideo = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.quicktime'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  const isStarted = new Date() >= new Date(event.event_date);
  const isOngoing = isStarted && !isFinished;

  return (
    <div className="relative h-[50vh] min-h-[400px] md:h-[60vh] md:min-h-[500px] lg:h-[85vh] w-full overflow-hidden">
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ duration: 1.5 }} 
        className="w-full h-full gpu-accelerated"
      >
        {isVideo(event.photo_url) ? (
          <video 
            src={event.photo_url} 
            className={`w-full h-full object-cover gpu-accelerated ${isFinished ? 'grayscale' : 'brightness-75'}`} 
            autoPlay 
            muted 
            loop 
            playsInline 
            preload="auto"
            style={{ transform: 'translate3d(0,0,0)' }}
          />
        ) : (
          <img 
            src={event.photo_url} 
            className={`w-full h-full object-cover gpu-accelerated ${isFinished ? 'grayscale' : 'brightness-75'}`} 
            alt="" 
            style={{ transform: 'translate3d(0,0,0)' }}
          />
        )}
      </motion.div>
      <div className={`absolute inset-0 bg-gradient-to-t from-${config.bg.replace('bg-', '')} via-transparent to-transparent pointer-events-none`} />
      
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-16 max-w-6xl mx-auto">
        {isFinished ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 md:mb-8 lg:mb-12 text-center md:text-left">
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-2 block">The Celebration was Successful</span>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-serif italic mb-4">
              A Legacy of <br /> <span className="text-[#D4AF37]">Excellence</span>
            </h1>
          </motion.div>
        ) : isOngoing ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 md:mb-8 lg:mb-12 text-center md:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full mb-6">
              <div className="w-2 h-2 rounded-full bg-green-50 animate-pulse" />
              <span className="text-green-50 text-[10px] font-black uppercase tracking-widest">Live Celebration</span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-serif italic mb-4">
              The Art of <br /> <span className="text-[#D4AF37]">Celebration</span>
            </h1>
          </motion.div>
        ) : (
          <div className="max-w-2xl mx-auto scale-75 md:scale-100 mb-4 md:mb-8">
            <Countdown targetDate={event.event_date} isFinished={isFinished} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventHero;