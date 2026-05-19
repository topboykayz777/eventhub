"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import dashboardHero from '@/assets/mockups/dashboard-hero.png';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0f0f0f] pt-20">
      {/* Background Image with Slow Zoom */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80" 
          className="w-full h-full object-cover opacity-20 md:opacity-30 animate-slow-zoom"
          alt="Luxury Event"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-transparent to-[#0f0f0f]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 px-4 md:px-6 text-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-[#D4AF37] text-[10px] md:text-xs font-bold tracking-[0.4em] md:tracking-[0.6em] uppercase mb-6 md:mb-10 block">
            The Professional Orchestration Suite
          </span>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif italic text-white mb-8 md:mb-12 leading-tight tracking-tight">
            The Art of <br />
            <span className="text-[#D4AF37]">Celebration</span>
          </h1>
          
          <p className="text-base md:text-xl text-gray-400 mb-10 md:mb-16 max-w-3xl mx-auto leading-relaxed font-light tracking-wide px-4 drop-shadow-sm">
            Nigeria's most exclusive digital command center for professional planners and high-society hosts. 
            Orchestrate weddings, galas, and elite events with precision.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-10 px-6 sm:px-0 mb-20">
            <Link to="/create-event" className="w-full sm:w-auto">
              <motion.div
                animate={{ 
                  boxShadow: [
                    "0 0 0px rgba(212, 175, 55, 0)", 
                    "0 0 40px rgba(212, 175, 55, 0.4)", 
                    "0 0 0px rgba(212, 175, 55, 0)"
                  ],
                  scale: [1, 1.02, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#B8860B] text-black text-[12px] px-10 md:px-16 py-8 md:py-10 rounded-none font-black tracking-[0.4em] uppercase transition-all duration-500 shadow-2xl relative overflow-hidden group"
                >
                  <span className="relative z-10">Start Orchestrating</span>
                  <motion.div 
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                  />
                </Button>
              </motion.div>
            </Link>
            <Link to="/vendors" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/5 text-[12px] px-10 md:px-16 py-8 md:py-10 rounded-none font-bold tracking-[0.4em] uppercase">
                Curated Directory
              </Button>
            </Link>
          </div>

          {/* Floating High-Res Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="absolute inset-0 bg-[#D4AF37]/10 blur-[100px] rounded-full" />
            <div className="relative glass-premium p-1 rounded-[2rem] border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden">
               <img 
                 src={dashboardHero} 
                 className="w-full h-auto rounded-[2rem] transform scale-[1.01]" 
                 alt="EventHub Command Center" 
               />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;