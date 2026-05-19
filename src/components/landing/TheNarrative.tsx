"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

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
    <div ref={ref} className="min-h-[40vh] flex flex-col justify-center py-20 border-l border-white/5 pl-12 relative">
      <div className={`absolute left-[-5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#D4AF37] transition-all duration-500 ${isInView ? 'scale-150 shadow-[0_0_15px_rgba(212,175,55,1)]' : 'scale-50 opacity-20'}`} />
      
      <motion.div
        initial={{ opacity: 0.1, x: 20 }}
        animate={{ 
          opacity: isInView ? 1 : 0.1, 
          x: isInView ? 0 : 20,
        }}
        transition={{ duration: 0.8 }}
      >
        <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.5em] mb-6 block">
          Act 0{index + 1} — {subtitle}
        </span>
        <h2 className="text-3xl md:text-5xl font-serif italic text-white mb-6 leading-tight">
          {title}
        </h2>
        <p className="text-gray-400 text-base font-light leading-relaxed tracking-wide max-w-xl">
          {description}
        </p>
      </motion.div>
    </div>
  );
};

const TheNarrative = () => {
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
    <section className="bg-[#050505] py-32">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-24 text-center">
          <h2 className="text-4xl font-serif italic text-white mb-4">The Narrative of <span className="text-[#D4AF37]">Excellence</span></h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em]">A Symphony of Features</p>
        </div>
        <div>
          {acts.map((act, i) => (
            <NarrativeAct key={i} index={i} subtitle={act.subtitle} title={act.title} description={act.description} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TheNarrative;