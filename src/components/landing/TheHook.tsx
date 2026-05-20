"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Zap, Globe, CheckCircle2, Sparkles, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const TheHook = () => {
  const navigate = useNavigate();
  const [spotsRemaining, setSpotsRemaining] = useState(50);
  const TOTAL_PIONEER_SPOTS = 50;

  useEffect(() => {
    const fetchRemaining = async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (!error && count !== null) {
        setSpotsRemaining(Math.max(0, TOTAL_PIONEER_SPOTS - count));
      }
    };

    fetchRemaining();

    const channel = supabase
      .channel('beta-spots-count-hook')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'profiles' },
        () => fetchRemaining()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section className="py-24 md:py-40 px-6 bg-background">
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
              <h2 className="text-4xl md:text-6xl font-serif italic text-foreground leading-tight">
                Traditional Planning is <span className="text-muted-foreground line-through decoration-[#D4AF37]">Broken.</span>
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
                  <div className="w-12 h-12 shrink-0 rounded-full bg-secondary border border-border flex items-center justify-center group-hover:border-[#D4AF37]/50 transition-colors">
                    <item.icon className="text-[#D4AF37] w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif italic text-foreground mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm font-light leading-relaxed">{item.desc}</p>
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
            <div className="absolute inset-0 bg-[#D4AF37]/10 blur-[100px] rounded-full" />
            
            <div className="relative bg-card border border-border p-10 md:p-16 rounded-[4rem] shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                 <div className="bg-[#D4AF37] text-black text-[7px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rotate-45 translate-x-12 -translate-y-4 shadow-xl">
                    Elite Pioneer
                 </div>
              </div>

              <div className="text-center mb-12">
                <div className="w-20 h-20 border-2 border-[#D4AF37] flex items-center justify-center rotate-45 mx-auto mb-10 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                  <span className="text-[#D4AF37] font-serif text-3xl -rotate-45">E</span>
                </div>
                
                <h3 className="text-3xl font-serif italic text-foreground mb-4">The Founding Circle</h3>
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.4em]">Become a Founding Member</p>
              </div>

              <div className="space-y-6 mb-12">
                {[
                  "Complimentary Pro Tier Activation (Value ₦150k)",
                  "Verified 'Founding Member' Profile Badge",
                  "Direct Access to the Feature Concierge",
                  "Priority Real-time Payout Verification",
                  "Early Access to the Vendor Atelier"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Star className="text-[#D4AF37] w-4 h-4 shrink-0 fill-current" />
                    <span className="text-sm font-light text-foreground/80">{text}</span>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-border text-center">
                <div className="mb-8 flex flex-col items-center gap-2">
                   <div className="flex items-center gap-2 text-[#D4AF37] animate-pulse">
                      <Sparkles size={12} />
                      <span className="text-[10px] font-black uppercase tracking-[0.5em]">Pioneer Invitations Remaining</span>
                   </div>
                   <div className="text-5xl font-serif italic text-foreground">
                      {spotsRemaining} / {TOTAL_PIONEER_SPOTS}
                   </div>
                   <p className="text-muted-foreground text-[8px] font-bold uppercase tracking-widest mt-2 max-w-[250px] mx-auto">
                      Founding Status is reserved for the first 50 hosts to register.
                   </p>
                </div>

                <button 
                  onClick={() => navigate('/create-event')}
                  className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black py-8 rounded-none text-[10px] font-black tracking-[0.4em] uppercase transition-all duration-500 shadow-2xl relative group overflow-hidden"
                >
                  <span className="relative z-10">Claim My Founding Membership</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
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