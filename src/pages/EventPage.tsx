"use client";

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Countdown from '@/components/Countdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';
import { MapPin, Calendar, MessageSquare, Share2, Sparkles, CheckCircle2, Image as ImageIcon, Loader2 } from 'lucide-react';
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

  useEffect(() => {
    const fetchEvent = async () => {
      // We fetch the event by slug. We don't strictly filter by is_paid here 
      // so we can show a better "Pending Activation" message if needed.
      const { data, error } = await supabase
        .from('events')
        .select('*, profiles(full_name)')
        .eq('slug', slug)
        .single();

      if (error || !data) {
        setLoading(false);
        return;
      }

      setEvent(data);
      setLoading(false);

      // Increment view count if paid
      if (data.is_paid) {
        await supabase.rpc('increment_view_count', { event_id: data.id });
      }
    };
    fetchEvent();
  }, [slug]);

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event.is_paid) {
      showError("This event is currently pending activation by the host.");
      return;
    }

    setIsSubmitting(true);
    
    const { data, error } = await supabase.from('rsvps').insert({
      event_id: event.id,
      guest_name: rsvpData.name,
      guest_phone: rsvpData.phone
    }).select().single();

    if (error) {
      showError('Failed to submit RSVP');
    } else {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#ffffff', '#000000']
      });
      showSuccess('RSVP submitted! Welcome to the guest list.');
      setSubmittedRsvp(data);
    }
    setIsSubmitting(false);
  };

  const shareOnWhatsApp = () => {
    const text = `You're invited to ${event.event_name}! Check out the details and RSVP here: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f0f] text-white">
      <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37] mb-4" />
      <p className="text-[10px] font-bold tracking-[0.5em] uppercase animate-pulse">Accessing Invitation...</p>
    </div>
  );

  // If event exists but isn't paid, show a "Pending" screen instead of "Not Found"
  if (event && !event.is_paid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f0f] text-white p-6 text-center">
        <div className="bg-white/5 p-12 rounded-[3rem] border border-white/10 max-w-md">
          <Sparkles className="w-12 h-12 text-[#D4AF37] mx-auto mb-8 opacity-20" />
          <h1 className="text-3xl font-serif italic mb-4">Awaiting Activation</h1>
          <p className="text-gray-500 mb-8 text-sm leading-relaxed">This event page is currently being refined by the host. Please check back shortly.</p>
          <Link to="/"><Button variant="outline" className="border-white/10 text-[10px] font-bold uppercase tracking-widest px-12 py-6">Return Home</Button></Link>
        </div>
      </div>
    );
  }

  if (!event) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f0f] text-white p-6 text-center">
      <div className="bg-white/5 p-12 rounded-[3rem] border border-white/10 max-w-md">
        <h1 className="text-3xl font-serif italic mb-4 text-[#e94560]">Invitation Expired</h1>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">The link you followed may be incorrect or the event has concluded.</p>
        <Link to="/"><Button className="bg-[#D4AF37] text-black rounded-none px-12 py-6 text-[10px] font-bold uppercase tracking-widest">Go Home</Button></Link>
      </div>
    </div>
  );

  const theme = event.theme || 'modern';
  const themeConfig = {
    modern: {
      bg: "bg-[#0a0a1a]",
      text: "text-white",
      accent: "text-[#e94560]",
      button: "bg-[#e94560] hover:bg-[#d43d56]",
      card: "bg-white/5 border-white/10 backdrop-blur-xl",
      rsvpCard: "bg-white text-[#0a0a1a]",
      font: "font-sans"
    },
    traditional: {
      bg: "bg-[#2d1b0d]",
      text: "text-[#fdfcf0]",
      accent: "text-[#D4AF37]",
      button: "bg-[#D4AF37] hover:bg-[#B8860B] text-black",
      card: "bg-white/5 border-[#D4AF37]/20 shadow-xl",
      rsvpCard: "bg-[#D4AF37] text-black",
      font: "font-serif"
    },
    elegant: {
      bg: "bg-white",
      text: "text-gray-900",
      accent: "text-black",
      button: "bg-black hover:bg-gray-800",
      card: "bg-gray-50 border-gray-100 shadow-lg",
      rsvpCard: "bg-white border-4 border-black text-black",
      font: "font-sans"
    }
  }[theme as 'modern' | 'traditional' | 'elegant'];

  return (
    <div className={`min-h-screen ${themeConfig.bg} ${themeConfig.text} ${themeConfig.font} transition-colors duration-700 overflow-x-hidden`}>
      {/* Hero Section */}
      <div className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5 }}
          src={event.photo_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80'} 
          className="w-full h-full object-cover grayscale"
          alt={event.event_name}
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-${themeConfig.bg.replace('bg-', '')} via-transparent to-transparent`} />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block">You Are Cordially Invited</span>
            <h1 className={`text-4xl sm:text-6xl md:text-8xl lg:text-[9rem] font-serif italic mb-8 md:mb-12 tracking-tight leading-[0.9]`}>
              {event.event_name}
            </h1>
            <div className="max-w-3xl mx-auto">
              <Countdown targetDate={event.event_date} />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-5 gap-12 md:gap-16">
          {/* Details Column */}
          <div className="md:col-span-3 space-y-12 md:space-y-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`${themeConfig.card} p-10 md:p-16 rounded-[3rem] border`}
            >
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-12 flex items-center gap-4">
                <Calendar className="w-4 h-4" /> The Particulars
              </h2>
              <div className="space-y-12">
                <div className="flex items-start gap-8 group">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#D4AF37]/10 transition-colors">
                    <MapPin className="text-[#D4AF37] w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-2">The Venue</p>
                    <p className="text-xl md:text-2xl font-light leading-relaxed">{event.venue}</p>
                  </div>
                </div>
                <div className="flex items-start gap-8 group">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#D4AF37]/10 transition-colors">
                    <MessageSquare className="text-[#D4AF37] w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-2">Host's Message</p>
                    <p className="text-xl md:text-2xl font-serif italic leading-relaxed opacity-80">"{event.message}"</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Photo Gallery Section */}
            {event.gallery_urls && event.gallery_urls.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`${themeConfig.card} p-10 md:p-16 rounded-[3rem] border`}
              >
                <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-12 flex items-center gap-4">
                  <ImageIcon className="w-4 h-4" /> The Gallery
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  {event.gallery_urls.map((url: string, i: number) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="aspect-square overflow-hidden border border-white/10"
                    >
                      <img src={url} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt={`Gallery ${i}`} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={shareOnWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase flex items-center justify-center gap-4 shadow-2xl shadow-[#25D366]/10"
              >
                <Share2 className="w-4 h-4" /> Share on WhatsApp
              </Button>
            </motion.div>
          </div>

          {/* RSVP Column */}
          <div className="md:col-span-2">
            <AnimatePresence mode="wait">
              {submittedRsvp ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="sticky top-32"
                >
                  <div className="text-center mb-12">
                    <div className="bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="text-green-500 w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-serif italic mb-2">You're on the list</h2>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Save your elite pass below</p>
                  </div>
                  
                  <DigitalInvite event={event} rsvpId={submittedRsvp.id} />
                  
                  <Button 
                    variant="ghost" 
                    onClick={() => setSubmittedRsvp(null)}
                    className="w-full mt-8 text-[8px] font-bold uppercase tracking-widest opacity-30 hover:opacity-100"
                  >
                    RSVP for another guest
                  </Button>
                </motion.div>
              ) : (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`${themeConfig.rsvpCard} p-10 md:p-16 rounded-[3rem] shadow-2xl sticky top-32 border border-black/5`}
                >
                  <div className="flex items-center gap-3 mb-8">
                    <Sparkles className="text-[#D4AF37] w-5 h-5" />
                    <h2 className="text-3xl font-serif italic tracking-tight">The Registry</h2>
                  </div>
                  <p className="opacity-60 mb-10 text-sm leading-relaxed">Confirm your attendance to secure your place at this exclusive gathering.</p>
                  
                  <form onSubmit={handleRSVP} className="space-y-8">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">Full Name</Label>
                      <Input 
                        id="name" 
                        required 
                        className="bg-black/5 border-none h-16 rounded-none text-lg px-6 font-light"
                        placeholder="e.g. Tunde Afolayan"
                        value={rsvpData.name}
                        onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">WhatsApp Number</Label>
                      <Input 
                        id="phone" 
                        required 
                        className="bg-black/5 border-none h-16 rounded-none text-lg px-6 font-light"
                        placeholder="08012345678"
                        value={rsvpData.phone}
                        onChange={(e) => setRsvpData({ ...rsvpData, phone: e.target.value })}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className={`w-full ${themeConfig.button} h-20 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase shadow-2xl transition-all hover:scale-105 active:scale-95`}
                    >
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