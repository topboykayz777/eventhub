"use client";

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/landing/Hero';
import TheHook from '@/components/landing/TheHook';
import TheNarrative from '@/components/landing/TheNarrative';
import MockupGallery from '@/components/landing/MockupGallery';
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
    <div className="min-h-screen bg-[#050505] selection:bg-[#D4AF37] selection:text-black overflow-x-hidden w-full flex flex-col items-center">
      <Navbar />
      
      <main className="w-full flex flex-col items-center">
        {/* HERO SECTION */}
        <Hero />
        
        {/* STATS STRIP - Perfectly Centered */}
        <section className="w-full py-16 md:py-32 border-y border-white/5 bg-[#080808]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24">
              {[
                { label: 'Events Orchestrated', value: '12k+' },
                { label: 'Guests Managed', value: '500k+' },
                { label: 'Moments Captured', value: '1M+' },
                { label: 'Success Rate', value: '100%' }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-6xl font-serif italic text-[#D4AF37] mb-3">{stat.value}</div>
                  <div className="text-[9px] md:text-[11px] text-gray-500 uppercase tracking-[0.4em] font-bold">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* THE HOOK (Direct Conversion Section) */}
        <div className="w-full">
           <TheHook />
        </div>

        {/* THE IMMERSIVE NARRATIVE */}
        <div className="w-full">
           <TheNarrative />
        </div>

        {/* THE ATELIER GALLERY - Deep Purple & Gold */}
        <div className="w-full">
           <MockupGallery />
        </div>
        
        {/* FAQ - Spaced & Balanced */}
        <div className="w-full py-20 md:py-40">
           <FAQ />
        </div>

        {/* FINAL CALL TO ACTION */}
        <section className="w-full py-32 md:py-60 px-6 text-center bg-[#050505] relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 bg-[#D4AF37]/5 blur-[150px] rounded-full -translate-y-1/2" />
          <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
            <h2 className="text-5xl md:text-8xl lg:text-9xl font-serif italic text-white mb-8 md:mb-16 leading-tight">
              Master Your <br /> <span className="text-[#D4AF37]">Craft</span>
            </h2>
            <p className="text-sm md:text-xl text-gray-400 mb-12 md:mb-24 font-light tracking-[0.3em] md:tracking-[0.5em] uppercase max-w-2xl">
              The definitive tool for the modern event professional.
            </p>
            <Link to="/create-event">
              <Button className="bg-[#D4AF37] text-black px-12 md:px-24 py-8 md:py-12 rounded-none text-[11px] md:text-xs font-black tracking-[0.5em] uppercase hover:bg-[#B8860B] transition-all duration-500 shadow-2xl shadow-[#D4AF37]/20">
                Begin Orchestration
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="w-full bg-[#050505] text-white py-20 md:py-40 px-6 border-t border-white/5 flex flex-col items-center">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-24 w-full">
          <div className="md:col-span-2 text-center md:text-left">
            <div className="text-2xl md:text-3xl font-light tracking-[0.5em] uppercase mb-8">
              Event Hub <span className="text-[#D4AF37]">NG</span>
            </div>
            <p className="text-gray-500 max-w-md text-base leading-relaxed font-light tracking-wide mx-auto md:mx-0">
              The definitive orchestration suite for luxury event management in Nigeria. Curating excellence since 2026.
            </p>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.5em] text-[#D4AF37] mb-10">Navigation</h4>
            <ul className="space-y-6 text-gray-500 text-[11px] font-bold uppercase tracking-[0.4em]">
              <li><Link to="/create-event" className="hover:text-white transition-colors">Create</Link></li>
              <li><Link to="/vendors" className="hover:text-white transition-colors">Directory</Link></li>
              <li><Link to="/support" className="hover:text-white transition-colors">Support</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy & Terms</Link></li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.5em] text-[#D4AF37] mb-10">Social</h4>
            <ul className="space-y-6 text-gray-500 text-[11px] font-bold uppercase tracking-[0.4em]">
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 md:mt-40 pt-12 border-t border-white/5 text-center text-gray-600 text-[10px] font-bold uppercase tracking-[0.5em] w-full">
          © 2026 Event Hub Nigeria. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;