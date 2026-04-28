"use client";

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/landing/Hero';
import PricingSection from '@/components/landing/PricingSection';
import FAQ from '@/components/landing/FAQ';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const Index = () => {
  useEffect(() => {
    const end = Date.now() + 2 * 1000;
    const colors = ['#D4AF37', '#ffffff', '#F9E4B7'];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: colors
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-[#D4AF37] selection:text-black overflow-x-hidden max-w-full">
      <Navbar />
      
      <main className="overflow-x-hidden max-w-full">
        <Hero />
        
        <section className="py-16 md:py-32 border-y border-white/5 bg-[#080808]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
              {[
                { label: 'Events Orchestrated', value: '12k+' },
                { label: 'Guests Managed', value: '500k+' },
                { label: 'Moments Captured', value: '1M+' },
                { label: 'Satisfaction', value: '100%' }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl md:text-5xl font-serif italic text-[#D4AF37] mb-2">{stat.value}</div>
                  <div className="text-[8px] md:text-[10px] text-gray-500 uppercase tracking-[0.2em] md:tracking-[0.4em] font-bold">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-40 px-6 bg-[#080808]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
              <div className="md:w-1/2 text-center md:text-left">
                <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-6 md:mb-8 block">The Concierge Suite</span>
                <h2 className="text-3xl md:text-7xl font-serif italic text-white mb-6 md:mb-10 leading-tight">
                  Precision in <br className="hidden md:block" /> Every Detail
                </h2>
                <p className="text-base md:text-xl text-gray-400 mb-8 md:mb-12 leading-relaxed font-light tracking-wide">
                  We provide the digital command center for Nigeria's most prestigious events. From real-time budget tracking to automated guest communication, our suite is designed for the professional planner.
                </p>
                <div className="space-y-6 md:space-y-10">
                  {[
                    "Automated WhatsApp Communication",
                    "Real-time Financial Ledger",
                    "Digital Access Control & QR Scanning"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-4 md:gap-8 group justify-center md:justify-start">
                      <div className="hidden md:block w-16 h-px bg-[#D4AF37]/30 group-hover:w-24 transition-all duration-700" />
                      <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-300">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:w-1/2 relative w-full">
                <div className="relative z-10 border border-white/10 p-2 md:p-4 glass-premium">
                  <img 
                    src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80" 
                    alt="Elegant Event" 
                    className="w-full h-[300px] md:h-[600px] object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  />
                </div>
                <div className="hidden md:block absolute -top-12 -right-12 w-48 h-48 border-t border-r border-[#D4AF37]/20" />
                <div className="hidden md:block absolute -bottom-12 -left-12 w-48 h-48 border-b border-l border-[#D4AF37]/20" />
              </div>
            </div>
          </div>
        </section>

        <PricingSection />
        
        <FAQ />

        <section className="py-24 md:py-40 px-6 text-center bg-[#050505] relative overflow-hidden">
          <div className="absolute inset-0 bg-[#D4AF37]/5 blur-[150px] rounded-full -translate-y-1/2" />
          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-8xl font-serif italic text-white mb-8 md:mb-12 leading-tight">
              Master Your <br /> <span className="text-[#D4AF37]">Craft</span>
            </h2>
            <p className="text-sm md:text-lg text-gray-400 mb-10 md:mb-16 font-light tracking-[0.3em] md:tracking-[0.5em] uppercase">
              The definitive tool for the modern event professional.
            </p>
            <Link to="/create-event">
              <Button className="bg-[#D4AF37] text-black px-12 md:px-20 py-6 md:py-10 rounded-none text-[10px] font-bold tracking-[0.3em] md:tracking-[0.5em] uppercase hover:bg-[#B8860B] transition-all duration-500 shadow-2xl shadow-[#D4AF37]/20">
                Begin Orchestration
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-[#050505] text-white py-16 md:py-32 px-6 md:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-24">
          <div className="md:col-span-2">
            <div className="text-lg md:text-2xl font-light tracking-[0.3em] md:tracking-[0.5em] uppercase mb-6 md:mb-10">
              Event Hub <span className="text-[#D4AF37]">NG</span>
            </div>
            <p className="text-gray-500 max-w-md text-sm md:text-base leading-relaxed font-light tracking-wide">
              The definitive orchestration suite for luxury event management in Nigeria. Curating excellence since 2026.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-6 md:mb-10">Navigation</h4>
            <ul className="space-y-4 md:space-y-6 text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">
              <li><Link to="/create-event" className="hover:text-white transition-colors">Create</Link></li>
              <li><Link to="/vendors" className="hover:text-white transition-colors">Directory</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-6 md:mb-10">Social</h4>
            <ul className="space-y-4 md:space-y-6 text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 md:mt-32 pt-8 md:pt-12 border-t border-white/5 text-center text-gray-600 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em]">
          © 2026 Event Hub Nigeria. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;