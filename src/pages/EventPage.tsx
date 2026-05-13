"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Copy, ArrowLeft, User, Calendar, MapPin, MessageSquare, FileDown, CheckCircle2, Camera, Sparkles, Heart, Coins, Loader2 } from "lucide-react";
import Countdown from "@/components/Countdown";
import Navbar from "@/components/Navbar";
import { showSuccess, showError } from "@/utils/toast";
import MediaLightbox from "@/components/MediaLightbox";

interface Event {
  id: string;
  event_name: string;
  event_date: string;
  venue: string;
  message: string;
  slug: string;
  theme: string;
  photo_url: string;
  gallery_urls?: string[];
}

const EventPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

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
      setLoading(false);
    };
    fetchEvent();
  }, [slug, navigate]);

  if (loading || !event) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" />
    </div>
  );

  const isConcluded = new Date(event.event_date).getTime() + 86400000 < Date.now();

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-black">
      <Navbar />
      
      <div className="relative pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block">
              {isConcluded ? 'A Beautiful Memory' : 'The Celebration'}
            </span>
            <h1 className="text-5xl md:text-8xl font-serif italic mb-8 leading-tight">
              {event.event_name}
            </h1>
            <div className="flex flex-wrap justify-center gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#D4AF37]" /> {new Date(event.event_date).toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#D4AF37]" /> {event.venue}</div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-12 gap-12 md:gap-20">
            {/* Left: Visuals */}
            <div className="lg:col-span-7 space-y-12">
              <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                <img src={event.photo_url} className="w-full h-full object-cover" alt="Cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                {!isConcluded && (
                  <div className="absolute bottom-10 left-10 right-10">
                    <Countdown targetDate={event.event_date} />
                  </div>
                )}
              </div>

              {/* Gallery */}
              {event.gallery_urls && event.gallery_urls.length > 0 && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37]">The Gallery ({event.gallery_urls.length})</h3>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-gray-600">HD Quality</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {event.gallery_urls.map((url, i) => (
                      <motion.div 
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => {
                          setCurrentMediaIndex(i);
                          setLightboxOpen(true);
                        }}
                        className="aspect-square rounded-2xl overflow-hidden border border-white/5 cursor-pointer group"
                      >
                        <img src={url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Details & Actions */}
            <div className="lg:col-span-5 space-y-12">
              <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] backdrop-blur-xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                    <Heart className="text-[#D4AF37] w-5 h-5" />
                  </div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em]">Host's Message</h3>
                </div>
                <p className="text-xl font-serif italic text-gray-300 leading-relaxed">
                  "{event.message}"
                </p>
              </div>

              {!isConcluded && (
                <div className="space-y-6">
                  <Button 
                    onClick={() => navigate(`/spray/${event.slug}`)}
                    className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500 shadow-2xl shadow-[#D4AF37]/10"
                  >
                    <Coins className="w-4 h-4 mr-2" /> Digital Spray
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate(`/dashboard`)}
                    className="w-full border-white/10 bg-white/5 text-white py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-white/10"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                  </Button>
                </div>
              )}

              {isConcluded && (
                <div className="p-10 bg-green-500/5 border border-green-500/20 rounded-[3rem] text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-serif italic mb-4">Celebration Concluded</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    This event has successfully concluded. The gallery remains open for you to relive the moments.
                  </p>
                </div>
              )}
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