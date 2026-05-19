"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-[#0f0f0f] pt-20">
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80" 
          className="w-full h-full object-cover opacity-20 animate-slow-zoom"
          alt="Luxury Event"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-transparent to-[#0f0f0f]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 px-4 md:px-6 text-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-[#D4AF37] text-[10px] md:text-xs font-bold tracking-[0.4em] md:tracking-[0.6em] uppercase mb-6 md:mb-10 block">
            The Professional Orchestration Suite
          </span>
          
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif italic text-white mb-8 md:mb-12 leading-tight tracking-tight">
            The Art of <br />
            <span className="text-[#D4AF37]">Celebration</span>
          </h1>
          
          <p className="text-base md:text-xl text-gray-400 mb-10 md:mb-16 max-w-3xl mx-auto leading-relaxed font-light tracking-wide px-4">
            Nigeria's most exclusive digital command center for professional planners and high-society hosts. 
            Orchestrate weddings, galas, and elite events with precision.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-10 px-6 sm:px-0">
            <Link to="/create-event" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#B8860B] text-black text-[12px] px-16 py-10 rounded-none font-black tracking-[0.4em] uppercase transition-all duration-500 shadow-2xl"
              >
                Start Orchestrating
              </Button>
            </Link>
            <Link to="/vendors" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/5 text-[12px] px-16 py-10 rounded-none font-bold tracking-[0.4em] uppercase">
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