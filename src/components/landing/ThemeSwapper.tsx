"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Palette, 
  Image as ImageIcon, 
  X, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { format } from 'date-fns';

interface ThemeSwapperProps {}

const themes = [
  { id: 'modern', label: 'Midnight Noir', color: 'from-gray-900 to-black', icon: Sparkles },
  { id: 'traditional', label: 'Royal Heritage', color: 'from-emerald-900 to-green-950', icon: Sparkles },
  { id: 'elegant', label: 'Pure Ivory', color: 'from-slate-50 to-slate-200', icon: Sparkles, light: true },
  { id: 'sahara', label: 'Sahara Gold', color: 'from-amber-600 to-orange-900', icon: Sparkles },
  { id: 'velvet', label: 'Midnight Velvet', color: 'from-purple-900 to-indigo-950', icon: Sparkles },
  { id: 'garden', label: 'Emerald Garden', color: 'from-teal-800 to-emerald-950', icon: Sparkles },
  { id: 'oceanic', label: 'Oceanic Silk', color: 'from-blue-800 to-blue-950', icon: Sparkles },
  { id: 'rose', label: 'Sunset Rose', color: 'from-rose-700 to-rose-950', icon: Sparkles },
  { id: 'earth', label: 'Ancestral Earth', color: 'from-orange-900 to-stone-950', icon: Sparkles },
  { id: 'silver', label: 'Celestial Silver', color: 'from-slate-400 to-slate-600', icon: Sparkles },
  { id: 'dynasty', label: 'Crimson Dynasty', color: 'from-red-800 to-red-950', icon: Sparkles },
  { id: 'vintage', label: 'Vintage Parchment', color: 'from-amber-50 to-orange-100', icon: Sparkles, light: true },
  { id: 'neon', label: 'Electric Pulse', color: 'from-cyan-400 to-blue-600', icon: Sparkles },
  { id: 'royal', label: 'Royal Amethyst', color: 'from-purple-700 to-fuchsia-950', icon: Sparkles },
  { id: 'blossom', label: 'Sakura Spring', color: 'from-pink-50 to-rose-100', icon: Sparkles, light: true },
  { id: 'tropic', label: 'Tropical Jungle', color: 'from-green-600 to-teal-900', icon: Sparkles },
  { id: 'desert', label: 'Oasis Blue', color: 'from-sky-400 to-indigo-800', icon: Sparkles },
  { id: 'glitch', label: 'Glitch Noir', color: 'from-red-600 to-black', icon: Sparkles },
  { id: 'minimal', label: 'Bauhaus Minimal', color: 'from-blue-600 to-slate-900', icon: Sparkles },
  { id: 'noir', label: 'Noir Cinema', color: 'from-gray-100 to-gray-400', icon: Sparkles, light: true }
];

const ThemeSwapper = () => {
  const [activeTheme, setActiveTheme] = useState('modern');
  const [qrImage, setQrImage] = useState<string>("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const event = {
    event_name: "The Adeleke Gala & Celebration",
    event_date: "2026-12-18T18:00:00.000Z",
    venue: "The Grand Ballroom, Eko Hotel",
    photo_url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80",
    theme: activeTheme,
    slug: "adeleke-gala",
    gallery_urls: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80"
    ]
  };

  const eventUrl = `https://theeventhub.com.ng/event/${event.slug}`;
  const eventDate = new Date(event.event_date);

  useEffect(() => {
    const timer = setTimeout(() => {
      const canvas = document.getElementById('swapper-qr-canvas') as HTMLCanvasElement;
      if (canvas) {
        setQrImage(canvas.toDataURL("image/png"));
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [activeTheme]);

  const themeStyles: Record<string, any> = {
    modern: { bg: "bg-[#050505]", accent: "#D4AF37", glass: "rgba(255, 255, 255, 0.03)", border: "rgba(212, 175, 55, 0.2)", text: "text-white" },
    traditional: { bg: "bg-[#064e3b]", accent: "#D4AF37", glass: "rgba(0, 0, 0, 0.2)", border: "rgba(212, 175, 55, 0.3)", text: "text-[#fdfcf0]" },
    elegant: { bg: "bg-[#f8f8f8]", accent: "#000000", glass: "rgba(255, 255, 255, 0.7)", border: "rgba(0, 0, 0, 0.1)", text: "text-gray-900" },
    sahara: { bg: "bg-[#451a03]", accent: "#fbbf24", glass: "rgba(0, 0, 0, 0.2)", border: "rgba(251, 191, 36, 0.2)", text: "text-[#fef3c7]" },
    velvet: { bg: "bg-[#2e1065]", accent: "#D4AF37", glass: "rgba(0, 0, 0, 0.2)", border: "rgba(212, 175, 55, 0.2)", text: "text-[#f5f3ff]" },
    garden: { bg: "bg-[#064e3b]", accent: "#10b981", glass: "rgba(0, 0, 0, 0.2)", border: "rgba(16, 185, 129, 0.2)", text: "text-[#ecfdf5]" },
    oceanic: { bg: "bg-[#1e3a8a]", accent: "#93c5fd", glass: "rgba(0, 0, 0, 0.2)", border: "rgba(147, 197, 253, 0.2)", text: "text-[#eff6ff]" },
    rose: { bg: "bg-[#831843]", accent: "#fbcfe8", glass: "rgba(0, 0, 0, 0.2)", border: "rgba(251, 207, 232, 0.2)", text: "text-[#fdf2f8]" },
    earth: { bg: "bg-[#431407]", accent: "#fb923c", glass: "rgba(0, 0, 0, 0.2)", border: "rgba(251, 146, 60, 0.2)", text: "text-[#fff7ed]" },
    silver: { bg: "bg-[#1f2937]", accent: "#9ca3af", glass: "rgba(0, 0, 0, 0.2)", border: "rgba(156, 163, 175, 0.2)", text: "text-[#f9fafb]" },
    dynasty: { bg: "bg-[#7f1d1d]", accent: "#D4AF37", glass: "rgba(0, 0, 0, 0.2)", border: "rgba(212, 175, 55, 0.2)", text: "text-[#fef2f2]" },
    vintage: { bg: "bg-[#fef3c7]", accent: "#92400e", glass: "rgba(255, 255, 255, 0.4)", border: "rgba(146, 64, 14, 0.2)", text: "text-[#451a03]" },
    onyx: { bg: "bg-black", accent: "#06b6d4", glass: "rgba(255, 255, 255, 0.05)", border: "rgba(6, 182, 212, 0.2)", text: "text-white" },
    lavender: { bg: "bg-[#f5f3ff]", accent: "#8b5cf6", glass: "rgba(255, 255, 255, 0.7)", border: "rgba(139, 92, 246, 0.2)", text: "text-[#4c1d95]" },
    midnight: { bg: "bg-[#020617]", accent: "#38bdf8", glass: "rgba(255, 255, 255, 0.05)", border: "rgba(56, 189, 248, 0.2)", text: "text-[#f8fafc]" },
    champagne: { bg: "bg-[#fafaf9]", accent: "#d97706", glass: "rgba(255, 255, 255, 0.7)", border: "rgba(217, 119, 6, 0.2)", text: "text-[#44403c]" },
    forest: { bg: "bg-[#022c22]", accent: "#10b981", glass: "rgba(255, 255, 255, 0.05)", border: "rgba(16, 185, 129, 0.2)", text: "text-[#f0fdf4]" },
    sunset: { bg: "bg-[#451a03]", accent: "#f97316", glass: "rgba(255, 255, 255, 0.05)", border: "rgba(249, 115, 22, 0.2)", text: "text-[#fff7ed]" },
    marble: { bg: "bg-[#f9fafb]", accent: "#111827", glass: "rgba(255, 255, 255, 0.8)", border: "rgba(229, 231, 235, 1)", text: "text-[#111827]" },
    platinum: { bg: "bg-[#f3f4f6]", accent: "#1f2937", glass: "rgba(255, 255, 255, 0.8)", border: "rgba(209, 213, 219, 1)", text: "text-[#1f2937]" }
  };

  const style = themeStyles[activeTheme] || themeStyles.modern;

  const isVideo = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + event.gallery_urls.length) % event.gallery_urls.length);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % event.gallery_urls.length);
  };

  return (
    <section className="py-24 md:py-32 px-4 md:px-6 relative overflow-hidden w-full flex flex-col items-center border-b border-border bg-background transition-colors duration-500">
      {/* Ambient Gold Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl w-full space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <span className="text-[#D4AF37] text-[10px] font-black tracking-[0.5em] uppercase block">Share Your Celebration</span>
          <h2 className="text-4xl md:text-6xl font-serif italic leading-tight text-foreground">
            One Link. <span className="text-[#D4AF37]">Live Forever.</span>
          </h2>
          <p className="max-w-xl mx-auto font-light tracking-wide text-sm md:text-base text-muted-foreground">
            Create your event page in minutes. Share your custom link with guests. Your RSVPs, photos, and memories stay online forever.
          </p>
        </div>

        {/* Theme Selector Controls (Moved to Top) */}
        <div className="flex flex-col items-center space-y-6 relative w-full">
          {/* Redesigned Premium Style Indicator */}
          <motion.div 
            animate={{ 
              y: [0, -4, 0],
              scale: [1, 1.03, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="flex flex-col items-center gap-1 pointer-events-none"
          >
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#F9E4B7] text-black text-[8px] font-black uppercase tracking-[0.25em] px-4 py-2 rounded-full shadow-[0_8px_24px_rgba(212,175,55,0.3)] flex items-center gap-2 border border-white/20">
              <Palette size={10} className="animate-pulse" /> Tap to change style
            </span>
            <div className="w-2 h-2 bg-[#D4AF37] rotate-45 -mt-1" />
          </motion.div>

          {/* Swipeable Container */}
          <div className="w-full overflow-x-auto flex gap-3 py-2 px-4 snap-x snap-mandatory scrollbar-none justify-start md:justify-center">
            {themes.map((t) => {
              const tStyle = themeStyles[t.id] || themeStyles.modern;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTheme(t.id)}
                  className={`snap-center shrink-0 relative px-5 py-3 rounded-full border transition-all duration-500 flex items-center gap-2.5 ${tStyle.bg} ${tStyle.text} ${tStyle.border} ${
                    activeTheme === t.id 
                      ? 'ring-2 ring-[#D4AF37]/50 scale-105 shadow-lg opacity-100' 
                      : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="w-2.5 h-2.5 rounded-full border border-white/10 bg-white" />
                  <span className="text-[8px] font-black uppercase tracking-widest">
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* The Floating Mockup Event Page */}
        <div className="relative w-full rounded-[2.5rem] border border-border shadow-2xl overflow-hidden bg-card">
          {/* Browser Header */}
          <div className="h-10 border-b border-border px-6 flex items-center gap-1.5 shrink-0 bg-secondary/30">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
            <div className="mx-auto border border-border rounded-full px-4 py-0.5 text-[8px] font-mono tracking-wider bg-background text-muted-foreground">
              theeventhub.com.ng/event/{event.slug}
            </div>
          </div>

          {/* Mockup Content Area */}
          <motion.div 
            animate={{ 
              backgroundColor: activeTheme === 'elegant' ? '#f8f8f8' : 
                             activeTheme === 'traditional' ? '#064e3b' : 
                             activeTheme === 'sahara' ? '#451a03' : 
                             activeTheme === 'velvet' ? '#2e1065' : 
                             activeTheme === 'garden' ? '#022c22' : 
                             activeTheme === 'rose' ? '#831843' : '#050505' 
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className={`p-6 md:p-10 ${style.text} font-sans transition-colors duration-700 space-y-8`}
          >
            {/* Mockup Hero */}
            <div className="relative h-[200px] md:h-[280px] w-full overflow-hidden rounded-2xl border border-white/5">
              {isVideo(event.photo_url) ? (
                <video 
                  src={event.photo_url} 
                  className="w-full h-full object-cover brightness-75" 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  preload="auto"
                />
              ) : (
                <img 
                  src={event.photo_url} 
                  className="w-full h-full object-cover brightness-75"
                  alt={event.event_name}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 text-center md:text-left">
                <span className="text-[#D4AF37] text-[7px] font-black uppercase tracking-[0.4em] block mb-1">• Event in Progress</span>
                <h3 className="text-xl md:text-3xl font-serif italic text-white leading-tight">
                  {event.event_name}
                </h3>
              </div>
            </div>

            {/* Mockup Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
              {/* Left Column: Details & QR Pass */}
              <div className="md:col-span-2 space-y-6">
                {/* Particulars Card */}
                <div className={`p-5 rounded-xl border ${style.glass} border-white/10 transition-all duration-500`}>
                  <h4 className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-4 flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> The Particulars
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                        <Sparkles className="text-[#D4AF37] w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[6px] font-bold uppercase tracking-widest opacity-40">The Celebration</p>
                        <p className="text-xs font-serif italic">Traditional Wedding & Reception</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                        <MapPin className="text-[#D4AF37] w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[6px] font-bold uppercase tracking-widest opacity-40">The Venue</p>
                        <p className="text-xs font-serif italic">{event.venue}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Digital QR Pass Mockup */}
                <div className={`p-5 rounded-xl border ${style.glass} border-white/10 transition-all duration-500 flex items-center justify-between gap-4`}>
                  <div className="space-y-2">
                    <span className="text-[#D4AF37] text-[6px] font-black uppercase tracking-[0.4em] block">Entry Pass</span>
                    <p className="text-sm font-serif italic leading-tight">Chief Balogun</p>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/5 border border-white/10 rounded-full">
                      <span className="text-[6px] font-bold uppercase tracking-widest opacity-50">Table</span>
                      <span className="text-[8px] font-bold text-[#D4AF37]">05</span>
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded-xl flex items-center justify-center shadow-md shrink-0 w-14 h-14">
                    <QRCodeCanvas 
                      id="swapper-qr-canvas"
                      value={eventUrl}
                      size={40}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: 6-Image Memory Wall */}
              <div className="md:col-span-3 space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[#D4AF37] text-[7px] font-bold tracking-[0.3em] uppercase block">The Memory Wall</span>
                    <h4 className="text-sm font-serif italic">Captured <span className="text-[#D4AF37]">Moments</span></h4>
                  </div>
                  <ImageIcon className="w-4 h-4 opacity-40" />
                </div>
                
                {/* 6-Image Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {event.gallery_urls.map((url, i) => (
                    <div 
                      key={i} 
                      onClick={() => setLightboxIndex(i)}
                      className="aspect-[4/5] overflow-hidden rounded-lg border border-white/10 bg-white/5 cursor-pointer group relative"
                    >
                      {isVideo(url) ? (
                        <video 
                          src={url} 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                          muted 
                          playsInline 
                          autoPlay 
                          loop 
                          preload="auto"
                        />
                      ) : (
                        <img 
                          src={url} 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                          alt="" 
                        />
                      )}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[6px] font-black uppercase tracking-widest text-white bg-black/60 px-2 py-1 rounded">View</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lightbox Modal for Memory Wall */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button 
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-[210]"
            >
              <X size={24} />
            </button>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full max-h-[80vh] flex items-center justify-center cursor-default"
            >
              <img 
                src={event.gallery_urls[lightboxIndex]} 
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
                alt="Wedding Moment"
              />

              {/* Navigation Controls */}
              <button 
                onClick={handlePrevImage}
                className="absolute left-4 w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-all border border-white/10"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={handleNextImage}
                className="absolute right-4 w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-all border border-white/10"
              >
                <ChevronRight size={20} />
              </button>

              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">
                {lightboxIndex + 1} / {event.gallery_urls.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ThemeSwapper;