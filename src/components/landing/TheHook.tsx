"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Zap, Globe, Sparkles, CheckCircle2 } from 'lucide-react';

const TheHook = () => {
  return (
    <section className="py-24 md:py-40 px-6 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div>
              <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.5em] mb-6 block">The Problem</span>
              <h2 className="text-4xl md:text-6xl font-serif italic text-white leading-tight">
                Traditional Planning is <span className="text-gray-600 line-through decoration-[#D4AF37]">Broken.</span>
              </h2>
            </div>

            <div className="space-y-8">
              {[
                { 
                  title: "Messy Guest Lists", 
                  desc: "Stop scrolling through endless WhatsApp chats to find out who is actually coming.",
                  icon: ShieldAlert 
                },
                { 
                  title: "Unverified Transfers", 
                  desc: "Stop chasing bank alerts during your own party. Our Ledger verifies every 'Spray' for you.",
                  icon: Zap 
                },
                { 
                  title: "Basic Appearance", 
                  desc: "Paper invites get lost. Generic links look cheap. Your event deserves a digital monument.",
                  icon: Globe 
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#D4AF37]/50 transition-colors">
                    <item.icon className="text-[#D4AF37] w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif italic text-white mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm font-light leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Decorative Glow */}
            <div className="absolute inset-0 bg-[#D4AF37]/10 blur-[100px] rounded-full" />
            
            <div className="relative glass-premium p-10 md:p-16 rounded-[4rem] border-white/10 shadow-2xl">
              <div className="text-center mb-12">
                <Sparkles className="text-[#D4AF37] w-10 h-10 mx-auto mb-6" />
                <h3 className="text-3xl font-serif italic text-white mb-4">The Solution</h3>
                <p className="text-gray-400 text-sm uppercase tracking-widest font-bold">The EventHub Atelier</p>
              </div>

              <div className="space-y-6 mb-12">
                {[
                  "Professional Digital Invitations",
                  "One-Touch WhatsApp Mass Broadcast",
                  "Cinematic Live Vibe Screen",
                  "0% Commission Digital Spraying",
                  "Secure QR Access Control"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <CheckCircle2 className="text-[#D4AF37] w-4 h-4 shrink-0" />
                    <span className="text-sm font-light text-gray-200">{text}</span>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-white/5 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-6 animate-pulse">
                  Standard Value: ₦150,000 — Currently FREE
                </p>
                <button 
                  onClick={() => window.location.href = '/signup'}
                  className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black py-8 rounded-none text-[10px] font-black tracking-[0.4em] uppercase transition-all duration-500 shadow-2xl"
                >
                  Claim My Masterpiece Key
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default TheHook;