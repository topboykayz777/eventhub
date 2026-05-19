"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, LayoutDashboard, Wallet, ShieldCheck } from 'lucide-react';

// Mockup Imports
import dashboard3 from '@/assets/mockups/dashboard-3.png';
import ledger from '@/assets/mockups/ledger.png';
import vibe1 from '@/assets/mockups/vibe-1.png';

const TheSuite = () => {
  return (
    <section className="py-24 md:py-40 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Comprehensive Tools</span>
            <h2 className="text-4xl md:text-6xl font-serif italic text-white">The Full <span className="text-[#D4AF37]">Orchestration</span> Suite</h2>
          </div>
          <p className="text-gray-500 text-sm font-light tracking-wide max-w-xs md:text-right">
            Every tool is designed to work in harmony, providing a seamless experience from the first RSVP to the final toast.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Dashboard Feature */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="md:col-span-8 bg-white/5 border border-white/10 rounded-[3rem] p-10 h-[500px] relative overflow-hidden group"
          >
            <div className="relative z-10">
              <LayoutDashboard className="text-[#D4AF37] mb-6" size={32} />
              <h3 className="text-2xl font-serif italic text-white mb-4">Command Center</h3>
              <p className="text-gray-400 text-sm font-light max-w-xs">Real-time oversight of your entire guest list, communication, and event status.</p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-3/4 aspect-video bg-[#111] border border-white/10 rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500 overflow-hidden">
               <img src={dashboard3} className="w-full h-full object-cover" alt="Analytics Dashboard" />
            </div>
          </motion.div>

          {/* Ledger Feature */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="md:col-span-4 bg-[#D4AF37] rounded-[3rem] p-10 h-[500px] relative overflow-hidden group"
          >
            <div className="relative z-10">
              <Wallet className="text-black mb-6" size={32} />
              <h3 className="text-2xl font-serif italic text-black mb-4">The Ledger</h3>
              <p className="text-black/60 text-[10px] font-bold uppercase tracking-widest">Financial Transparency</p>
            </div>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-3/4 bg-black/90 rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500 overflow-hidden">
               <img src={ledger} className="w-full h-full object-cover" alt="Financial Ledger" />
            </div>
          </motion.div>

          {/* Vibe Screen Showcase */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="md:col-span-12 bg-white/5 border border-white/10 rounded-[3rem] p-10 md:p-20 relative overflow-hidden group"
          >
            <div className="grid md:grid-cols-2 gap-20 items-center">
              <div>
                <Monitor className="text-[#D4AF37] mb-6" size={32} />
                <h3 className="text-3xl md:text-5xl font-serif italic text-white mb-6">The Cinematic Vibe Screen</h3>
                <p className="text-gray-400 text-lg font-light leading-relaxed mb-10">
                  Transform any venue into a high-tech celebration hub. Live guest arrivals and "Digital Sprays" explode onto the screen with jaw-dropping cinematic animations.
                </p>
                <div className="flex gap-4">
                   <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                      <ShieldCheck className="text-[#D4AF37]" size={14} />
                      <span className="text-[8px] font-black uppercase tracking-widest">Live Sync</span>
                   </div>
                   <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                      <ShieldCheck className="text-[#D4AF37]" size={14} />
                      <span className="text-[8px] font-black uppercase tracking-widest">Retina Optimized</span>
                   </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video bg-[#111] border-8 border-white/10 rounded-2xl shadow-[0_0_100px_rgba(212,175,55,0.2)] overflow-hidden">
                   <img src={vibe1} className="w-full h-full object-cover" alt="Vibe Screen Master" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TheSuite;