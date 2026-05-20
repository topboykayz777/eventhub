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
    title: "1. Create",
    desc: "Create your free account to unlock your event tools.",
    icon: UserPlus
  },
  {
    title: "2. Design",
    desc: "Set your theme and photos to build your event website.",
    icon: Layout
  },
  {
    title: "3. Activate",
    desc: "Make your page live with a quick one-time activation.",
    icon: CreditCard
  },
  {
    title: "4. Invite",
    desc: "Share your unique link with guests to gather RSVPs.",
    icon: Share2
  },
  {
    title: "5. Gifts",
    desc: "Verify digital gifts and transfers directly in your ledger.",
    icon: Wallet
  },
  {
    title: "6. Dispatch",
    desc: "Send mass WhatsApp updates to your entire guest list.",
    icon: Send
  },
  {
    title: "7. Entry",
    desc: "Scan QR passes at the door for instant check-in.",
    icon: Monitor
  },
  {
    title: "8. Forever",
    desc: "Your event lives on as a digital memory wall.",
    icon: Heart
  }
];

const FAQ = () => {
  return (
    <div className="bg-background text-foreground">
      <div className="max-w-7xl mx-auto py-24 px-6">
        <div className="text-center mb-32">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block"
          >
            A Simple Guide
          </motion.span>
          <motion.h2             
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-serif italic mb-8"
          >
            How it <span className="text-[#D4AF37]">Works</span>
          </motion.h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-light tracking-wide">
            Everything you need to know, from your first click to the final celebration.
          </p>
        </div>

        <section className="mb-40">
          <div className="flex items-center gap-4 mb-16">
            <div className="h-px flex-1 bg-border" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#D4AF37]">The 8 Simple Acts</h2>
            <div className="h-px flex-1 bg-border" />
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
                  <div className="w-14 h-14 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-[#D4AF37]/20 transition-all duration-500">
                    <step.icon className="text-[#D4AF37] w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-serif italic mb-4">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-light">
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
          className="mt-40 text-center p-12 md:p-20 rounded-[4rem] bg-gradient-to-b from-secondary/50 to-transparent border border-border"
        >
          <Zap className="text-[#D4AF37] w-12 h-12 mx-auto mb-8 animate-pulse" />
          <h2 className="text-3xl md:text-4xl lg:text-7xl font-serif italic mb-6">Ready to lead?</h2>
          <p className="text-muted-foreground mb-10 uppercase tracking-widest text-[10px] font-bold">Our team is standing by</p>
          <button 
            onClick={() => window.location.href = '/create-event'}
            className="bg-[#D4AF37] text-black px-12 py-8 rounded-none text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#B8860B] transition-all duration-500"
          >
            Begin Now
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;