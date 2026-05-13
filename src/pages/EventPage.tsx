"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Heart, Coins, Loader2, Sparkles, Crown, Gem, Sun, Moon, Flower2, Waves, Landmark, Star, PenTool, Diamond, Wine, Anchor, Cloud, Leaf, Flame, Bird, Shield, Coffee, Wind, TreePine, Mountain, CheckCircle2, Share2 } from "lucide-react";
import Countdown from "@/components/Countdown";
import Navbar from "@/components/Navbar";
import { showSuccess, showError } from "@/utils/toast";
import MediaLightbox from "@/components/MediaLightbox";
import RSVPForm from "@/components/RSVPForm";
import DigitalInvite from "@/components/DigitalInvite";

const THEME_CONFIGS: Record<string, any> = {
  modern: { bg: "bg-[#050505]", card: "bg-white/[0.03]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/30", icon: Sparkles },
  traditional: { bg: "bg-[#022c22]", card: "bg-white/[0.03]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/40", icon: Crown },
  elegant: { bg: "bg-[#f8fafc]", card: "bg-black/[0.02]", accent: "text-black", border: "border-black/10", icon: Gem, dark: true },
  sahara: { bg: "bg-[#451a03]", card: "bg-white/[0.03]", accent: "text-[#fbbf24]", border: "border-[#fbbf24]/30", icon: Sun },
  velvet: { bg: "bg-[#1e1b4b]", card: "bg-white/[0.03]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/30", icon: Moon },
  garden: { bg: "bg-[#064e3b]", card: "bg-white/[0.03]", accent: "text-[#10b981]", border: "border-[#10b981]/30", icon: Flower2 },
  oceanic: { bg: "bg-[#172554]", card: "bg-white/[0.03]", accent: "text-[#93c5fd]", border: "border-[#93c5fd]/30", icon: Waves },
  rose: { bg: "bg-[#500724]", card: "bg-white/[0.03]", accent: "text-[#fbcfe8]", border: "border-[#fbcfe8]/30", icon: Heart },
  earth: { bg: "bg-[#2a0e07]", card: "bg-white/[0.03]", accent: "text-[#fb923c]", border: "border-[#fb923c]/30", icon: Landmark },
  silver: { bg: "bg-[#111827]", card: "bg-white/[0.03]", accent: "text-[#9ca3af]", border: "border-[#9ca3af]/30", icon: Star },
  dynasty: { bg: "bg-[#450a0a]", card: "bg-white/[0.03]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/30", icon: Crown },
  vintage: { bg: "bg-[#fef3c7]", card: "bg-black/[0.02]", accent: "text-[#92400e]", border: "border-[#92400e]/30", icon: PenTool, dark: true },
  onyx: { bg: "bg-[#0a0a0a]", card: "bg-white/[0.03]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/30", icon: Diamond },
  champagne: { bg: "bg-[#fff1f2]", card: "bg-black/[0.02]", accent: "text-[#be185d]", border: "border-[#be185d]/20", icon: Wine, dark: true },
  pearl: { bg: "bg-[#020617]", card: "bg-white/[0.03]", accent: "text-[#38bdf8]", border: "border-[#38bdf8]/30", icon: Anchor },
  tuscan: { bg: "bg-[#fffbeb]", card: "bg-black/[0.02]", accent: "text-[#ca8a04]", border: "border-[#ca8a04]/20", icon: Sun, dark: true },
  frost: { bg: "bg-[#f0f9ff]", card: "bg-black/[0.02]", accent: "text-[#0ea5e9]", border: "border-[#0ea5e9]/20", icon: Cloud, dark: true },
  magenta: { bg: "bg-[#fdf2f8]", card: "bg-black/[0.02]", accent: "text-[#db2777]", border: "border-[#db2777]/20", icon: Heart, dark: true },
  jade: { bg: "bg-[#f0fdf4]", card: "bg-black/[0.02]", accent: "text-[#15803d]", border: "border-[#15803d]/20", icon: Leaf, dark: true },
  saffron: { bg: "bg-[#fff7ed]", card: "bg-black/[0.02]", accent: "text-[#ea580c]", border: "border-[#ea580c]/20", icon: Flame, dark: true },
  slate: { bg: "bg-[#f8fafc]", card: "bg-black/[0.02]", accent: "text-[#475569]", border: "border-[#475569]/20", icon: Landmark, dark: true },
  lavender: { bg: "bg-[#f5f3ff]", card: "bg-black/[0.02]", accent: "text-[#5b21b6]", border: "border-[#5b21b6]/20", icon: Bird, dark: true },
  ruby: { bg: "bg-[#fff1f2]", card: "bg-black/[0.02]", accent: "text-[#e11d48]", border: "border-[#e11d48]/20", icon: Wine, dark: true },
  golden: { bg: "bg-[#fffbeb]", card: "bg-black/[0.02]", accent: "text-[#d97706]", border: "border-[#d97706]/20", icon: Sun, dark: true },
  birch: { bg: "bg-[#f9fafb]", card: "bg-black/[0.02]", accent: "text-[#4b5563]", border: "border-[#4b5563]/20", icon: TreePine, dark: true },
  bronze: { bg: "bg-[#fff7ed]", card: "bg-black/[0.02]", accent: "text-[#9a3412]", border: "border-[#9a3412]/20", icon: Shield, dark: true },
  plum: { bg: "bg-[#faf5ff]", card: "bg-black/[0.02]", accent: "text-[#6b21a8]", border: "border-[#6b21a8]/30", icon: Coffee, dark: true },
  teal: { bg: "bg-[#f0fdfa]", card: "bg-black/[0.02]", accent: "text-[#0d9488]", border: "border-[#0d9488]/20", icon: Waves, dark: true },
  charcoal: { bg: "bg-[#020617]", card: "bg-white/[0.03]", accent: "text-[#f43f5e]", border: "border-[#f43f5e]/30", icon: Heart },
  sand: { bg: "bg-[#fafaf9]", card: "bg-black/[0.02]", accent: "text-[#78716c]", border: "border-[#78716c]/20", icon: Mountain, dark: true },
  forest: { bg: "bg-[#022c22]", card: "bg-white/[0.03]", accent: "text-[#10b981]", border: "border-[#10b981]/30", icon: TreePine },
  ember: { bg: "bg-[#450a0a]", card: "bg-white/[0.03]", accent: "text-[#ef4444]", border: "border-[#ef4444]/30", icon: Flame },
  blossom: { bg: "bg-[#fff1f2]", card: "bg-black/[0.02]", accent: "text-[#fb7185]", border: "border-[#fb7185]/20", icon: Flower2, dark: true },
  solstice: { bg: "bg-[#1e1b4b]", card: "bg-white/[0.03]", accent: "text-[#818cf8]", border: "border-[#818cf8]/30", icon: Moon },
  breeze: { bg: "bg-[#f0f9ff]", card: "bg-black/[0.02]", accent: "text-[#38bdf8]", border: "border-[#38bdf8]/20", icon: Wind, dark: true }
};

const EventPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [rsvpData, setRsvpData] = useState<any>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        showError("Event not found");
        navigate("/");
        return;
      }
      setEvent(data);
      
      // Check if user has already RSVP'd on this device
      const savedRsvp = localStorage.getItem(`rsvp_${data.id}`);
      if (savedRsvp) setRsvpData(JSON.parse(savedRsvp));
      
      setLoading(false);
    };
    fetchEvent();
  }, [slug, navigate]);

  if (loading || !event) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" />
    </div>
  );

  const themeConfig = THEME_CONFIGS[event.theme?.toLowerCase()] || THEME_CONFIGS.modern;
  const isDark = themeConfig.dark;
  const hasStarted = new Date(event.event_date) <= new Date();
  const isConcluded = event.is_concluded;

  // Determine State
  let state: 'countdown' | 'live' | 'concluded' = 'countdown';
  if (isConcluded) state = 'concluded';
  else if (hasStarted) state = 'live';

  const handleRsvpSuccess = (data: any) => {
    setRsvpData(data);
    localStorage.setItem(`rsvp_${event.id}`, JSON.stringify(data));
  };

  return (
    <div className={`min-h-screen ${themeConfig.bg} ${isDark ? 'text-black' : 'text-white'} selection:bg-[#D4AF37] selection:text-black transition-colors duration-1000`}>
      <Navbar />
      
      <div className="relative pt-24 md:pt-32 pb-20 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16 md:mb-24"
          >
            <span className={`text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block ${themeConfig.accent}`}>
              {state === 'countdown' ? 'The Anticipation' : state === 'live' ? 'The Celebration' : 'A Beautiful Memory'}
            </span>
            <h1 className="text-4xl md:text-8xl font-serif italic mb-8 leading-tight">
              {event.event_name}
            </h1>
            <div className={`flex flex-wrap justify-center gap-6 md:gap-10 text-[10px] font-bold uppercase tracking-[0.3em] ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>
              <div className="flex items-center gap-2"><Calendar className={`w-4 h-4 ${themeConfig.accent}`} /> {new Date(event.event_date).toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
              <div className="flex items-center gap-2"><MapPin className={`w-4 h-4 ${themeConfig.accent}`} /> {event.venue}</div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-12 md:gap-20">
            {/* Left Column: Visuals & Countdown */}
            <div className="lg:col-span-7 space-y-12">
              <div className={`relative aspect-[4/5] rounded-[3rem] overflow-hidden border shadow-2xl ${themeConfig.border}`}>
                <img src={event.photo_url} className="w-full h-full object-cover" alt="Cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                {state === 'countdown' && (
                  <div className="absolute bottom-10 left-10 right-10">
                    <Countdown targetDate={event.event_date} />
                  </div>
                )}
                {state === 'live' && (
                  <div className="absolute top-10 right-10">
                    <span className="bg-green-500 text-black text-[8px] font-black px-4 py-2 uppercase tracking-widest rounded-full animate-pulse">Live Now</span>
                  </div>
                )}
              </div>

              {/* Gallery Section (Always visible but emphasized in Concluded state) */}
              {event.gallery_urls && event.gallery_urls.length > 0 && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className={`text-[10px] font-bold uppercase tracking-[0.4em] ${themeConfig.accent}`}>The Gallery ({event.gallery_urls.length})</h3>
                    <span className={`text-[8px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>HD Quality</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {event.gallery_urls.map((url: string, i: number) => (
                      <motion.div 
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => { setCurrentMediaIndex(i); setLightboxOpen(true); }}
                        className={`aspect-square rounded-2xl overflow-hidden border cursor-pointer group ${themeConfig.border}`}
                      >
                        <img src={url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Interaction & Details */}
            <div className="lg:col-span-5 space-y-12">
              {/* Host Message */}
              <div className={`p-10 border rounded-[3rem] backdrop-blur-xl ${themeConfig.card} ${themeConfig.border}`}>
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-black/5' : 'bg-white/5'}`}>
                    <Heart className={`w-5 h-5 ${themeConfig.accent}`} />
                  </div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em]">Host's Message</h3>
                </div>
                <p className="text-xl font-serif italic leading-relaxed opacity-80">
                  "{event.message}"
                </p>
              </div>

              {/* State-Specific Content */}
              <AnimatePresence mode="wait">
                {state === 'concluded' ? (
                  <motion.div 
                    key="concluded"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-10 border rounded-[3rem] text-center ${themeConfig.card} ${themeConfig.border}`}
                  >
                    <CheckCircle2 className={`w-12 h-12 mx-auto mb-6 ${themeConfig.accent}`} />
                    <h3 className="text-2xl font-serif italic mb-4">Celebration Concluded</h3>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                      This event has successfully concluded. Thank you for being part of our story. The gallery remains open for you to relive the moments.
                    </p>
                  </motion.div>
                ) : rsvpData ? (
                  <motion.div 
                    key="pass"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                  >
                    <div className="text-center">
                      <p className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-6 ${themeConfig.accent}`}>Your Entry Pass</p>
                      <DigitalInvite event={event} rsvpId={rsvpData.id} guestName={rsvpData.guest_name} />
                    </div>
                    {state === 'live' && (
                      <Button 
                        onClick={() => navigate(`/spray/${event.slug}`)}
                        className={`w-full py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500 shadow-2xl ${
                          isDark ? 'bg-black text-white hover:bg-black/80' : 'bg-[#D4AF37] text-black hover:bg-[#B8860B]'
                        }`}
                      >
                        <Coins className="w-4 h-4 mr-2" /> Digital Spray
                      </Button>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="rsvp"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-10 border rounded-[3rem] ${themeConfig.card} ${themeConfig.border}`}
                  >
                    <div className="text-center mb-10">
                      <h3 className="text-2xl font-serif italic mb-2">RSVP Now</h3>
                      <p className={`text-[8px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Secure your spot on the guest list</p>
                    </div>
                    <RSVPForm eventId={event.id} onSuccess={handleRsvpSuccess} themeConfig={themeConfig} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Share Section */}
              <div className="flex items-center justify-center gap-4 pt-8">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    showSuccess("Event link copied.");
                  }}
                  className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:opacity-70 transition-opacity ${themeConfig.accent}`}
                >
                  <Share2 size={14} /> Share Event
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {event.gallery_urls && (
        <MediaLightbox 
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          mediaUrls={event.gallery_urls}
          currentIndex={currentMediaIndex}
          onNavigate={setCurrentMediaIndex}
        />
      )}
    </div>
  );
};

export default EventPage;