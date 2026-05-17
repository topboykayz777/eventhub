"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-[#0f0f0f]">
      {/* Background Image with Slow Zoom */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80" 
          className="w-full h-full object-cover opacity-30 md:opacity-40 animate-slow-zoom"
          alt="Luxury Event"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-transparent to-[#0f0f0f]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 px-4 md:px-6 text-center py-12 md:py-20">
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
          
          <p className="text-base md:text-xl text-gray-200 mb-10 md:mb-16 max-w-3xl mx-auto leading-relaxed font-light tracking-wide px-4 drop-shadow-sm">
            Nigeria's most exclusive digital command center for professional planners and high-society hosts. 
            Orchestrate weddings, galas, and elite events with precision.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-10 px-6 sm:px-0">
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
        </motion.div>
      </div>

      {/* Bottom Decorative Line */}
      <div className="hidden md:block absolute bottom-12 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-[#D4AF37] to-transparent" />
    </section>
  );
};

export default Hero;