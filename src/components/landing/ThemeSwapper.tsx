"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Sparkles, ImageIcon, MousePointer, QrCode, X, ChevronLeft, ChevronRight } from 'lucide-react';
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
    pillColors: ['bg-[#831843]', 'bg-[#fbcfe8]'],
    fontFamily: 'font-sans'
  }
];

const fallbackGallery = [
  "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1520854221256-17451cc35953?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80"
];

const ThemeSwapper = () => {
  const [activeTheme, setActiveTheme] = useState<ThemeConfig>(themes[0]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { resolvedTheme } = useTheme();
  
  // Dynamic event state with beautiful fallbacks
  const [eventData, setEventData] = useState({
    eventName: "The Balogun Wedding",
    venue: "The Grand Ballroom, Eko Hotel, Lagos",
    photoUrl: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&q=80",
    galleryUrls: fallbackGallery,
    slug: "the-balogun-wedding"
  });

  // Fetch real Balogun Wedding event details from Supabase
  useEffect(() => {
    const fetchRealEvent = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .ilike('event_name', '%balogun%')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data && !error) {
          // Pad gallery with fallbacks if there are fewer than 6 images
          let mergedGallery = [...(data.gallery_urls || [])];
          if (mergedGallery.length < 6) {
            mergedGallery = [...mergedGallery, ...fallbackGallery.slice(0, 6 - mergedGallery.length)];
          }

          setEventData({
            eventName: data.event_name,
            venue: data.venue,
            photoUrl: data.photo_url || fallbackGallery[0],
            galleryUrls: mergedGallery.slice(0, 6),
            slug: data.slug
          });
        }
      } catch (err) {
        console.error("Error fetching Balogun event:", err);
      }
    };

    fetchRealEvent();
  }, []);

  // Follow the actual global theme directly (dark when global is dark, light when global is light)
  const isDark = resolvedTheme === 'dark';

  const isVideo = (url: string) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.quicktime'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + eventData.galleryUrls.length) % eventData.galleryUrls.length);
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % eventData.galleryUrls.length);
    }
  };

  const liveEventUrl = `https://theeventhub.com.ng/event/${eventData.slug}`;

  return (
    <section 
      className={`py-24 md:py-32 px-4 md:px-6 relative overflow-hidden w-full flex flex-col items-center border-b transition-colors duration-500 ${
        isDark 
          ? 'bg-[#050505] text-white border-zinc-800' 
          : 'bg-[#f8f8f8] text-gray-900 border-gray-200'
      }`}
    >
      {/* Ambient Gold Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl w-full space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <span className="text-[#D4AF37] text-[10px] font-black tracking-[0.5em] uppercase block">Instant Transformation</span>
          <h2 className={`text-4xl md:text-6xl font-serif italic leading-tight transition-colors duration-500 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            One Click. <span className="text-[#D4AF37]">Infinite Elegance.</span>
          </h2>
          <p className={`max-w-xl mx-auto font-light tracking-wide text-sm md:text-base transition-colors duration-500 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
            Change your event's look instantly. Tap any theme below to see the magic happen in real-time.
          </p>
        </div>

        {/* The Floating Mockup Event Page */}
        <div className={`relative w-full rounded-[2.5rem] border shadow-2xl overflow-hidden transition-colors duration-500 ${
          isDark ? 'border-zinc-800 bg-zinc-950' : 'border-gray-200 bg-white'
        }`}>
          {/* Browser Header */}
          <div className={`h-10 border-b px-6 flex items-center gap-1.5 shrink-0 transition-colors duration-500 ${
            isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-gray-200 bg-gray-100/50'
          }`}>
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
            <div className={`mx-auto border rounded-full px-4 py-0.5 text-[8px] font-mono tracking-wider transition-colors duration-500 ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-gray-50 border-gray-200 text-gray-400'
            }`}>
              theeventhub.com.ng/event/{eventData.slug}
            </div>
          </div>

          {/* Mockup Content Area */}
          <motion.div 
            animate={{ 
              backgroundColor: activeTheme.id === 'elegant' ? '#f8f8f8' : 
                             activeTheme.id === 'traditional' ? '#064e3b' : 
                             activeTheme.id === 'sahara' ? '#451a03' : 
                             activeTheme.id === 'velvet' ? '#2e1065' : 
                             activeTheme.id === 'garden' ? '#022c22' : 
                             activeTheme.id === 'rose' ? '#831843' : '#050505' 
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className={`p-6 md:p-10 ${activeTheme.text} ${activeTheme.fontFamily || 'font-sans'} transition-colors duration-700 space-y-8`}
          >
            {/* Mockup Hero */}
            <div className="relative h-[200px] md:h-[280px] w-full overflow-hidden rounded-2xl border border-white/5">
              {isVideo(eventData.photoUrl) ? (
                <video 
                  src={eventData.photoUrl} 
                  className="w-full h-full object-cover brightness-75" 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  preload="auto"
                />
              ) : (
                <img 
                  src={eventData.photoUrl} 
                  className="w-full h-full object-cover brightness-75"
                  alt={eventData.eventName}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-center md:text-left">
                <span className="text-[#D4AF37] text-[7px] font-black uppercase tracking-[0.4em] block mb-1">• Event in Progress</span>
                <h3 className="text-xl md:text-3xl font-serif italic text-white leading-tight">
                  {eventData.eventName}
                </h3>
              </div>
            </div>

            {/* Mockup Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
              {/* Left Column: Details & QR Pass */}
              <div className="md:col-span-2 space-y-6">
                {/* Particulars Card */}
                <div className={`p-5 rounded-xl border ${activeTheme.card} transition-all duration-500`}>
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
                        <p className="text-xs font-serif italic">{eventData.venue}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Digital QR Pass Mockup */}
                <div className={`p-5 rounded-xl border ${activeTheme.card} transition-all duration-500 flex items-center justify-between gap-4`}>
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
                      value={liveEventUrl}
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
                  {eventData.galleryUrls.map((url, i) => (
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

        {/* Theme Selector Controls */}
        <div className="flex flex-col items-center space-y-4 relative w-full">
          {/* Animated Cursor Indicator */}
          <motion.div 
            animate={{ 
              y: [0, -4, 0],
              scale: [1, 1.02, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="flex flex-col items-center gap-1 pointer-events-none"
          >
            <span className="bg-[#D4AF37] text-black text-[7px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
              <MousePointer size={8} /> Swipe & Tap to Morph
            </span>
            <div className="w-1.5 h-1.5 bg-[#D4AF37] rotate-45 -mt-1" />
          </motion.div>

          {/* Swipeable Container */}
          <div className="w-full overflow-x-auto flex gap-3 py-2 px-4 snap-x snap-mandatory scrollbar-none justify-start md:justify-center">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTheme(t)}
                className={`snap-center shrink-0 relative px-5 py-3 rounded-full border transition-all duration-500 flex items-center gap-2.5 ${t.bg} ${t.text} ${t.border} ${
                  activeTheme.id === t.id 
                    ? 'ring-2 ring-[#D4AF37]/50 scale-105 shadow-lg opacity-100' 
                    : 'opacity-80 hover:opacity-100'
                }`}
              >
                {/* Color Pills */}
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
            ))}
          </div>
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
                src={eventData.galleryUrls[lightboxIndex]} 
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
                {lightboxIndex + 1} / {eventData.galleryUrls.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ThemeSwapper;