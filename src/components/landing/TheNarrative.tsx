"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Sparkles, Users, Coins, CheckCircle2, QrCode, Send, ShieldCheck, Ticket } from 'lucide-react';

const NarrativeAct = ({ 
  title, 
  subtitle, 
  description, 
  index 
}: { 
  title: string; 
  subtitle: string; 
  description: string; 
  index: number 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" });

  return (
    <div ref={ref} className="min-h-screen flex flex-col justify-center py-20">
      <motion.div
        initial={{ opacity: 0.1, x: -20 }}
        animate={{ 
          opacity: isInView ? 1 : 0.1, 
          x: isInView ? 0 : -20,
          filter: isInView ? "blur(0px)" : "blur(4px)"
        }}
        transition={{ duration: 0.8 }}
        className="max-w-md"
      >
        <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.5em] mb-6 block">
          Act 0{index + 1} — {subtitle}
        </span>
        <h2 className="text-5xl md:text-7xl font-serif italic text-white mb-8 leading-tight">
          {title}
        </h2>
        <p className="text-gray-400 text-lg font-light leading-relaxed tracking-wide">
          {description}
        </p>
      </motion.div>
    </div>
  );
};

const LivingMockup = ({ progress }: { progress: any }) => {
  // Act Transitions
  const step = useTransform(progress, [0, 0.25, 0.5, 0.75, 1], [0, 1, 2, 3, 4]);
  
  return (
    <div className="sticky top-1/4 w-full aspect-[4/5] md:aspect-square max-w-xl mx-auto">
      {/* Glow Aura */}
      <motion.div 
        style={{ 
          scale: useTransform(progress, [0, 0.5, 1], [1, 1.2, 1]),
          opacity: useTransform(progress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0.2, 0.4, 0.2, 0.5, 0.2, 0.3])
        }}
        className="absolute inset-0 bg-[#D4AF37]/20 rounded-full blur-[120px] -z-10" 
      />

      <motion.div 
        className="w-full h-full glass-premium rounded-[4rem] border-white/10 p-1 md:p-8 flex flex-col relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
      >
        {/* INNER CONTENT THAT MORPHS */}
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
          
          {/* ACT 1: DESIGN */}
          <motion.div 
            style={{ 
              opacity: useTransform(progress, [0, 0.2, 0.25], [1, 1, 0]),
              scale: useTransform(progress, [0, 0.2, 0.25], [1, 1, 0.8]),
              y: useTransform(progress, [0, 0.2, 0.25], [0, 0, -20])
            }}
            className="absolute inset-0 flex flex-col items-center justify-center p-12"
          >
            <div className="w-16 h-16 border-2 border-[#D4AF37] rotate-45 flex items-center justify-center mb-10">
              <Sparkles className="text-[#D4AF37] -rotate-45" size={24} />
            </div>
            <h3 className="text-3xl font-serif italic mb-4">The Balogun Wedding</h3>
            <div className="w-48 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent mb-6" />
            <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-gray-500">Midnight Noir Theme Activated</p>
          </motion.div>

          {/* ACT 2: GUESTS */}
          <motion.div 
            style={{ 
              opacity: useTransform(progress, [0.25, 0.3, 0.5, 0.55], [0, 1, 1, 0]),
              scale: useTransform(progress, [0.25, 0.3, 0.5, 0.55], [0.9, 1, 1, 0.9]),
              y: useTransform(progress, [0.25, 0.3, 0.5, 0.55], [20, 0, 0, -20])
            }}
            className="absolute inset-0 flex flex-col p-10 pt-16"
          >
            <div className="flex justify-between items-end mb-10 text-left">
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37] mb-1">Live Registry</p>
                <h3 className="text-2xl font-serif italic">The Guest List</h3>
              </div>
              <div className="text-right">
                <p className="text-xl font-serif italic">142</p>
                <p className="text-[7px] font-bold uppercase tracking-widest text-gray-500">Confirmed</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { name: "Folake A.", time: "2m ago", status: "Joined" },
                { name: "David O.", time: "5m ago", status: "Joined" },
                { name: "Chidi B.", time: "12m ago", status: "Joined" }
              ].map((guest, i) => (
                <motion.div 
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-2xl"
                >
                  <span className="text-sm font-light">{guest.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[7px] text-gray-600 uppercase">{guest.time}</span>
                    <span className="text-[7px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">{guest.status}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ACT 3: VIBE / SPRAY */}
          <motion.div 
            style={{ 
              opacity: useTransform(progress, [0.55, 0.6, 0.8, 0.85], [0, 1, 1, 0]),
              scale: useTransform(progress, [0.55, 0.6, 0.8, 0.85], [0.9, 1, 1, 0.9])
            }}
            className="absolute inset-0 flex flex-col items-center justify-center p-12"
          >
             <motion.div 
                animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 0.9, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-32 h-32 bg-[#D4AF37] rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.4)] mb-10"
             >
                <Coins size={48} className="text-black" />
             </motion.div>
             <p className="text-[10px] font-black uppercase tracking-[0.6em] text-[#D4AF37] mb-4">Digital Spray Inbound</p>
             <h3 className="text-4xl font-serif italic mb-2 text-white">₦500,000</h3>
             <p className="text-xs text-gray-500 tracking-widest uppercase">Hon. Segun Arinze</p>
          </motion.div>

          {/* ACT 4: LEGACY */}
          <motion.div 
            style={{ 
              opacity: useTransform(progress, [0.85, 0.9, 1], [0, 1, 1]),
              scale: useTransform(progress, [0.85, 0.9, 1], [0.9, 1, 1])
            }}
            className="absolute inset-0 flex flex-col items-center justify-center p-12"
          >
            <div className="w-full max-w-[200px] aspect-square bg-white p-4 rounded-3xl mb-10 shadow-2xl">
              <div className="w-full h-full border-4 border-black/5 flex items-center justify-center">
                <Ticket className="text-black" size={80} />
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-green-500/10 border border-green-500/30 rounded-full">
              <CheckCircle2 size={16} className="text-green-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Access Granted</span>
            </div>
            <p className="mt-6 text-gray-500 text-[8px] font-bold uppercase tracking-widest">Entry Verified by EventHub</p>
          </motion.div>

        </div>

        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-[#D4AF37]/30 rounded-tl-[4rem]" />
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-[#D4AF37]/30 rounded-br-[4rem]" />
      </motion.div>
    </div>
  );
};

const TheNarrative = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  const acts = [
    {
      subtitle: "The Architecture",
      title: "Design Your Digital Shrine",
      description: "Select from our library of 20+ aesthetic themes curated for Nigeria's elite. Whether it's Midnight Noir or Crimson Dynasty, your event page becomes a premium digital monument."
    },
    {
      subtitle: "The Dispatch",
      title: "Orchestrate the Gathering",
      description: "Manage guest lists with surgical precision. One-touch WhatsApp blasts, automated RSVP tracking, and real-time seated charts. Your guest list is no longer a document; it's a living engine."
    },
    {
      subtitle: "The Vibe",
      title: "The Art of the Spray",
      description: "Digitize the tradition. Our secure, 0-commission Digital Spraying system allows guests to honor you from anywhere in the world, triggering cinematic animations on the ballroom screens."
    },
    {
      subtitle: "The Red Carpet",
      title: "Seamless Access Control",
      description: "A secure digital entry pass for every guest. Scan high-fidelity QR codes at the gate for instant check-in. Professionalism starts at the door, and ends with a legacy."
    }
  ];

  return (
    <section ref={targetRef} className="relative bg-[#050505] py-32 md:py-0">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-20 items-start">
          
          {/* Left Side: Scrolling Text */}
          <div className="w-full md:w-1/2">
            {acts.map((act, i) => (
              <NarrativeAct 
                key={i} 
                index={i}
                subtitle={act.subtitle}
                title={act.title}
                description={act.description}
              />
            ))}
          </div>

          {/* Right Side: Sticky Interactive Visual */}
          <div className="hidden md:block w-1/2 h-screen">
            <LivingMockup progress={scrollYProgress} />
          </div>

        </div>
      </div>
      
      {/* Background Decorative Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -z-10 hidden md:block" />
    </section>
  );
};

export default TheNarrative;