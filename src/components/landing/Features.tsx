"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Users, Globe, Camera, Layout } from 'lucide-react';

const features = [
  {
    title: "Guest Command",
    desc: "A surgical-grade registry system for managing high-society guest lists and VIP tiers.",
    icon: Users
  },
  {
    title: "Digital Spraying",
    desc: "Seamless, peer-to-peer digital gifts that trigger live celebrations on your event screen.",
    icon: Zap
  },
  {
    title: "Access Control",
    desc: "Instant QR-code generation for secure, high-end venue entry management.",
    icon: Shield
  },
  {
    title: "The Vibe Screen",
    desc: "Dynamic live displays for ballroom TVs that show check-ins and gift animations.",
    icon: Monitor
  },
  {
    title: "Broadcast Suite",
    desc: "Unified WhatsApp and SMS notifications to keep your elite circle informed.",
    icon: Globe
  },
  {
    title: "Legacy Gallery",
    desc: "A permanent, high-fidelity digital home for your event's finest memories.",
    icon: Camera
  }
];

function Monitor(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  );
}

const Features = () => {
  return (
    <section className="py-32 px-6 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-24">
          <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.5em] mb-6">Capabilities</span>
          <h2 className="text-4xl md:text-6xl font-serif italic text-center">Engineered for <br/> <span className="text-[#D4AF37]">Excellence</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 border border-border bg-card/50 hover:bg-secondary/50 transition-all duration-500 group"
            >
              <feature.icon className="w-10 h-10 text-[#D4AF37] mb-8 group-hover:scale-110 transition-transform duration-500" />
              <h3 className="text-xl font-serif italic mb-4">{feature.title}</h3>
              <p className="text-muted-foreground text-sm font-light leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;