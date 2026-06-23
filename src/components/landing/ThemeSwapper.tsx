"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Sparkles, ImageIcon, MousePointer, QrCode, X, ChevronLeft, ChevronRight, Palette } from 'lucide-react';
import { useTheme } from 'next-themes';
import { supabase } from '@/integrations/supabase/client';
import { QRCodeCanvas } from 'qrcode.react';

interface ThemeConfig {
  id: string;
  label: string;
  bg: string;
  text: string;
  accent: string;
  card: string;
  border: string;
  button: string;
  glass: string;
  pillColors?: string[];
  fontFamily?: string;
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
    glass: 'rgba(255, 255, 255, 0.03)',
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
    border: 'border-[#D4AF37]/20',
    button: 'bg-[#064e3b] text-white',
    glass: 'rgba(0, 0, 0, 0.2)',
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
    button: 'bg-white text-black hover:bg-gray-100',
    glass: 'rgba(255, 255, 255, 0.7)',
    pillColors: ['bg-[#f8f8f8]', 'bg-black'],
    fontFamily: 'font-sans'
  },
  {
    id: 'sahara',
    label: 'Sahara Gold',
    bg: "bg-[#451a03]",
    text: "text-[#fef3c7]",
    accent: "text-[#fbbf24]",
    card: "bg-black/20 border-[#fbbf24]/10",
    border: "border-[#fbbf24]/20",
    button: "bg-[#fbbf24] text-black",
    glass: 'rgba(0, 0, 0, 0.2)',
    pillColors: ['bg-[#451a03]', 'bg-[#fbbf24]'],
    fontFamily: 'font-serif'
  },
  {
    id: 'velvet',
    label: 'Midnight Velvet',
    bg: "bg-[#2e1065]",
    text: "text-[#f5f3ff]",
    accent: "text-[#D4AF37]",
    card: "bg-black/20 border-[#D4AF37]/10",
    border: "border-[#D4AF37]/20",
    button: "bg-[#D4AF37] text-black",
    glass: 'rgba(0, 0, 0, 0.2)',
    pillColors: ['bg-[#2e1065]', 'bg-[#D4AF37]'],
    fontFamily: 'font-serif'
  },
  {
    id: 'garden',
    label: 'Emerald Garden',
    bg: "bg-[#022c22]",
    text: "text-[#ecfdf5]",
    accent: "text-[#10b981]",
    card: "bg-black/20 border-[#10b981]/10",
    border: "border-[#10b981]/20",
    button: "bg-[#10b981] text-black",
    glass: 'rgba(0, 0, 0, 0.2)',
    pillColors: ['bg-[#022c22]', 'bg-[#10b981]'],
    fontFamily: 'font-sans'
  },
  {
    id: 'rose',
    label: 'Sunset Rose',
    bg: "bg-[#831843]",
    text: "text-[#fdf2f8]",
    accent: "text-[#fbcfe8]",
    card: "bg-black/20 border-[#fbcfe8]/20",
    border: "border-[#fbcfe8]/30",
    button: "bg-[#fbcfe8] text-black hover:bg-[#f472b6]",
    glass: 'rgba(0, 0, 0, 0.2)',
    pillColors: ['bg-[#831843]', 'bg-[#fbcfe8]'],
    fontFamily: 'font-sans'
  }
];

const fallbackGallery = [
  "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1583939003579-715cb0215aed?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80"
];

const ThemeSwapper = () => {
  const [activeTheme, setActiveTheme] = useState('modern');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { resolvedTheme } = useTheme();
  
  // Dynamic event state with beautiful fallbacks
  const [eventData, setEventData] = useState({
    eventName: '',
    venue: '',
    venue_map_url: '',
    message: '',
    theme: 'modern',
    photo_url: '',
    gallery_urls: [] as string[]
  });

  useEffect(() => {
    const fetchEventData = async () => {
      const { data: eventData } = await supabase.from('events').select('*').ilike('event_name', '%Johnson Family Thanksgiving%').maybeSingle();
      if (eventData) {
        setEventData({
          eventName: eventData.event_name,
          venue: eventData.venue,
          venue_map_url: eventData.venue_map_url || '',
          message: eventData.message || '',
          theme: eventData.theme || 'modern',
          photo_url: eventData.photo_url || '',
          gallery_urls: eventData.gallery_urls || []
        });
      }
    };
    fetchEventData();
  }, []);

  const isVideo = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.quicktime'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  const style = themes.find(t => t.id === activeTheme) || themes[0];
  const isDark = !['elegant', 'vintage', 'lavender', 'champagne', 'marble', 'platinum'].includes(activeTheme);

  return (
    <section className="relative py-40 md:py-48 bg-background overflow-hidden border-t border-border">
      <div className="max-w-7xl mx-auto px-6 relative">
        
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#D4AF3708_0%,transparent_70%)] pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">The Aesthetic Engine</span>
          <h2 className="text-4xl md:text-6xl font-serif italic text-foreground">Bespoke <span className="text-[#D4AF37]">Atmospheres</span></h2>
        </div>

        {/* High-Impact "Tap to Change Style" Callout */}
        <div className="flex justify-center mb-12">
          <motion.button
            onClick={() => {
              const currentIndex = themes.findIndex(t => t.id === activeTheme);
              const nextIndex = (currentIndex + 1) % themes.length;
              setActiveTheme(themes[nextIndex].id);
            }}
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 0px rgba(212,175,55,0)",
                "0 0 30px rgba(212,175,55,0.4)",
                "0 0 0px rgba(212,175,55,0)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="bg-[#D4AF37] text-black px-8 py-4 rounded-full text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 shadow-2xl hover:bg-[#B8860B] transition-all duration-300 z-30"
          >
            <Palette size={16} className="animate-spin" style={{ animationDuration: '4s' }} />
            <span>Tap to Change Style</span>
            <MousePointer size={14} className="animate-bounce" />
          </motion.button>
        </div>

        {/* Interactive Preview Card */}
        <div className="max-w-md mx-auto">
          <div className={`w-full ${style.bg} rounded-[2.5rem] p-4 relative overflow-hidden shadow-2xl border border-white/5 transition-all duration-700`}>
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
              <img src={eventData.photo_url || fallbackGallery[0]} className="w-full h-full object-cover opacity-30 blur-[4px]" alt="" />
              <div className={`absolute inset-0 ${isDark ? 'bg-black/40' : 'bg-white/20'}`} />
            </div>

            {/* Glass Container */}
            <div 
              className="relative z-10 w-full h-full flex flex-col items-center p-8 rounded-[2.2rem] border backdrop-blur-2xl transition-all duration-700"
              style={{ 
                backgroundColor: style.glass,
                borderColor: style.border
              }}
            >
              {/* Header */}
              <div className="w-full flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase tracking-[0.5em] opacity-70" style={{ color: style.accent }}>Entry Pass</p>
                  <h3 className={`text-lg font-serif italic leading-tight ${style.text}`}>{eventData.eventName || "The Johnson Family Thanksgiving"}</h3>
                </div>
                <Palette style={{ color: style.accent }} className="opacity-50" size={20} />
              </div>

              {/* Guest Identity */}
              <div className="w-full space-y-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 border flex items-center justify-center" style={{ borderColor: style.border }}>
                    <MousePointer style={{ color: style.accent }} size={20} />
                  </div>
                  <div>
                    <p className={`text-[7px] font-bold uppercase tracking-[0.4em] opacity-40 ${style.text}`}>Verified Guest</p>
                    <p className={`text-xl font-medium tracking-tight ${style.text}`}>Honored Guest</p>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-white p-3 rounded-2xl mb-8 shadow-xl">
                <QRCodeCanvas 
                  id="preview-qr-canvas"
                  value="https://theeventhub.com.ng" 
                  size={128} 
                  level="H" 
                  includeMargin={false}
                />
              </div>

              {/* Footer */}
              <div className="w-full grid grid-cols-2 gap-6 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <div className="space-y-1">
                  <p className={`text-[6px] font-bold uppercase tracking-[0.4em] opacity-30 ${style.text}`}>Date</p>
                  <p className={`text-[10px] font-bold ${style.text}`}>June 21, 2026</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className={`text-[6px] font-bold uppercase tracking-[0.4em] opacity-30 ${style.text}`}>Venue</p>
                  <p className={`text-[10px] font-bold truncate ${style.text}`}>{eventData.venue || "The Grand Ballroom"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Selector Grid */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTheme(t.id)}
              className={`p-4 rounded-2xl border text-center transition-all ${
                activeTheme === t.id 
                  ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]' 
                  : 'border-border bg-card text-muted-foreground hover:border-border/80'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider block truncate">{t.label}</span>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ThemeSwapper;