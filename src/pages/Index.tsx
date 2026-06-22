"use client";

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/landing/Hero';
import TheHook from '@/components/landing/TheHook';
import TheNarrative from '@/components/landing/TheNarrative';
import ProofSlash from '@/components/landing/ProofSlash';
import ThemeSwapper from '@/components/landing/ThemeSwapper';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Twitter, Instagram, Linkedin, MapPin, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const Index = () => {
  useEffect(() => {
    // SEO Update
    document.title = "The Event Hub — Nigeria's Premier Event Orchestration Suite";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "The Event Hub is Nigeria's most sophisticated event management platform. QR check-ins, Digital Spraying with zero commission, 20+ luxury RSVP themes, Guest Registry and live Vibe Screen for weddings, owambes and galas in Lagos and Abuja.");
    }

    const end = Date.now() + 2 * 1000;
    const colors = ['#D4AF37', '#ffffff', '#F9E4B7'];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: colors
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, []);

  const seoTerms = ['Weddings', 'Galas', 'Product Launches', 'Charity Balls', 'Concerts', 'Anniversaries', 'Funerals', 'Beach Parties', 'Corporate Retreats', 'Lagos VI', 'Abuja Maitama', 'Lekki Phase 1', 'Banana Island', 'Eko Hotel', 'Transcorp Hilton'];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 selection:bg-[#D4AF37] selection:text-black overflow-x-hidden w-full flex flex-col items-center">
      <Navbar />
      
      <main className="w-full flex flex-col items-center">
        {/* HERO SECTION */}
        <Hero />
        
        {/* STATS STRIP */}
        <section className="w-full py-16 md:py-32 border-y border-border bg-secondary/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24">
              {[
                { label: 'Events Orchestrated', value: '12k+' },
                { label: 'Guests Managed', value: '500k+' },
                { label: 'Moments Captured', value: '1M+' },
                { label: 'Success Rate', value: '100%' }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-6xl font-serif italic text-[#D4AF37] mb-3">{stat.value}</div>
                  <div className="text-[9px] md:text-[11px] text-muted-foreground uppercase tracking-[0.4em] font-bold">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* THE BESPOKE THEME SWAPPER - Placed directly below Stats Strip */}
        <div className="w-full bg-background">
           <ThemeSwapper />
        </div>

        {/* THE HOOK (The Problem) */}
        <div className="w-full bg-background">
           <TheHook />
        </div>

        {/* THE IMMERSIVE NARRATIVE (The Narrative of Excellence) */}
        <div className="w-full bg-background">
           <TheNarrative />
        </div>

        {/* PROOF SLASH (Cinematic Mockups) */}
        <div className="w-full">
           <ProofSlash />
        </div>

        {/* FINAL CALL TO ACTION */}
        <section className="w-full py-40 md:py-72 px-6 relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80" 
              alt="Luxury Grand Ballroom" 
              className="w-full h-full object-cover grayscale-[30%] brightness-[0.2]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
          </div>

          <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center w-full">
            <motion.h2 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-5xl md:text-8xl lg:text-9xl font-serif italic text-white mb-8 md:mb-16 leading-tight text-center w-full"
            >
              Master Your <br /> <span className="text-[#D4AF37]">Craft</span>
            </motion.h2>
            <p className="text-sm md:text-xl text-white/60 mb-12 md:mb-24 font-light tracking-[0.3em] md:tracking-[0.5em] uppercase max-w-2xl text-center">
              The definitive tool for the modern event professional.
            </p>
            <div className="flex justify-center w-full">
              <Link to="/create-event">
                <Button className="bg-[#D4AF37] text-black px-12 md:px-24 py-8 md:py-12 rounded-none text-[11px] md:text-xs font-black tracking-[0.5em] uppercase hover:bg-[#B8860B] transition-all duration-500 shadow-2xl shadow-[#D4AF37]/20">
                  Begin Your Celebration
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* SEMANTIC KNOWLEDGE HUB: For AI Engines & Crawlers */}
      <section className="w-full py-20 bg-secondary/20 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#D4AF37]">
              <MapPin size={16} />
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Premier Regions</h4>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Serving the elite of <strong>Lagos Island, Victoria Island, Ikoyi, Lekki Phase 1, and Banana Island</strong>. Orchestrating grand galas at <strong>Eko Hotel, Transcorp Hilton Abuja</strong>, and private estates across Nigeria.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#D4AF37]">
              <Sparkles size={16} />
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Service Expertise</h4>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Specializing in <strong>Traditional Weddings, Owambe management, Luxury Galas, Charity Balls, and Corporate Product Launches</strong>. Experts in <strong>Digital Spraying technology</strong> and high-fidelity QR access control.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#D4AF37]">
              <Sparkles size={16} />
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Industry Standards</h4>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Setting the benchmark for <strong>Nigerian event technology</strong>. Our platform ensures data security and 0-commission peer-to-peer gifting for the modern host.
            </p>
          </div>
        </div>
      </section>

      <footer className="w-full bg-background text-foreground py-20 md:py-40 px-6 border-t border-border flex flex-col items-center">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-24 w-full mb-20 md:mb-32">
          <div className="md:col-span-2 text-center md:text-left">
            <div className="text-2xl md:text-3xl font-light tracking-[0.5em] uppercase mb-8">
              Event Hub <span className="text-[#D4AF37]">NG</span>
            </div>
            <p className="text-muted-foreground max-w-md text-base leading-relaxed font-light tracking-wide mx-auto md:mx-0">
              The definitive orchestration suite for luxury event management in Nigeria. Curating excellence since 2026.
            </p>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.5em] text-[#D4AF37] mb-10">Navigation</h4>
            <ul className="space-y-6 text-muted-foreground text-[11px] font-bold uppercase tracking-[0.4em]">
              <li><Link to="/create-event" className="hover:text-foreground transition-colors">Create</Link></li>
              <li><Link to="/vendors" className="hover:text-foreground transition-colors">Directory</Link></li>
              <li><Link to="/guide" className="hover:text-foreground transition-colors">Guide</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy & Terms</Link></li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.5em] text-[#D4AF37] mb-10">Social</h4>
            <ul className="space-y-6">
              <li>
                <a href="https://twitter.com/theeventhubng" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-[#D4AF37] transition-colors justify-center md:justify-start">
                  <Twitter size={18} className="text-[#D4AF37]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.4em]">Twitter</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-3 text-muted-foreground hover:text-[#D4AF37] transition-colors justify-center md:justify-start">
                  <Instagram size={18} className="text-[#D4AF37]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.4em]">Instagram</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-3 text-muted-foreground hover:text-[#D4AF37] transition-colors justify-center md:justify-start">
                  <Linkedin size={18} className="text-[#D4AF37]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.4em]">LinkedIn</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto mb-16 px-6 opacity-40 hover:opacity-100 transition-opacity duration-700">
           <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              {seoTerms.map((term) => (
                <span key={term} className="text-[8px] md:text-[10px] font-light tracking-[0.3em] uppercase text-foreground/60 cursor-default">{term}</span>
              ))}
           </div>
        </div>

        <div className="max-w-7xl mx-auto pt-12 border-t border-border text-center text-muted-foreground text-[10px] font-bold uppercase tracking-[0.5em] w-full">
          © 2026 Event Hub Nigeria. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;