"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

// Mockup Imports
import event1 from '@/assets/mockups/event-1.png';
import event2 from '@/assets/mockups/event-2.png';
import dashboard2 from '@/assets/mockups/dashboard-2.png';
import vibe2 from '@/assets/mockups/vibe-2.png';
import vibe3 from '@/assets/mockups/vibe-3.png';
import pass1 from '@/assets/mockups/qr-pass-1.png';
import pass2 from '@/assets/mockups/qr-pass-2.png';

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
    <div ref={ref} className="min-h-[80vh] flex flex-col justify-center py-20">
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
        <h2 className="text-4xl md:text-6xl font-serif italic text-white mb-8 leading-tight">
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
  // Act transitions
  const opacity1 = useTransform(progress, [0, 0.12, 0.2, 0.25], [1, 1, 0, 0]);
  const opacity1b = useTransform(progress, [0.12, 0.2, 0.25], [0, 1, 0]); // event2 transition
  
  const opacity2 = useTransform(progress, [0.25, 0.3, 0.5, 0.55], [0, 1, 1, 0]);
  
  const opacity3 = useTransform(progress, [0.55, 0.62, 0.7, 0.75, 0.8, 0.85], [0, 1, 1, 0.5, 0, 0]);
  const opacity3b = useTransform(progress, [0.75, 0.8, 0.85], [0, 1, 0]); // vibe3 transition
  
  const opacity4 = useTransform(progress, [0.85, 0.9, 0.95, 1], [0, 1, 1, 0]);
  const opacity4b = useTransform(progress, [0.95, 1], [0, 1]); // pass2 transition

  const scale = useTransform(progress, [0, 0.5, 1], [1, 1.05, 1]);

  return (
    <div className="sticky top-1/4 w-full aspect-[4/3] md:aspect-video max-w-4xl mx-auto">
      <div className="absolute inset-0 bg-[#D4AF37]/10 rounded-full blur-[150px] -z-10" />

      <motion.div 
        style={{ scale }}
        className="w-full h-full relative rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] bg-black"
      >
        {/* ACT 1: DESIGN */}
        <motion.img src={event1} style={{ opacity: opacity1 }} className="absolute inset-0 w-full h-full object-cover" alt="Architecture 1" />
        <motion.img src={event2} style={{ opacity: opacity1b }} className="absolute inset-0 w-full h-full object-cover" alt="Architecture 2" />

        {/* ACT 2: DISPATCH */}
        <motion.img src={dashboard2} style={{ opacity: opacity2 }} className="absolute inset-0 w-full h-full object-cover" alt="Dispatch Center" />

        {/* ACT 3: VIBE */}
        <motion.img src={vibe2} style={{ opacity: opacity3 }} className="absolute inset-0 w-full h-full object-cover" alt="Vibe Experience 1" />
        <motion.img src={vibe3} style={{ opacity: opacity3b }} className="absolute inset-0 w-full h-full object-cover" alt="Vibe Experience 2" />

        {/* ACT 4: RED CARPET */}
        <motion.img src={pass1} style={{ opacity: opacity4 }} className="absolute inset-0 w-full h-full object-cover" alt="Red Carpet 1" />
        <motion.img src={pass2} style={{ opacity: opacity4b }} className="absolute inset-0 w-full h-full object-cover" alt="Red Carpet 2" />
        
        <div className="absolute inset-0 pointer-events-none border-4 border-white/5 rounded-[2rem] md:rounded-[3rem]" />
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
          <div className="w-full md:w-1/2">
            {acts.map((act, i) => (
              <NarrativeAct key={i} index={i} subtitle={act.subtitle} title={act.title} description={act.description} />
            ))}
          </div>
          <div className="hidden md:block w-full md:w-1/2 h-screen">
            <LivingMockup progress={scrollYProgress} />
          </div>
        </div>
      </div>
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -z-10 hidden md:block" />
    </section>
  );
};

export default TheNarrative;