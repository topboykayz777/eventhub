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
  { id: 'modern', label: 'Midnight Noir', color: 'from-gray-900 to-black', icon: Sparkles, pillColors: ['bg-gray-900', 'bg-black'] },
  { id: 'traditional', label: 'Royal Heritage', color: 'from-emerald-900 to-green-950', icon: Sparkles, pillColors: ['bg-emerald-900', 'bg-green-950'] },
  { id: 'elegant', label: 'Pure Ivory', color: 'from-slate-50 to-slate-200', icon: Sparkles, light: true, pillColors: ['bg-slate-50', 'bg-slate-200'] },
  { id: 'sahara', label: 'Sahara Gold', color: 'from-amber-600 to-orange-900', icon: Sparkles, pillColors: ['bg-amber-600', 'bg-orange-900'] },
  { id: 'velvet', label: 'Midnight Velvet', color: 'from-purple-900 to-indigo-950', icon: Sparkles, pillColors: ['bg-purple-900', 'bg-indigo-950'] },
  { id: 'dynasty', label: 'Crimson Dynasty', color: 'from-red-800 to-red-950', icon: Sparkles }
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
    dynasty: { bg: "bg-[#7f1d1d]", accent: "#D4AF37", glass: "rgba(0, 0, 0, 0.2)", border: "rgba(212, 175, 55, 0.2)", text: "text-[#fef2f2]" }
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
                  <div className="flex gap-0.5">
                    {t.pillColors?.map((color, idx) => (
                      <div key={idx} className={`w-2.5 h-2.5 rounded-full border border-white/10 ${color}`} />
                    )) || (
                      <div className="w-2.5 h-2.5 rounded-full border border-white/10 bg-white" />
                    )}
                  </div>
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
                             activeTheme === 'dynasty' ? '#7f1d1d' : '#050505' 
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