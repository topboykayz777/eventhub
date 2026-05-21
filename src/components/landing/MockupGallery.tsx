"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const allImages = [
  { 
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80", 
    label: 'Command Center', 
    sub: 'Real-time Event Orchestration',
    desc: 'Manage thousands of guests with surgical precision from a single high-fidelity dashboard.'
  },
  { 
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80", 
    label: 'Vibe Screen', 
    sub: 'Live Celebration Engine',
    desc: 'Transform ballrooms with cinematic gift alerts and real-time guest arrivals on the big screen.'
  },
  { 
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80", 
    label: 'Digital Shrine', 
    sub: 'Prestige Architecture',
    desc: 'A digital monument for your event. 20+ bespoke themes designed for Nigerias elite.'
  },
  { 
    src: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80", 
    label: 'Financial Vault', 
    sub: 'Verified P2P Ledger',
    desc: 'Secure direct transfers. No commissions. Just pure, verified traditional spraying digitized.'
  },
  { 
    src: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80", 
    label: 'Red Carpet', 
    sub: 'QR Entry Protocol',
    desc: 'Instant verification at the gate. Professionalism that starts at the first point of contact.'
  }
];

const MockupGallery = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Smooth out the scroll feeling with spring physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const x = useTransform(smoothProgress, [0, 1], ["5%", "-65%"]);

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-background">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        {/* Cinematic Background Typography */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] select-none">
          <h2 className="text-[25vw] font-serif italic whitespace-nowrap">The Atelier</h2>
        </div>

        {/* Section Header */}
        <div className="absolute top-12 md:top-24 left-0 right-0 z-20 px-6 text-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <span className="text-[#D4AF37] text-[10px] md:text-xs font-black uppercase tracking-[0.6em] mb-4 block">
              The Evidence of Mastery
            </span>
            <h2 className="text-4xl md:text-8xl font-serif italic text-foreground leading-tight">
              The Product <span className="text-[#D4AF37]">Exhibition</span>
            </h2>
          </motion.div>
        </div>

        {/* The Majestic Scroll Track */}
        <motion.div style={{ x }} className="flex gap-12 md:gap-32 px-12 md:px-24 items-center">
          {allImages.map((item, index) => (
            <motion.div 
              key={index} 
              className="relative shrink-0 w-[85vw] md:w-[70vw] lg:w-[55vw] aspect-[16/10] group"
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              viewport={{ margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Luxury Frame */}
              <div className="absolute -inset-4 bg-[#D4AF37]/5 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              
              <div className="relative h-full w-full bg-secondary border border-border rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.4)]">
                {/* Image Layer with Subtle Zoom */}
                <motion.img 
                  src={item.src} 
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2s] ease-out" 
                  alt={item.label} 
                />

                {/* Glass Info Card */}
                <div className="absolute bottom-8 left-8 right-8 md:bottom-16 md:left-16 md:right-16 z-30">
                  <div className="glass-premium p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border-white/10 flex flex-col md:flex-row justify-between items-end gap-6 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                    <div className="max-w-md text-left space-y-4">
                      <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em]">{item.sub}</span>
                      <h3 className="text-3xl md:text-5xl font-serif italic text-white">{item.label}</h3>
                      <p className="text-sm md:text-base text-white/50 font-light leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-12">
                      <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-serif italic">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dark Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Dynamic Light Beam / Lens Flare */}
        <motion.div 
          style={{ 
            left: useTransform(smoothProgress, [0, 1], ["-10%", "110%"]),
            top: "50%"
          }}
          className="absolute w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none z-10"
        />
        
        {/* Scroll Progress Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6">
          <div className="w-48 h-[2px] bg-border rounded-full overflow-hidden">
            <motion.div 
              style={{ scaleX: smoothProgress }}
              className="h-full bg-[#D4AF37] origin-left"
            />
          </div>
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Exhibition Progress</span>
        </div>
      </div>
    </section>
  );
};

export default MockupGallery;