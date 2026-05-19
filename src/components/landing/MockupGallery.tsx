"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Monitor, Ticket, Wallet, Sparkles, Plus } from 'lucide-react';

// Mockup Imports
import dashboard1 from '@/assets/mockups/dashboard-hero.png';
import dashboard2 from '@/assets/mockups/dashboard-2.png';
import dashboard3 from '@/assets/mockups/dashboard-3.png';
import event1 from '@/assets/mockups/event-1.png';
import event2 from '@/assets/mockups/event-2.png';
import ledger from '@/assets/mockups/ledger.png';
import pass1 from '@/assets/mockups/qr-pass-1.png';
import pass2 from '@/assets/mockups/qr-pass-2.png';
import vibe1 from '@/assets/mockups/vibe-1.png';
import vibe2 from '@/assets/mockups/vibe-2.png';
import vibe3 from '@/assets/mockups/vibe-3.png';

const categories = [
  { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard, count: 3, images: [dashboard1, dashboard2, dashboard3] },
  { id: 'vibe', label: 'Vibe Screen', icon: Monitor, count: 3, images: [vibe1, vibe2, vibe3] },
  { id: 'events', label: 'Architecture', icon: Sparkles, count: 2, images: [event1, event2] },
  { id: 'passes', label: 'Red Carpet', icon: Ticket, count: 2, images: [pass1, pass2] },
  { id: 'ledger', label: 'Financial Vault', icon: Wallet, count: 1, images: [ledger] },
];

const MockupGallery = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const activeCategory = categories.find(c => c.id === activeTab);

  return (
    <section className="py-24 md:py-48 bg-[#1a0533] relative overflow-hidden">
      {/* Royal Purple Atmospheric Effects */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-10" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,#3b0764_0%,transparent_70%)] opacity-50" />

      <div className="max-w-7xl mx-auto px-6 relative z-20">
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-[#D4AF37] text-[10px] md:text-xs font-black uppercase tracking-[0.5em] mb-4 block"
          >
            Visual Evidence
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-8xl font-serif italic text-white leading-tight mb-12"
          >
            The Product <span className="text-[#D4AF37]">Atelier</span>
          </motion.h2>
          
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 md:gap-3 px-5 md:px-8 py-3 md:py-4 transition-all border-2 rounded-full ${
                  activeTab === cat.id 
                    ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-[0_0_30px_rgba(212,175,55,0.4)]' 
                    : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <cat.icon size={14} className={activeTab === cat.id ? 'text-black' : 'text-[#D4AF37]'} />
                <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative min-h-[400px] md:min-h-[700px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8"
            >
              {activeTab === 'ledger' ? (
                <div className="md:col-span-12 group">
                   <div className="bg-black/40 backdrop-blur-xl rounded-[2rem] md:rounded-[4rem] p-2 border border-[#D4AF37]/20 overflow-hidden shadow-2xl">
                      <img 
                        src={activeCategory?.images[0]} 
                        className="w-full h-auto rounded-[1.8rem] md:rounded-[3.8rem] transition-transform duration-700 group-hover:scale-105" 
                        alt="Financial Ledger" 
                      />
                   </div>
                </div>
              ) : activeTab === 'dashboard' || activeTab === 'vibe' ? (
                <>
                  <div className="md:col-span-8 group">
                    <div className="bg-black/40 backdrop-blur-xl rounded-[2rem] md:rounded-[4rem] p-2 border border-[#D4AF37]/20 overflow-hidden shadow-2xl h-full">
                       <img 
                         src={activeCategory?.images[0]} 
                         className="w-full h-full object-cover rounded-[1.8rem] md:rounded-[3.8rem] transition-transform duration-700 group-hover:scale-105" 
                         alt="Feature Focus" 
                       />
                    </div>
                  </div>
                  <div className="md:col-span-4 flex flex-col gap-4 md:gap-8">
                    <div className="bg-black/40 backdrop-blur-xl rounded-[1.5rem] md:rounded-[3rem] p-2 border border-[#D4AF37]/20 overflow-hidden shadow-xl flex-1 group">
                       <img 
                         src={activeCategory?.images[1]} 
                         className="w-full h-full object-cover rounded-[1.3rem] md:rounded-[2.8rem] transition-transform duration-700 group-hover:scale-105" 
                         alt="Feature Detail 1" 
                       />
                    </div>
                    <div className="bg-black/40 backdrop-blur-xl rounded-[1.5rem] md:rounded-[3rem] p-2 border border-[#D4AF37]/20 overflow-hidden shadow-xl flex-1 group">
                       <img 
                         src={activeCategory?.images[2]} 
                         className="w-full h-full object-cover rounded-[1.3rem] md:rounded-[2.8rem] transition-transform duration-700 group-hover:scale-105" 
                         alt="Feature Detail 2" 
                       />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="md:col-span-6 group">
                    <div className="bg-black/40 backdrop-blur-xl rounded-[2rem] md:rounded-[4rem] p-2 border border-[#D4AF37]/20 overflow-hidden shadow-2xl">
                       <img 
                         src={activeCategory?.images[0]} 
                         className="w-full h-auto rounded-[1.8rem] md:rounded-[3.8rem] transition-transform duration-700 group-hover:scale-105" 
                         alt="Feature Variant 1" 
                       />
                    </div>
                  </div>
                  <div className="md:col-span-6 group">
                    <div className="bg-black/40 backdrop-blur-xl rounded-[2rem] md:rounded-[4rem] p-2 border border-[#D4AF37]/20 overflow-hidden shadow-2xl">
                       <img 
                         src={activeCategory?.images[1]} 
                         className="w-full h-auto rounded-[1.8rem] md:rounded-[3.8rem] transition-transform duration-700 group-hover:scale-105" 
                         alt="Feature Variant 2" 
                       />
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-16 md:mt-24 border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-4 text-center md:text-left">
              <Plus className="text-[#D4AF37] shrink-0" size={24} />
              <p className="text-white/60 text-xs md:text-base font-light leading-relaxed max-w-md">
                Every tool in the suite is meticulously designed for high-stakes environments, optimized for both mobile precision and ballroom projection.
              </p>
           </div>
           <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">
              Premium Orchestration • {activeCategory?.count} Assets in this Module
           </p>
        </div>
      </div>
    </section>
  );
};

export default MockupGallery;