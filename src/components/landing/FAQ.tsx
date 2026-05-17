"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  UserPlus,
  Layout,
  CreditCard,
  Share2,
  Users,
  PartyPopper,
  Zap,
  Wallet,
  Monitor,
  Heart,
  Send
} from "lucide-react";

const steps = [
  {
    title: "1. The Registry",
    desc: "Create your account to unlock the entire EventHub suite.",
    icon: UserPlus
  },
  {
    title: "2. The Architecture",
    desc: "Design your event page with your theme and portrait in one go.",
    icon: Layout
  },
  {
    title: "3. The Ignition",
    desc: "Pay a small fee to make your page live on the internet.",
    icon: CreditCard
  },
  {
    title: "4. The First Dispatch",
    desc: "Share your link manually with friends to start gathering RSVPs.",
    icon: Share2
  },
  {
    title: "5. The Digital Vault",
    desc: "Manage digital sprays and gifts through your secure Ledger.",
    icon: Wallet
  },
  {
    title: "6. The Mass Broadcast",
    desc: "Use the WhatsApp Blast tool to send reminders to your guest list.",
    icon: Send
  },
  {
    title: "7. The Red Carpet",
    desc: "Scan QR codes and open the Vibe Screen to celebrate live.",
    icon: Monitor
  },
  {
    title: "8. The Eternal Shrine",
    desc: "Your event page lives on forever as a digital monument.",
    icon: Heart
  }
];

const FAQ = () => {
  return (
    <div className="bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto py-24 px-6">
        <div className="text-center mb-32">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block"
          >
            The Knowledge Base
          </motion.span>
          <motion.h2             
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-serif italic mb-8"
          >
            How to <span className="text-[#D4AF37]">Orchestrate</span>
          </motion.h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-light tracking-wide">
            Everything you need to know about using EventHub, from your first click to the final toast.
          </p>
        </div>

        <section className="mb-40">
          <div className="flex items-center gap-4 mb-16">
            <div className="h-px flex-1 bg-white/5" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#D4AF37]">The 8-Step Journey</h2>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-16">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-[#D4AF37]/20 transition-all duration-500">
                    <step.icon className="text-[#D4AF37] w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-serif italic mb-4">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed font-light">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-40 text-center p-12 md:p-20 rounded-[4rem] bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5"
        >
          <Zap className="text-[#D4AF37] w-12 h-12 mx-auto mb-8 animate-pulse" />
          <h2 className="text-3xl md:text-4xl lg:text-7xl font-serif italic mb-6">Ready to lead?</h2>
          <p className="text-gray-500 mb-10 uppercase tracking-widest text-[10px] font-bold">Our concierge is standing by</p>
          <button 
            onClick={() => window.location.href = '/create-event'}
            className="bg-[#D4AF37] text-black px-12 py-8 rounded-none text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#B8860B] transition-all duration-500"
          >
            Begin Orchestration
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;