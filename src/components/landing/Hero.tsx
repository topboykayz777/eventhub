"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-[#0f0f0f]">
      {/* Background Image with Slow Zoom */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80" 
          className="w-full h-full object-cover opacity-40 animate-slow-zoom"
          alt="Luxury Event"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-transparent to-[#0f0f0f]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 px-6 text-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <span className="text-[#D4AF37] text-[8px] md:text-[10px] font-bold tracking-[0.3em] md:tracking-[0.5em] uppercase mb-6 md:mb-8 block">
            Established in Excellence
          </span>
          
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif italic text-white mb-8 md:mb-10 leading-tight tracking-tight">
            The Art of <br />
            <span className="text-[#D4AF37]">Celebration</span>
          </h1>
          
          <p className="text-base md:text-xl text-gray-400 mb-12 md:mb-16 max-w-2xl mx-auto leading-relaxed font-light tracking-wide">
            Nigeria's most exclusive digital platform for weddings, galas, and high-society events. 
            Where tradition meets modern elegance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8">
            <Link to="/create-event" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#B8860B] text-black text-[10px] px-12 py-8 rounded-none font-bold tracking-[0.3em] uppercase transition-all duration-500 hover:px-16">
                Create Your Event
              </Button>
            </Link>
            <Link to="/vendors" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/5 text-[10px] px-12 py-8 rounded-none font-bold tracking-[0.3em] uppercase">
                The Directory
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Bottom Decorative Line - Hidden on small screens to save space */}
      <div className="hidden md:block absolute bottom-12 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-[#D4AF37] to-transparent" />
    </section>
  );
};

export default Hero;