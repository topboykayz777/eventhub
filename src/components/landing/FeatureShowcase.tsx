"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wallet, ShieldCheck, CheckCircle2, Crown, Gem } from 'lucide-react';
import confetti from 'canvas-confetti';

const features = [
  {
    id: 'create',
    title: 'The Creation',
    desc: 'Design a bespoke digital experience in minutes. Choose your aesthetic, upload your portraits, and watch your masterpiece come to life.',
    icon: Sparkles,
    color: '#D4AF37'
  },
  {
    id: 'manage',
    title: 'The Ledger',
    desc: 'Orchestrate your finances with precision. Track every expense and income in real-time, ensuring your celebration remains within the bounds of excellence.',
    icon: Wallet,
    color: '#D4AF37'
  },
  {
    id: 'verify',
    title: 'The Gatekeeper',
    desc: 'Seamless entry for your elite guests. Scan unique QR passes at the door and manage your registry with a single touch.',
    icon: ShieldCheck,
    color: '#D4AF37'
  }
];

const FeatureShowcase = () => {
  const [activeTab, setActiveTab] = useState('create');

  useEffect(() => {
    if (activeTab === 'create') {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8, x: 0.5 },
        colors: ['#D4AF37', '#F9E4B7', '#FFFFFF'],
        disableForReducedMotion: true
      });
    }
  }, [activeTab]);

  return (
    <section className="py-40 px-6 bg-[#080808] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block"
          >
            The Ecosystem
          </motion.span>
          <h2 className="text-5xl md:text-7xl font-serif italic text-white mb-8">
            Seamless <span className="text-[#D4AF37]">Orchestration</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-24 items-center">
          {/* Left: Interactive UI */}
          <div className="relative aspect-square bg-white/[0.02] border border-white/5 rounded-[4rem] overflow-hidden flex items-center justify-center p-12">
            <div className="absolute inset-0 bg-[#D4AF37]/5 blur-[100px]" />
            
            <AnimatePresence mode="wait">
              {activeTab === 'create' && (
                <motion.div 
                  key="create-ui"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  className="relative w-full max-w-xs aspect-[4/5.5] bg-black border-2 border-[#D4AF37]/30 rounded-[2.5rem] p-8 shadow-2xl"
                >
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full h-32 bg-white/5 rounded-2xl mb-6 overflow-hidden"
                  >
                    <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80" className="w-full h-full object-cover grayscale" alt="Preview" />
                  </motion.div>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="h-4 bg-[#D4AF37]/20 rounded-full mb-4"
                  />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '70%' }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="h-4 bg-white/5 rounded-full mb-8"
                  />
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2, type: 'spring' }}
                    className="w-full h-12 bg-[#D4AF37] rounded-xl flex items-center justify-center"
                  >
                    <span className="text-[8px] font-black uppercase tracking-widest text-black">Live Preview</span>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === 'manage' && (
                <motion.div 
                  key="manage-ui"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  className="w-full space-y-8"
                >
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-4">Remaining Budget</p>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-6xl md:text-8xl font-serif italic text-[#D4AF37]"
                    >
                      ₦1,450,000
                    </motion.div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: 'Champagne Supply', amount: '- ₦450,000', color: 'text-red-500' },
                      { label: 'Floral Decor', amount: '- ₦100,000', color: 'text-red-500' },
                      { label: 'VIP Ticket Sales', amount: '+ ₦250,000', color: 'text-green-500' }
                    ].map((item, i) => (
                      <motion.div 
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.2 }}
                        className="bg-white/5 p-6 border border-white/5 flex justify-between items-center"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{item.label}</span>
                        <span className={`text-sm font-serif italic ${item.color}`}>{item.amount}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'verify' && (
                <motion.div 
                  key="verify-ui"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  className="relative flex flex-col items-center"
                >
                  <div className="relative w-48 h-48 bg-white p-4 rounded-3xl mb-12">
                    <div className="w-full h-full bg-black/5 flex items-center justify-center">
                      <ShieldCheck className="w-24 h-24 text-black/10" />
                    </div>
                    <motion.div 
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-1 bg-[#D4AF37] shadow-[0_0_15px_#D4AF37]"
                    />
                  </div>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="bg-green-500/10 border border-green-500/20 px-8 py-4 rounded-full flex items-center gap-4"
                  >
                    <CheckCircle2 className="text-green-500 w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-green-500">Guest Verified</span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Content Tabs */}
          <div className="space-y-12">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                className={`w-full text-left p-10 transition-all duration-500 border-l-2 ${
                  activeTab === feature.id 
                    ? 'border-[#D4AF37] bg-white/[0.03]' 
                    : 'border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-6 mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    activeTab === feature.id ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-gray-500'
                  }`}>
                    <feature.icon size={24} />
                  </div>
                  <h3 className={`text-2xl font-serif italic ${
                    activeTab === feature.id ? 'text-white' : 'text-gray-500'
                  }`}>
                    {feature.title}
                  </h3>
                </div>
                <p className={`text-sm font-light leading-relaxed tracking-wide transition-colors ${
                  activeTab === feature.id ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {feature.desc}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;