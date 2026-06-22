"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Sparkles, Music, UserPlus, Image as ImageIcon, MousePointer, Heart } from 'lucide-react';

interface ThemeConfig {
  id: string;
  label: string;
  bg: string;
  text: string;
  accent: string;
  card: string;
  border: string;
  button: string;
  pillColors: string[];
  fontFamily: string;
}

const themes: ThemeConfig[] = [
  {
    id: 'modern',
    label: 'Midnight Noir',
    bg: 'bg-[#050505]',
    text: 'text-white',
    accent: 'text-[#D4AF37]',
    card: 'bg-white/[0.03] border-white/10',
    border: 'border-[#D4AF37]/20',
    button: 'bg-[#D4AF37] text-black hover:bg-[#B8860B]',
    pillColors: ['bg-[#050505]', 'bg-[#D4AF37]'],
    fontFamily: 'font-sans'
  },
  {
    id: 'traditional',
    label: 'Royal Heritage',
    bg: 'bg-[#064e3b]',
    text: 'text-[#fdfcf0]',
    accent: 'text-[#D4AF37]',
    card: 'bg-black/20 border-[#D4AF37]/20',
    border: 'border-[#D4AF37]/30',
    button: 'bg-[#D4AF37] text-black hover:bg-[#B8860B]',
    pillColors: ['bg-[#064e3b]', 'bg-[#D4AF37]'],
    fontFamily: 'font-serif'
  },
  {
    id: 'elegant',
    label: 'Pure Ivory',
    bg: 'bg-[#f8f8f8]',
    text: 'text-gray-900',
    accent: 'text-black',
    card: 'bg-white border-gray-200 shadow-sm',
    border: 'border-black/10',
    button: 'bg-black text-white hover:bg-black/80',
    pillColors: ['bg-[#f8f8f8]', 'bg-black'],
    fontFamily: 'font-serif'
  },
  {
    id: 'sahara',
    label: 'Sahara Gold',
    bg: 'bg-[#451a03]',
    text: 'text-[#fef3c7]',
    accent: 'text-[#fbbf24]',
    card: 'bg-black/20 border-[#fbbf24]/20',
    border: 'border-[#fbbf24]/30',
    button: 'bg-[#fbbf24] text-black hover:bg-[#d97706]',
    pillColors: ['bg-[#451a03]', 'bg-[#fbbf24]'],
    fontFamily: 'font-serif'
  },
  {
    id: 'velvet',
    label: 'Midnight Velvet',
    bg: 'bg-[#2e1065]',
    text: 'text-[#f5f3ff]',
    accent: 'text-[#D4AF37]',
    card: 'bg-black/20 border-[#D4AF37]/20',
    border: 'border-[#D4AF37]/30',
    button: 'bg-[#D4AF37] text-black hover:bg-[#B8860B]',
    pillColors: ['bg-[#2e1065]', 'bg-[#D4AF37]'],
    fontFamily: 'font-serif'
  },
  {
    id: 'garden',
    label: 'Emerald Garden',
    bg: 'bg-[#022c22]',
    text: 'text-[#ecfdf5]',
    accent: 'text-[#10b981]',
    card: 'bg-black/20 border-[#10b981]/20',
    border: 'border-[#10b981]/30',
    button: 'bg-[#10b981] text-black hover:bg-[#059669]',
    pillColors: ['bg-[#022c22]', 'bg-[#10b981]'],
    fontFamily: 'font-sans'
  },
  {
    id: 'rose',
    label: 'Sunset Rose',
    bg: 'bg-[#831843]',
    text: 'text-[#fdf2f8]',
    card: 'bg-black/20 border-[#fbcfe8]/20',
    accent: 'text-[#fbcfe8]',
    border: 'border-[#fbcfe8]/30',
    button: 'bg-[#fbcfe8] text-black hover:bg-[#f472b6]',
    pillColors: ['bg-[#831843]', 'bg-[#fbcfe8]'],
    fontFamily: 'font-serif'
  }
];

const ThemeSwapper = () => {
  const [activeTheme, setActiveTheme] = useState<ThemeConfig>(themes[0]);

  return (
    <section className="py-32 px-6 bg-background relative overflow-hidden w-full flex flex-col items-center">
      <div className="max-w-6xl w-full space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <span className="text-[#D4AF37] text-[10px] font-black tracking-[0.5em] uppercase block">The Aesthetic Engine</span>
          <h2 className="text-4xl md:text-6xl font-serif italic text-foreground">
            Bespoke <span className="text-[#D4AF37]">Atmospheres</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto font-light tracking-wide text-sm">
            One click transforms your entire event presence. Watch how the typography, colors, and layout morph to match your celebration's prestige.
          </p>
        </div>

        {/* The Floating Mockup Event Page */}
        <div className="relative w-full rounded-[3rem] border border-border bg-card shadow-2xl overflow-hidden">
          {/* Browser Header */}
          <div className="h-12 border-b border-border bg-muted/30 px-8 flex items-center gap-2 shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-500/40" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
            <div className="w-3 h-3 rounded-full bg-green-500/40" />
            <div className="mx-auto bg-background/50 border border-border/50 rounded-full px-6 py-1 text-[9px] font-mono text-muted-foreground/60 tracking-wider">
              theeventhub.com.ng/event/amina-farouq
            </div>
          </div>

          {/* Mockup Content Area */}
          <motion.div 
            animate={{ backgroundColor: activeTheme.id === 'elegant' ? '#f8f8f8' : activeTheme.id === 'traditional' ? '#064e3b' : activeTheme.id === 'sahara' ? '#451a03' : activeTheme.id === 'velvet' ? '#2e1065' : activeTheme.id === 'garden' ? '#022c22' : activeTheme.id === 'rose' ? '#831843' : '#050505' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className={`p-8 md:p-16 ${activeTheme.text} ${activeTheme.fontFamily} transition-colors duration-700 space-y-16`}
          >
            {/* Mockup Hero */}
            <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden rounded-[2rem] border border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80" 
                className="w-full h-full object-cover brightness-75"
                alt="Mockup Couple"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-center md:text-left">
                <span className="text-[#D4AF37] text-[8px] font-black uppercase tracking-[0.4em] block mb-2">• Event in Progress</span>
                <h3 className="text-3xl md:text-5xl font-serif italic text-white leading-tight">
                  The Wedding of <br /> <span className="text-[#D4AF37]">Amina & Farouq</span>
                </h3>
              </div>
            </div>

            {/* Mockup Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
              {/* Left Column: Details & Gallery */}
              <div className="lg:col-span-3 space-y-12">
                {/* Particulars Card */}
                <div className={`p-8 rounded-[2rem] border ${activeTheme.card} transition-all duration-500`}>
                  <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-8 flex items-center gap-3">
                    <Calendar className="w-3.5 h-3.5" /> The Particulars
                  </h4>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                        <Sparkles className="text-[#D4AF37] w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[7px] font-bold uppercase tracking-widest opacity-40 mb-0.5">The Celebration</p>
                        <p className="text-lg font-serif italic">Traditional Wedding & Reception</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                        <MapPin className="text-[#D4AF37] w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[7px] font-bold uppercase tracking-widest opacity-40 mb-0.5">The Venue</p>
                        <p className="text-lg font-serif italic">The Grand Ballroom, Eko Hotel, Lagos</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Memory Wall Gallery */}
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[#D4AF37] text-[8px] font-bold tracking-[0.3em] uppercase block mb-1">The Memory Wall</span>
                      <h4 className="text-xl font-serif italic">Captured <span className="text-[#D4AF37]">Moments</span></h4>
                    </div>
                    <ImageIcon className="w-5 h-5 opacity-40" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80",
                      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80",
                      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80"
                    ].map((url, i) => (
                      <div key={i} className="aspect-[4/5] overflow-hidden rounded-xl border border-white/10 bg-white/5">
                        <img src={url} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" alt="" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: RSVP Registry */}
              <div className="lg:col-span-2">
                <div className={`p-8 rounded-[2.5rem] border ${activeTheme.card} transition-all duration-500 space-y-8`}>
                  <h4 className="text-2xl font-serif italic tracking-tight">The Registry</h4>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[7px] font-bold uppercase tracking-widest opacity-40">Full Name</label>
                      <div className="h-12 bg-black/5 border border-white/5 rounded-lg flex items-center px-4 text-sm opacity-60">
                        e.g. Chidi Benson
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[7px] font-bold uppercase tracking-widest opacity-40">WhatsApp Number</label>
                      <div className="h-12 bg-black/5 border border-white/5 rounded-lg flex items-center px-4 text-sm opacity-60">
                        080...
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-black/5 rounded-xl">
                      <span className="text-[8px] font-bold uppercase tracking-widest">Bringing a Plus One?</span>
                      <div className="w-8 h-5 bg-white/10 rounded-full p-0.5 flex items-center">
                        <div className="w-4 h-4 bg-white/40 rounded-full" />
                      </div>
                    </div>
                    <button 
                      type="button"
                      className={`w-full h-14 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] shadow-lg transition-all duration-500 ${activeTheme.button}`}
                    >
                      Confirm Attendance
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Theme Selector Controls */}
        <div className="flex flex-col items-center space-y-6 relative">
          {/* Animated Cursor Indicator */}
          <motion.div 
            animate={{ 
              y: [0, -8, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute -top-16 flex flex-col items-center gap-2 pointer-events-none"
          >
            <span className="bg-[#D4AF37] text-black text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
              <MousePointer size={10} /> Click to Morph
            </span>
            <div className="w-2 h-2 bg-[#D4AF37] rotate-45 -mt-1" />
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTheme(t)}
                className={`relative px-6 py-4 rounded-full border-2 transition-all duration-500 flex items-center gap-3 group ${
                  activeTheme.id === t.id 
                    ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-[0_0_30px_rgba(212,175,55,0.2)] scale-105' 
                    : 'border-border bg-card hover:border-[#D4AF37]/30'
                }`}
              >
                {/* Color Pills */}
                <div className="flex gap-1">
                  {t.pillColors.map((color, idx) => (
                    <div key={idx} className={`w-3 h-3 rounded-full border border-white/10 ${color}`} />
                  ))}
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-foreground">
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThemeSwapper;