"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import dashboardHero from '@/assets/mockups/dashboard-hero.png';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0f0f0f] pt-28 md:pt-32 pb-20">
      {/* Background with higher opacity on desktop for depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80" 
          className="w-full h-full object-cover opacity-10 md:opacity-20 animate-slow-zoom"
          alt="Luxury Event Background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-transparent to-[#0f0f0f]" />
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

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-10 w-full sm:w-auto mb-20 md:mb-32">
            <Link to="/create-event" className="w-full sm:w-auto group">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#B8860B] text-black text-[12px] px-12 md:px-16 py-8 md:py-10 rounded-none font-black tracking-[0.4em] uppercase transition-all duration-500 shadow-[0_10px_40px_rgba(212,175,55,0.2)]"
              >
                Start Orchestrating
              </Button>
            </Link>
            <Link to="/vendors" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/5 hover:border-white/40 text-[12px] px-12 md:px-16 py-8 md:py-10 rounded-none font-bold tracking-[0.4em] uppercase transition-colors">
                Curated Directory
              </Button>
            </Link>
          </div>

          {/* Fixed Mockup Placement: Scaled for mobile, wide for desktop */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
            className="w-full max-w-[1000px] mx-auto px-2"
          >
            <div className="relative group">
               {/* Ambient Glow */}
               <div className="absolute -inset-4 bg-[#D4AF37]/10 blur-[120px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
               
               <div className="relative bg-black/40 backdrop-blur-3xl rounded-[1.5rem] md:rounded-[3.5rem] p-2 border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden">
                  <img 
                    src={dashboardHero} 
                    className="w-full h-auto rounded-[1.3rem] md:rounded-[3.3rem] transform transition-transform duration-700 group-hover:scale-[1.02]" 
                    alt="EventHub Platform Interface" 
                  />
               </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;