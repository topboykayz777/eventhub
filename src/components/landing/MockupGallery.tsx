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
    <section className="py-32 md:py-48 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-20 gap-8">
          <div className="text-center md:text-left">
            <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Visual Evidence</span>
            <h2 className="text-5xl md:text-7xl font-serif italic text-white leading-tight">The Product <br /> <span className="text-[#D4AF37]">Atelier</span></h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-3 px-6 py-4 transition-all border ${
                  activeTab === cat.id 
                    ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-[0_0_30px_rgba(212,175,55,0.3)]' 
                    : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'
                }`}
              >
                <cat.icon size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8"
            >
              {activeTab === 'ledger' ? (
                <div className="md:col-span-12">
                   <div className="glass-premium rounded-[3rem] p-2 border-white/10 overflow-hidden shadow-2xl">
                      <img src={activeCategory?.images[0]} className="w-full h-auto rounded-[2.8rem]" alt="Financial Ledger" />
                   </div>
                </div>
              ) : activeTab === 'dashboard' || activeTab === 'vibe' ? (
                <>
                  <div className="md:col-span-8">
                    <div className="glass-premium rounded-[3rem] p-2 border-white/10 overflow-hidden shadow-2xl h-full">
                       <img src={activeCategory?.images[0]} className="w-full h-full object-cover rounded-[2.8rem]" alt="Feature Focus" />
                    </div>
                  </div>
                  <div className="md:col-span-4 flex flex-col gap-8">
                    <div className="glass-premium rounded-[2.5rem] p-2 border-white/10 overflow-hidden shadow-xl flex-1">
                       <img src={activeCategory?.images[1]} className="w-full h-full object-cover rounded-[2.3rem]" alt="Feature Detail 1" />
                    </div>
                    <div className="glass-premium rounded-[2.5rem] p-2 border-white/10 overflow-hidden shadow-xl flex-1">
                       <img src={activeCategory?.images[2]} className="w-full h-full object-cover rounded-[2.3rem]" alt="Feature Detail 2" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="md:col-span-6">
                    <div className="glass-premium rounded-[3rem] p-2 border-white/10 overflow-hidden shadow-2xl">
                       <img src={activeCategory?.images[0]} className="w-full h-auto rounded-[2.8rem]" alt="Feature Variant 1" />
                    </div>
                  </div>
                  <div className="md:col-span-6">
                    <div className="glass-premium rounded-[3rem] p-2 border-white/10 overflow-hidden shadow-2xl">
                       <img src={activeCategory?.images[1]} className="w-full h-auto rounded-[2.8rem]" alt="Feature Variant 2" />
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-24 border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-4">
              <Plus className="text-[#D4AF37]" size={20} />
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                Every screen is optimized for mobile precision and ballroom projection.
              </p>
           </div>
           <p className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-600">
              High-Fidelity Assets • {activeCategory?.count} Mockups in this Suite
           </p>
        </div>
      </div>
    </section>
  );
};

export default MockupGallery;