"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Users, Sparkles } from 'lucide-react';

const steps = [
  {
    title: "Design Your Page",
    desc: "Choose a theme, upload photos, and add your event details in minutes.",
    icon: Sparkles,
    color: "bg-purple-500",
    shadow: "shadow-purple-500/20"
  },
  {
    title: "Share on WhatsApp",
    desc: "Get a unique link and beautiful digital invite to blast to your guest list.",
    icon: Share2,
    color: "bg-[#25D366]",
    shadow: "shadow-green-500/20"
  },
  {
    title: "Track RSVPs",
    desc: "See who's coming in real-time and export your guest list for vendors.",
    icon: Users,
    color: "bg-[#e94560]",
    shadow: "shadow-red-500/20"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-[#1a1a2e] mb-6 tracking-tight"
          >
            HOW IT <span className="text-[#e94560]">WORKS</span>
          </motion.h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Three simple steps to take your event from traditional to digital.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
            >
              <div className={`w-20 h-20 ${step.color} rounded-3xl flex items-center justify-center mb-8 transform transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-2xl ${step.shadow}`}>
                <step.icon className="text-white w-10 h-10" />
              </div>
              <div className="absolute -top-4 -left-4 text-8xl font-black text-gray-50 opacity-50 pointer-events-none">
                0{index + 1}
              </div>
              <h3 className="text-2xl font-bold text-[#1a1a2e] mb-4 relative z-10">{step.title}</h3>
              <p className="text-gray-500 text-lg leading-relaxed relative z-10">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;