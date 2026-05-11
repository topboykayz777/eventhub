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
    <div className="min-h-screen bg-[#050505] selection:bg-[#D4AF37] selection:text-black overflow-x-hidden w-full">
      <Navbar />
      
      <main className="overflow-x-hidden w-full">
        <Hero />
        
        <section className="py-12 md:py-16 lg:py-32 border-y border-white/5 bg-[#080808]">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-16">
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
                  <div className="text-xl md:text-2xl lg:text-5xl font-serif italic text-[#D4AF37] mb-1 md:mb-2">{stat.value}</div>
                  <div className="text-[8px] md:text-[10px] text-gray-500 uppercase tracking-[0.2em] md:tracking-[0.4em] font-bold">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 lg:py-40 px-4 md:px-6 lg:px-8 bg-[#080808]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-24">
              <div className="md:w-1/2 text-center md:text-left">
                <span className="text-[#D4AF37] text-[10px] md:text-[10px] font-bold tracking-[0.3em] md:tracking-[0.5em] uppercase mb-4 md:mb-6 lg:mb-8 block">The Concierge Suite</span>
                <h2 className="text-2xl md:text-3xl lg:text-7xl font-serif italic text-white mb-4 md:mb-6 lg:mb-10 leading-tight">
                  Precision in <br className="hidden md:block" /> Every Detail
                </h2>
                <p className="text-sm md:text-base lg:text-xl text-gray-400 mb-6 md:mb-8 lg:mb-12 leading-relaxed font-light tracking-wide">
                  We provide the digital command center for Nigeria's most prestigious events. From real-time budget tracking to automated guest communication, our suite is designed for the professional planner.
                </p>
                <div className="space-y-4 md:space-y-6 lg:space-y-10">
                  {[
                    "Automated WhatsApp Communication",
                    "Real-time Financial Ledger",
                    "Digital Access Control & QR Scanning"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3 md:gap-6 lg:gap-8 group justify-center md:justify-start">
                      <div className="hidden md:block w-12 lg:w-16 h-px bg-[#D4AF37]/30 group-hover:w-16 lg:group-hover:w-24 transition-all duration-700" />
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
                    className="w-full h-[250px] md:h-[400px] lg:h-[600px] object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  />
                </div>
                <div className="hidden md:block absolute -top-8 lg:-top-12 -right-8 lg:-right-12 w-32 lg:w-48 h-32 lg:h-48 border-t border-r border-[#D4AF37]/20" />
                <div className="hidden md:block absolute -bottom-8 lg:-bottom-12 -left-8 lg:-left-12 w-32 lg:w-48 h-32 lg:h-48 border-b border-l border-[#D4AF37]/20" />
              </div>
            </div>
          </div>
        </section>

        <PricingSection />
        
        <FAQ />

        <section className="py-16 md:py-24 lg:py-40 px-4 md:px-6 lg:px-8 text-center bg-[#050505] relative overflow-hidden">
          <div className="absolute inset-0 bg-[#D4AF37]/5 blur-[100px] md:blur-[150px] rounded-full -translate-y-1/2" />
          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-8xl font-serif italic text-white mb-6 md:mb-8 lg:mb-12 leading-tight">
              Master Your <br /> <span className="text-[#D4AF37]">Craft</span>
            </h2>
            <p className="text-xs md:text-sm lg:text-lg text-gray-400 mb-8 md:mb-10 lg:mb-16 font-light tracking-[0.2em] md:tracking-[0.3em] lg:tracking-[0.5em] uppercase">
              The definitive tool for the modern event professional.
            </p>
            <Link to="/create-event">
              <Button className="bg-[#D4AF37] text-black px-8 md:px-12 lg:px-20 py-4 md:py-6 lg:py-10 rounded-none text-[10px] md:text-[10px] lg:text-xs font-bold tracking-[0.3em] md:tracking-[0.4em] lg:tracking-[0.5em] uppercase hover:bg-[#B8860B] transition-all duration-500 shadow-2xl shadow-[#D4AF37]/20">
                Begin Orchestration
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-[#050505] text-white py-12 md:py-16 lg:py-32 px-4 md:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 lg:gap-24">
          <div className="md:col-span-2">
            <div className="text-lg md:text-2xl font-light tracking-[0.3em] md:tracking-[0.5em] uppercase mb-4 md:mb-6 lg:mb-10">
              Event Hub <span className="text-[#D4AF37]">NG</span>
            </div>
            <p className="text-gray-500 max-w-md text-sm md:text-base leading-relaxed font-light tracking-wide">
              The definitive orchestration suite for luxury event management in Nigeria. Curating excellence since 2026.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-4 md:mb-6 lg:mb-10">Navigation</h4>
            <ul className="space-y-3 md:space-y-4 lg:space-y-6 text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">
              <li><Link to="/create-event" className="hover:text-white transition-colors">Create</Link></li>
              <li><Link to="/vendors" className="hover:text-white transition-colors">Directory</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ & Guide</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-4 md:mb-6 lg:mb-10">Social</h4>
            <ul className="space-y-3 md:space-y-4 lg:space-y-6 text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 md:mt-16 lg:mt-32 pt-8 md:pt-12 border-t border-white/5 text-center text-gray-600 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em]">
          © 2026 Event Hub Nigeria. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;