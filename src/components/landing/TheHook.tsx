"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Zap, Globe } from 'lucide-react';

const TheHook = () => {
  return (
    <section className="py-24 md:py-40 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-16"
        >
          <div className="text-center">
            <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.5em] mb-6 block">The Problem</span>
            <h2 className="text-4xl md:text-7xl font-serif italic text-foreground leading-tight">
              Traditional Planning is <span className="text-muted-foreground line-through decoration-[#D4AF37]">Broken.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                title: "Messy Guest Lists", 
                desc: "Stop scrolling through endless WhatsApp chats to find out who is actually coming.",
                icon: ShieldAlert 
              },
              { 
                title: "Unverified Transfers", 
                desc: "Stop chasing bank alerts during your own party. Manual verification is a logistical nightmare.",
                icon: Zap 
              },
              { 
                title: "Basic Appearance", 
                desc: "Paper invites get lost. Generic links look cheap. Your event deserves a digital monument.",
                icon: Globe 
              }
            ].map((item, i) => (
              <div key={i} className="space-y-6 text-center group">
                <div className="w-16 h-16 shrink-0 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto group-hover:border-[#D4AF37]/50 transition-colors">
                  <item.icon className="text-[#D4AF37] w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-serif italic text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm font-light leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TheHook;