"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Copy, ArrowLeft, User, Calendar, MapPin, MessageSquare, FileDown, CheckCircle2 } from "lucide-react";
import Countdown from "@/components/Countdown";
import Navbar from "@/components/Navbar";
import { showSuccess, showError } from "@/utils/toast";

interface Event {
  id: string;
  event_name: string;
  event_date: string;
  venue: string;
  message: string;
  slug: string;
  gallery_urls?: string[];
}

const EventPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading || !event) return null;

  const isConcluded = new Date(event.event_date).getTime() + 86400000 < Date.now();

  const handleExportCSV = () => {
    showSuccess("Exporting guest list...");
  };

  const handleRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess("RSVP submitted!");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto py-20 px-6">
        {isConcluded ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center p-8 bg-[#050505] rounded-[3rem] border border-[#D4AF37]/20">
              <h2 className="text-3xl md:text-5xl font-serif italic text-[#D4AF37] mb-4">Celebration Completed</h2>
              <p className="text-gray-400 mb-6">Thank you for orchestrating an unforgettable event! The celebration has officially concluded.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {event.gallery_urls?.slice(0, 4).map((url, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <img src={url} alt="Event Memory" className="w-full h-full object-cover rounded" />
                  </motion.div>
                ))}
              </div>
              <Button className="mt-8 bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-none py-6 text-[10px] font-bold tracking-[0.4em] uppercase">
                View Full Gallery
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="relative space-y-12">
            <Countdown targetDate={event.event_date} />
            
            <div className="flex gap-4 md:gap-6 mt-4">
              <Button 
                variant="ghost" 
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/event/${event.slug}`);
                  showSuccess("Link copied!");
                }}
                className="text-[#D4AF37] text-[8px] font-bold uppercase tracking-widest hover:text-[#D4AF37]/70 transition-colors"
              >
                <Copy className="w-4 h-4 mr-1.5" />
                Check Your Event Page
              </Button>
              <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-[#D4AF37] text-[8px] font-bold uppercase tracking-widest hover:text-[#D4AF37]/70 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Dashboard
              </Button>
            </div>

            <div className="mt-8 p-6 bg-[#080808] rounded-[3rem] border border-[#D4AF37]/10">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-2">Core Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                    <User className="text-[#D4AF37] w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">Event Name</p>
                    <p className="text-base md:text-lg font-light">{event.event_name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                    <Calendar className="text-[#D4AF37] w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">Date & Time</p>
                    <p className="text-base md:text-lg font-light">{new Date(event.event_date).toLocaleString('en-NG')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                    <MapPin className="text-[#D4AF37] w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">Venue</p>
                    <p className="text-base md:text-lg font-light">{event.venue}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                    <MessageSquare className="text-[#D4AF37] w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">Host Message</p>
                    <p className="text-sm md:text-base font-light">{event.message}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="ghost" onClick={() => navigate('/support')} className="text-[#D4AF37] text-[8px] font-bold uppercase tracking-widest hover:text-[#D4AF37]/70">
                    Need Help? Contact Support
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <Button variant="ghost" onClick={handleExportCSV} className="text-[#D4AF37] text-[8px] font-bold uppercase tracking-widest hover:text-[#D4AF37]/70">
                <FileDown className="w-4 h-4 mr-1.5" /> Export Guest List CSV
              </Button>
            </div>

            <form onSubmit={handleRSVP} className="space-y-10">
              {/* RSVP form fields would go here */}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPage;