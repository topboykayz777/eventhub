"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ProofSlash = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-5, 5]);

  return (
    <section ref={containerRef} className="relative py-40 md:py-60 bg-[#050505] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative h-[600px] md:h-[900px]">
        
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#D4AF3710_0%,transparent_70%)] pointer-events-none" />

        {/* IMAGE 1: Event Page (Large Backdrop) */}
        <motion.div 
          style={{ y: y1, rotate: -2 }}
          className="absolute top-[10%] left-0 w-[60%] md:w-[50%] z-10"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37]/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative overflow-hidden rounded-[2rem] md:rounded-[4rem] border border-white/5 shadow-2xl shadow-black/50">
              <img src="/proof/event-page.png" alt="Event Hub Page" className="w-full h-auto grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
            </div>
          </div>
        </motion.div>

        {/* IMAGE 2: Vibe Screen (Top Right) */}
        <motion.div 
          style={{ y: y2, rotate: 3 }}
          className="absolute top-0 right-0 w-[55%] md:w-[45%] z-20"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-l from-[#D4AF37]/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative overflow-hidden rounded-[2rem] md:rounded-[4rem] border border-white/10 shadow-2xl shadow-black/80 scale-105">
              <img src="/proof/vibe-screen.png" alt="Vibe Screen Live" className="w-full h-auto" />
            </div>
          </div>
        </motion.div>

        {/* IMAGE 3: Financial Ledger (Bottom Left Overlap) */}
        <motion.div 
          style={{ y: y2, x: 20 }}
          className="absolute bottom-[5%] left-[5%] w-[50%] md:w-[40%] z-30"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-black/40 blur-xl" />
            <div className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-white/5 shadow-2xl">
              <img src="/proof/ledger.png" alt="Financial Ledger" className="w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </motion.div>

        {/* IMAGE 4: QR Pass (Mobile Foreground - The Hook) */}
        <motion.div 
          style={{ y: y1, rotate }}
          className="absolute bottom-0 right-[10%] w-[45%] md:w-[35%] z-40"
        >
          <div className="relative group">
            <div className="absolute -inset-4 bg-[#D4AF37]/10 rounded-full blur-3xl opacity-50 animate-pulse" />
            <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] border-2 border-[#D4AF37]/30 shadow-[0_0_50px_rgba(212,175,55,0.2)]">
              <img src="/proof/qr-pass.png" alt="Digital Entry Pass" className="w-full h-auto" />
            </div>
          </div>
        </motion.div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-20 right-20 w-32 h-32 border border-[#D4AF37]/10 rounded-full rotate-45" />
          <div className="absolute bottom-40 left-10 w-64 h-64 border border-[#D4AF37]/5 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default ProofSlash;