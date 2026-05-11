"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Briefcase, ShieldCheck, Sparkles } from 'lucide-react';

const VendorDirectory = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      
      <div className="relative py-24 md:py-40 px-6 overflow-hidden flex items-center justify-center min-h-screen">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-8 block">The Elite Network</span>
            <h1 className="text-4xl md:text-7xl font-serif italic mb-10 leading-tight">
              Vendor Directory — <span className="text-[#D4AF37]">Coming Soon</span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light tracking-wide mb-16">
              We are currently onboarding and vetting qualified vendors to ensure the highest standard of service for our hosts.
            </p>

            <div className="grid md:grid-cols-3 gap-8 opacity-50">
              {[
                { title: "Direct Access", icon: Briefcase },
                { title: "Elite Branding", icon: Sparkles },
                { title: "Vetted Partners", icon: ShieldCheck }
              ].map((feature, i) => (
                <div key={i} className="text-center p-8 border border-white/5 bg-white/[0.02] rounded-[2rem]">
                  <feature.icon className="text-[#D4AF37] w-8 h-8 mx-auto mb-4" />
                  <h3 className="text-sm font-serif italic">{feature.title}</h3>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VendorDirectory;