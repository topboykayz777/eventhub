"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

const Hero = () => {
  const handleBackgroundClick = (e: React.MouseEvent) => {
    // Only trigger if clicking the background, not buttons
    if ((e.target as HTMLElement).closest('button')) return;

    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    confetti({
      particleCount: 15,
      spread: 50,
      startVelocity: 30,
      origin: { x, y },
      colors: ['#D4AF37', '#F9E4B7', '#B8860B'],
      gravity: 1.2,
      scalar: 0.8,
      ticks: 100,
    });
  };

  return (
    <section 
      onClick={handleBackgroundClick}
      className="relative min-h-[100svh] w-full flex flex-col items-center justify-center overflow-hidden bg-background pt-20 md:pt-24 cursor-crosshair"
    >
      {/* Immersive Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80" 
          className="w-full h-full object-cover opacity-25 md:opacity-45 animate-slow-zoom dark:grayscale gpu-accelerated"
          alt="Luxury Event Background"
          style={{ transform: 'translate3d(0,0,0)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        <div className="absolute inset-0 bg-black/5 dark:bg-black/30" />
      </div>

      {/* The Silk Reveal Mask */}
      <motion.div 
        initial={{ y: "0%" }}
        animate={{ y: "-100%" }}
        transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1], delay: 0.2 }}
        className="absolute inset-0 z-40 bg-gradient-to-b from-black via-zinc-900 to-black pointer-events-none gpu-accelerated"
      />

      <div className="max-w-7xl mx-auto relative z-10 px-6 text-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 100, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1], delay: 0.4 }}
          className="flex flex-col items-center"
        >
          <span className="text-[#D4AF37] text-[10px] md:text-xs font-black uppercase tracking-[0.4em] md:tracking-[0.6em] mb-6 md:mb-8 block">
            The Professional Orchestration Suite
          </span>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-serif italic text-foreground mb-6 md:mb-10 leading-[1.1] tracking-tight text-center">
            The Art of <br className="hidden sm:block" />
            <span className="text-[#D4AF37]">Celebration</span>
          </h1>
          
          <p className="text-[11px] sm:text-sm md:text-base text-muted-foreground mb-12 md:mb-16 max-w-2xl mx-auto leading-relaxed font-serif italic font-bold tracking-wide px-4 text-center">
            Beautiful digital invitations, seamless QR code entry passes, and zero-commission digital spraying. Built exclusively for Nigeria's most prestigious celebrations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 w-full sm:w-auto">
            <Link to="/create-event" className="w-full sm:w-auto group">
              <motion.div
                animate={{ 
                  boxShadow: [
                    "0 0 0px rgba(212,175,55,0)", 
                    "0 0 50px rgba(212,175,55,0.6)", 
                    "0 0 0px rgba(212,175,55,0)"
                  ],
                  scale: [1, 1.02, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#B8860B] text-black text-[12px] px-12 md:px-14 py-7 md:py-9 rounded-none font-black tracking-[0.4em] uppercase transition-all duration-500 shadow-2xl"
                >
                  Begin Your Celebration
                </Button>
              </motion.div>
            </Link>
            <Link to="/guide" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto bg-white/10 backdrop-blur-xl border-white/40 text-foreground hover:bg-white/20 text-[12px] px-12 md:px-14 py-7 md:py-9 rounded-none font-bold tracking-[0.4em] uppercase transition-all shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
              >
                The Orchestration Guide
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;