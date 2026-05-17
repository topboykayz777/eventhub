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
} from "lucide-react";
import Navbar from "@/components/Navbar";

const steps = [
  {
    title: "Join the Club",
    desc: "Click 'Sign Up' to create your own secret key (account). It's like getting a library card for parties!",
    icon: UserPlus,
    color: "bg-blue-500",
  },
  {
    title: "Make Your Party Page",
    desc: "Tell us the name of your party, where it is, and when it starts. It's like writing a digital invitation!",
    icon: Layout,
    color: "bg-purple-500",
  },
  {
    title: "Pick a Pretty Dress",
    desc: "Choose a 'Theme' to make your page look beautiful. You can pick colors that match your party decorations!",
    icon: Sparkles,
    color: "bg-pink-500",
  },
  {
    title: "Unlock the Magic",
    desc: "Pay a small fee to make your page go live on the internet. This is like buying a stamp for your letter!",
    icon: CreditCard,
    color: "bg-green-500",
  },
  {
    title: "Tell Everyone!",
    desc: "Send your special link to your friends on WhatsApp. They can click it to say 'Yes, I'm coming!'",
    icon: Share2,
    color: "bg-orange-500",
  },
  {
    title: "Count the Guests",
    desc: "Check your Dashboard to see a list of everyone who is coming. It's like counting how many cupcakes you need!",
    icon: Users,
    color: "bg-yellow-500",
  },
  {
    title: "Party Time!",
    desc: "On the big day, use your phone to scan guests' QR codes at the door. It's like being a real VIP guard!",
    icon: PartyPopper,
    color: "bg-red-500",
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-24 md:py-40 px-6">
        <div className="text-center mb-32">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block"
          >
            The Knowledge Base
          </motion.span>
          <motion.h1             initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif italic mb-8"
          >
            How to <span className="text-[#D4AF37]">Orchestrate</span>
          </motion.h1>
          <p className="text-gray-500 max-w-2xl mx-auto font-light tracking-wide">
            Everything you need to know about using EventHub, from your first click to the final toast.
          </p>
        </div>

        {/* 7-Step Guide */}
        <section className="mb-40">
          <div className="flex items-center gap-4 mb-16">
            <div className="h-px flex-1 bg-white/5" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#D4AF37]">The 7-Step Journey</h2>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
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
          className="mt-40 text-center p-20 rounded-[4rem] bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5"
        >
          <Zap className="text-[#D4AF37] w-12 h-12 mx-auto mb-8 animate-pulse" />
          <h2 className="text-3xl md:text-4xl lg:text-8xl font-serif italic mb-6">Still have questions?</h2>
          <p className="text-gray-500 mb-10 uppercase tracking-widest text-[10px] font-bold">Our concierge is standing by</p>
          <button 
            onClick={() => window.location.href = '/support'}
            className="bg-[#D4AF37] text-black px-12 py-8 rounded-none text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#B8860B] transition-all duration-500"
          >
            Contact Support
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;