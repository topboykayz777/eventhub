"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Layout, 
  CreditCard, 
  Share2, 
  Wallet, 
  Send, 
  Monitor, 
  Heart 
} from 'lucide-react';

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

const HowItWorks = () => {
  return (
    <section className="py-32 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block"
          >
            The Simple Protocol
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-7xl font-serif italic text-foreground mb-8"
          >
            How it <span className="text-[#D4AF37]">Works</span>
          </motion.h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light tracking-wide">
            Eight simple acts to take your celebration from vision to digital reality.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-[#D4AF37]/20 transition-all duration-500">
                <step.icon className="text-[#D4AF37] w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif italic text-foreground mb-4">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-light px-4">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;