"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

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

const allImages = [
  { src: dashboard1, label: 'Command Center', sub: 'Event Orchestration' },
  { src: vibe1, label: 'Vibe Screen', sub: 'Live Celebration' },
  { src: event1, label: 'Digital Shrine', sub: 'Prestige Architecture' },
  { src: ledger, label: 'Financial Vault', sub: 'P2P Ledger' },
  { src: pass1, label: 'Red Carpet', sub: 'QR Entry Protocol' },
  { src: dashboard2, label: 'Analytics', sub: 'Real-time Velocity' },
  { src: vibe2, label: 'Gift Alerts', sub: 'Cinematic Triggers' },
  { src: event2, label: 'Themes', sub: 'Visual DNA' },
  { src: pass2, label: 'Digital Pass', sub: 'Verified Access' },
  { src: vibe3, label: 'Guest Feed', sub: 'Social Engine' }
];

const MockupGallery = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Majestic horizontal translation based on vertical scroll
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-70%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-[#0a0a0a]">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute top-24 left-0 right-0 z-20 px-6 text-center pointer-events-none">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[#D4AF37] text-[10px] md:text-xs font-black uppercase tracking-[0.5em] mb-4 block"
          >
            Visual Evidence
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-8xl font-serif italic text-white leading-tight"
          >
            The Product <span className="text-[#D4AF37]">Atelier</span>
          </motion.h2>
        </div>

        {/* The Majestic Scroll Track */}
        <motion.div style={{ x }} className="flex gap-8 md:gap-16 px-6 md:px-24 items-center">
          {allImages.map((item, index) => (
            <motion.div 
              key={index} 
              className="relative shrink-0 w-[80vw] md:w-[60vw] lg:w-[45vw] aspect-video group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37]/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative h-full w-full bg-black/40 backdrop-blur-xl border border-white/5 rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-2xl">
                <img 
                  src={item.src} 
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
                  alt={item.label} 
                />
                
                {/* Overlay Info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8 md:p-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-[#D4AF37] text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] mb-2">{item.sub}</span>
                  <h3 className="text-2xl md:text-4xl font-serif italic text-white">{item.label}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,#3b0764_0%,transparent_70%)] opacity-20 pointer-events-none" />
      </div>
    </section>
  );
};

export default MockupGallery;