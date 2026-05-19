"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative min-h-[100svh] w-full flex flex-col items-center justify-center overflow-hidden bg-[#0f0f0f] pt-20 md:pt-24">
      {/* Immersive Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80" 
          className="w-full h-full object-cover opacity-10 md:opacity-20 animate-slow-zoom"
          alt="Luxury Event Background"
        />
        {/* Dynamic Shadow & Depth Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-transparent to-[#0f0f0f]" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 px-6 text-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className="flex flex-col items-center"
        >
          <span className="text-[#D4AF37] text-[10px] md:text-xs font-black uppercase tracking-[0.4em] md:tracking-[0.6em] mb-6 md:mb-10 block">
            The Professional Orchestration Suite
          </span>
          
          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-serif italic text-white mb-8 md:mb-12 leading-[1.1] tracking-tight">
            The Art of <br className="hidden sm:block" />
            <span className="text-[#D4AF37]">Celebration</span>
          </h1>
          
          <p className="text-sm md:text-xl text-gray-400 mb-12 md:mb-20 max-w-3xl mx-auto leading-relaxed font-light tracking-wide px-4">
            Nigeria's most exclusive digital command center for professional planners and high-society hosts. 
            Orchestrate weddings, galas, and elite events with surgical precision.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-10 w-full sm:w-auto">
            <Link to="/create-event" className="w-full sm:w-auto group">
              <motion.div
                animate={{ 
                  boxShadow: ["0 0 0px rgba(212,175,55,0)", "0 0 40px rgba(212,175,55,0.4)", "0 0 0px rgba(212,175,55,0)"],
                  x: [0, -1, 1, -1, 1, 0]
                }}
                transition={{ 
                  boxShadow: { repeat: Infinity, duration: 2 },
                  x: { repeat: Infinity, duration: 4, repeatDelay: 1 }
                }}
              >
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#B8860B] text-black text-[12px] px-12 md:px-16 py-8 md:py-10 rounded-none font-black tracking-[0.4em] uppercase transition-all duration-500 shadow-2xl"
                >
                  Start Orchestrating
                </Button>
              </motion.div>
            </Link>
            <Link to="/vendors" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/5 hover:border-white/40 text-[12px] px-12 md:px-16 py-8 md:py-10 rounded-none font-bold tracking-[0.4em] uppercase transition-colors">
                Curated Directory
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;