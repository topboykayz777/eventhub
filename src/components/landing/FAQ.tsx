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
  Monitor
} from "lucide-react";
import Navbar from "@/components/Navbar";

const steps = [
  {
    title: "1. Create Your Secret Key",
    desc: "Click 'Sign Up' to create your account. It's like getting a VIP library card that lets you into the planning world.",
    icon: UserPlus,
    color: "bg-blue-500",
  },
  {
    title: "2. Write Your Invite",
    desc: "Tell us the 'Who, Where, and When'. Give your party a name, pick a date, and type in the venue address.",
    icon: Layout,
    color: "bg-purple-500",
  },
  {
    title: "3. Dress Up Your Page",
    desc: "Choose a 'Theme' to make your page look beautiful. Upload a lovely photo of yourself or the celebrant.",
    icon: Sparkles,
    color: "bg-pink-500",
  },
  {
    title: "4. Turn on the Lights",
    desc: "Pay a small fee to make your page 'Live' on the internet. Think of this like buying a stamp for your letter.",
    icon: CreditCard,
    color: "bg-green-500",
  },
  {
    title: "5. Spread the Word",
    desc: "Use our 'WhatsApp Blast' tool to send your invite to all your friends at once so they can RSVP easily.",
    icon: Share2,
    color: "bg-orange-500",
  },
  {
    title: "6. Manage Your Vault",
    desc: "As guests 'Spray' you with digital gifts, check your bank app and then click 'Approve' to show it on the big screen!",
    icon: Wallet,
    color: "bg-yellow-500",
  },
  {
    title: "7. Guard the Door",
    desc: "On the party day, use your phone camera to scan the QR codes on guests' phones as they arrive for instant entry.",
    icon: PartyPopper,
    color: "bg-red-500",
  },
  {
    title: "8. Show Off the Vibe",
    desc: "Open the 'Vibe Screen' on a big TV or projector to celebrate every 'Digital Spray' with an explosion of gold!",
    icon: Monitor,
    color: "bg-indigo-500",
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

        {/* 8-Step Guide */}
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

        {/* Final CTA */}
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