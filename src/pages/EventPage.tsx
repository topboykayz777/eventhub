"use client";

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Countdown from '@/components/Countdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';
import { MapPin, Calendar, MessageSquare, Sparkles, CheckCircle2, Loader2, AlertTriangle, RefreshCw, Megaphone, Table as TableIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import DigitalInvite from '@/components/DigitalInvite';

const EventPage = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpData, setRsvpData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRsvp, setSubmittedRsvp] = useState<any>(null);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchEvent();
      
      const eventChannel = supabase
        .channel(`event-realtime-${slug}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'events',
            filter: `slug=eq.${slug}`
          },
          (payload) => {
            setEvent(payload.new);
            if (payload.new.is_paid && !event?.is_paid) {
              confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            }
          }
        )
        .subscribe();

      return () => { supabase.removeChannel(eventChannel); };
    }
  }, [slug]);

  useEffect(() => {
    if (submittedRsvp?.id) {
      const rsvpChannel = supabase
        .channel(`rsvp-realtime-${submittedRsvp.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'rsvps',
            filter: `id=eq.${submittedRsvp.id}`
          },
          (payload) => {
            setSubmittedRsvp(payload.new);
            showSuccess("Your seating has been updated!");
          }
        )
        .subscribe();

      return () => { supabase.removeChannel(rsvpChannel); };
    }
  }, [submittedRsvp?.id]);

  const fetchEvent = async () => {
    if (!slug) return;
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .ilike('slug', slug.trim())
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setEvent(data);
        setIsHost(user?.id === data.host_id);
        
        if (data.is_paid) {
          supabase.rpc('increment_view_count', { event_id: data.id }).catch(() => {});
        }
      }
    } catch (err: any) {
      console.error("[EventPage] Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event?.is_paid) {
      showError("This event is currently pending activation.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .insert({
          event_id: event.id,
          guest_name: rsvpData.name,
          guest_phone: rsvpData.phone
        })
        .select('*')
        .single();

      if (error) throw error;

      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      showSuccess('Welcome to the guest list!');
      setSubmittedRsvp(data);
    } catch (err: any) {
      showError(err.message || 'Failed to submit RSVP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f0f] text-white">
      <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37] mb-4" />
      <p className="text-[10px] font-bold tracking-[0.5em] uppercase animate-pulse">Accessing Invitation...</p>
    </div>
  );

  if (!event) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f0f] text-white p-6 text-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-8 opacity-50" />
        <h1 className="text-4xl font-serif italic mb-4">Event Not Found</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">The link you followed may be broken.</p>
        <Link to="/"><Button variant="ghost" className="text-gray-500 hover:text-white">Return Home</Button></Link>
      </motion.div>
    </div>
  );

  const theme = event.theme || 'modern';
  const themeConfigs: Record<string, any> = {
    modern: { bg: "bg-[#0a0a1a]", text: "text-white", accent: "text-[#D4AF37]", button: "bg-[#D4AF37] hover:bg-[#B8860B] text-black", card: "bg-white/5 border-white/10 backdrop-blur-xl", rsvpCard: "bg-white text-black" },
    traditional: { bg: "bg-[#064e3b]", text: "text-[#fdfcf0]", accent: "text-[#D4AF37]", button: "bg-[#D4AF37] hover:bg-[#B8860B] text-black", card: "bg-white/5 border-[#D4AF37]/20 shadow-xl", rsvpCard: "bg-[#D4AF37] text-black" },
    elegant: { bg: "bg-white", text: "text-gray-900", accent: "text-black", button: "bg-black hover:bg-gray-800 text-white", card: "bg-gray-50 border-gray-100 shadow-lg", rsvpCard: "bg-white border-4 border-black text-black" },
    sahara: { bg: "bg-[#78350f]", text: "text-[#fef3c7]", accent: "text-[#fbbf24]", button: "bg-[#fbbf24] hover:bg-[#d97706] text-black", card: "bg-white/5 border-[#fbbf24]/20 backdrop-blur-xl", rsvpCard: "bg-[#fbbf24] text-black" },
    velvet: { bg: "bg-[#2e1065]", text: "text-[#f5f3ff]", accent: "text-[#D4AF37]", button: "bg-[#D4AF37] hover:bg-[#B8860B] text-black", card: "bg-white/5 border-[#D4AF37]/20 backdrop-blur-xl", rsvpCard: "bg-[#D4AF37] text-black" },
    garden: { bg: "bg-[#064e3b]", text: "text-[#ecfdf5]", accent: "text-[#10b981]", button: "bg-[#10b981] hover:bg-[#059669] text-white", card: "bg-white/5 border-[#10b981]/20 backdrop-blur-xl", rsvpCard: "bg-[#10b981] text-white" },
    oceanic: { bg: "bg-[#1e3a8a]", text: "text-[#eff6ff]", accent: "text-[#93c5fd]", button: "bg-[#93c5fd] hover:bg-[#60a5fa] text-black", card: "bg-white/5 border-[#93c5fd]/20 backdrop-blur-xl", rsvpCard: "bg-[#93c5fd] text-black" },
    rose: { bg: "bg-[#831843]", text: "text-[#fdf2f8]", accent: "text-[#fbcfe8]", button: "bg-[#fbcfe8] hover:bg-[#f9a8d4] text-black", card: "bg-white/5 border-[#fbcfe8]/20 backdrop-blur-xl", rsvpCard: "bg-[#fbcfe8] text-black" },
    earth: { bg: "bg-[#431407]", text: "text-[#fff7ed]", accent: "text-[#fb923c]", button: "bg-[#fb923c] hover:bg-[#ea580c] text-white", card: "bg-white/5 border-[#fb923c]/20 backdrop-blur-xl", rsvpCard: "bg-[#fb923c] text-white" },
    silver: { bg: "bg-[#1f2937]", text: "text-[#f9fafb]", accent: "text-[#9ca3af]", button: "bg-[#9ca3af] hover:bg-[#6b7280] text-white", card: "bg-white/5 border-[#9ca3af]/20 backdrop-blur-xl", rsvpCard: "bg-[#9ca3af] text-white" },
    dynasty: { bg: "bg-[#7f1d1d]", text: "text-[#fef2f2]", accent: "text-[#D4AF37]", button: "bg-[#D4AF37] hover:bg-[#B8860B] text-black", card: "bg-white/5 border-[#D4AF37]/20 backdrop-blur-xl", rsvpCard: "bg-[#D4AF37] text-black" },
    vintage: { bg: "bg-[#fef3c7]", text: "text-[#451a03]", accent: "text-[#92400e]", button: "bg-[#92400e] hover:bg-[#78350f] text-white", card: "bg-white/10 border-[#92400e]/20 backdrop-blur-xl", rsvpCard: "bg-[#92400e] text-white" }
  };

  const config = themeConfigs[theme] || themeConfigs.modern;

  return (
    <div className={`min-h-screen ${config.bg} ${config.text} transition-colors duration-700 overflow-x-hidden`}>
      <AnimatePresence>
        {event.broadcast_message && (
          <motion.div 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 z-[100] bg-[#D4AF37] text-black py-3 md:py-4 px-6 md:px-8 flex items-center justify-center gap-3 md:gap-4 shadow-2xl"
          >
            <Megaphone className="w-4 h-4 md:w-5 md:h-5 animate-bounce" />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-center">
              {event.broadcast_message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative h-[50vh] md:h-[75vh] w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5 }}
          src={event.photo_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80'} 
          className="w-full h-full object-cover grayscale contrast-125"
          alt={event.event_name}
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-${config.bg.replace('bg-', '')} via-transparent to-transparent`} />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16 max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div className="flex items-center justify-center gap-2 mb-4 md:mb-6">
              <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[#D4AF37] text-[7px] md:text-[8px] font-bold tracking-[0.4em] md:tracking-[0.5em] uppercase">HD Masterpiece Live</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-8xl font-serif italic mb-6 md:mb-8 tracking-tight leading-[1.1] md:leading-[0.9]">
              {event.event_name}
            </h1>
            <div className="max-w-3xl mx-auto scale-90 md:scale-100">
              <Countdown targetDate={event.event_date} />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="grid md:grid-cols-5 gap-12 md:gap-16">
          <div className="md:col-span-3 space-y-12 md:space-y-16">
            {(event.plan === 'Standard' || event.plan === 'Pro') && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 md:mb-16">
                <h2 className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-[#D4AF37] mb-8 md:mb-12 text-center">The Official Invitation</h2>
                <DigitalInvite event={event} />
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`${config.card} p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] border`}>
              <h2 className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-[#D4AF37] mb-8 md:mb-12 flex items-center gap-4">
                <Calendar className="w-3 h-3 md:w-4 md:h-4" /> The Particulars
              </h2>
              <div className="space-y-8 md:space-y-12">
                <div className="flex items-start gap-4 md:gap-8 group">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#D4AF37]/10 transition-colors shrink-0">
                    <MapPin className="text-[#D4AF37] w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <p className="text-[7px] md:text-[8px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-500 mb-1 md:mb-2">The Venue</p>
                    <p className="text-base md:text-2xl font-light leading-relaxed">{event.venue}</p>
                  </div>
                </div>
                {event.message && (
                  <div className="flex items-start gap-4 md:gap-8 group">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#D4AF37]/10 transition-colors shrink-0">
                      <MessageSquare className="text-[#D4AF37] w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div>
                      <p className="text-[7px] md:text-[8px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-500 mb-1 md:mb-2">Host's Message</p>
                      <p className="text-base md:text-2xl font-serif italic leading-relaxed opacity-80">"{event.message}"</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {event.gallery_urls && event.gallery_urls.length > 0 && (
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {event.gallery_urls.map((url: string, i: number) => (
                  <img key={i} src={url} className="w-full aspect-square object-cover rounded-xl md:rounded-2xl border border-white/10" alt={`Gallery ${i}`} />
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <AnimatePresence mode="wait">
              {submittedRsvp ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="sticky top-24 md:top-32 space-y-6 md:space-y-8">
                  <div className="text-center mb-8 md:mb-12">
                    <div className="bg-green-500/10 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                      <CheckCircle2 className="text-green-500 w-6 h-6 md:w-8 md:h-8" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-serif italic mb-2">You're on the list</h2>
                    <p className="text-gray-500 text-[8px] md:text-[10px] font-bold uppercase tracking-widest">Save your elite pass below</p>
                  </div>

                  <AnimatePresence mode="wait">
                    {submittedRsvp.table_number && (
                      <motion.div 
                        key={submittedRsvp.table_number}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] text-center"
                      >
                        <TableIcon className="w-6 h-6 md:w-8 md:h-8 text-[#D4AF37] mx-auto mb-3 md:mb-4" />
                        <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-500 mb-1 md:mb-2">Your Assigned Seating</p>
                        <motion.p 
                          key={submittedRsvp.table_number}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-3xl md:text-4xl font-serif italic text-[#D4AF37]"
                        >
                          Table {submittedRsvp.table_number}
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <DigitalInvite event={event} rsvpId={submittedRsvp.id} />
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={`${config.rsvpCard} p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] shadow-2xl sticky top-24 md:top-32 border border-black/5`}>
                  <div className="flex items-center gap-3 mb-6 md:mb-8">
                    <Sparkles className="text-[#D4AF37] w-4 h-4 md:w-5 md:h-5" />
                    <h2 className="text-xl md:text-3xl font-serif italic tracking-tight">The Registry</h2>
                  </div>
                  <form onSubmit={handleRSVP} className="space-y-6 md:space-y-8">
                    <div className="space-y-2 md:space-y-3">
                      <Label className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">Full Name</Label>
                      <Input required className="bg-black/5 border-none h-14 md:h-16 rounded-none text-base md:text-lg px-6 font-light" placeholder="e.g. Tunde Afolayan" value={rsvpData.name} onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })} />
                    </div>
                    <div className="space-y-2 md:space-y-3">
                      <Label className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">WhatsApp Number</Label>
                      <Input required className="bg-black/5 border-none h-14 md:h-16 rounded-none text-base md:text-lg px-6 font-light" placeholder="08012345678" value={rsvpData.phone} onChange={(e) => setRsvpData({ ...rsvpData, phone: e.target.value })} />
                    </div>
                    <Button type="submit" disabled={isSubmitting} className={`w-full ${config.button} h-16 md:h-20 rounded-none text-[8px] md:text-[10px] font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase shadow-2xl transition-all hover:scale-105 active:scale-95`}>
                      {isSubmitting ? 'Processing...' : 'Confirm Attendance'}
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPage;