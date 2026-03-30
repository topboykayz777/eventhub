"use client";

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Countdown from '@/components/Countdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';
import { MapPin, Calendar, MessageSquare, Share2, Sparkles, CheckCircle2 } from 'lucide-react';
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
      const { data, error } = await supabase
        .from('events')
        .select('*, profiles(full_name)')
        .eq('slug', slug)
        .eq('is_paid', true)
        .single();

      if (error) {
        setLoading(false);
        return;
      }

      setEvent(data);
      setLoading(false);

      // Increment view count
      await supabase.rpc('increment_view_count', { event_id: data.id });
    };
    fetchEvent();
  }, [slug]);

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
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
        colors: ['#e94560', '#4ecca3', '#ffffff']
      });
      showSuccess('RSVP submitted! See you there.');
      setSubmittedRsvp(data);
    }
    setIsSubmitting(false);
  };

  const shareOnWhatsApp = () => {
    const text = `You're invited to ${event.event_name}! Check out the details and RSVP here: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a1a] text-white">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-[#e94560] border-t-transparent rounded-full mb-4"
      />
      <p className="text-sm font-black tracking-widest animate-pulse">LOADING EVENT...</p>
    </div>
  );

  if (!event) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a1a] text-white p-6 text-center">
      <div className="bg-white/5 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-white/10 max-w-md">
        <h1 className="text-3xl md:text-4xl font-black mb-4 text-[#e94560]">EVENT NOT FOUND</h1>
        <p className="text-gray-400 mb-8 text-base md:text-lg">This event page might be inactive, pending payment, or the link is incorrect.</p>
        <Link to="/"><Button className="bg-[#e94560] rounded-2xl px-12 py-6 text-lg font-black">GO HOME</Button></Link>
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
      bg: "bg-[#fdfcf0]",
      text: "text-[#5d4037]",
      accent: "text-[#b8860b]",
      button: "bg-[#b8860b] hover:bg-[#9a700a]",
      card: "bg-white border-[#b8860b]/20 shadow-xl",
      rsvpCard: "bg-[#5d4037] text-white",
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
          className="w-full h-full object-cover"
          alt={event.event_name}
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-${themeConfig.bg.replace('bg-', '')} via-transparent to-transparent`} />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className={`text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black mb-8 md:mb-12 tracking-tighter uppercase italic leading-[0.9] ${theme === 'traditional' ? 'font-serif' : ''}`}>
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
              className={`${themeConfig.card} p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border`}
            >
              <h2 className="text-2xl md:text-4xl font-black mb-8 md:mb-12 flex items-center gap-4">
                <Calendar className={`${themeConfig.accent} w-8 h-8 md:w-10 md:h-10`} /> EVENT DETAILS
              </h2>
              <div className="space-y-8 md:space-y-12">
                <div className="flex items-start gap-4 md:gap-6 group">
                  <div className={`${themeConfig.accent.replace('text-', 'bg-')}/10 p-3 md:p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                    <MapPin className={`${themeConfig.accent} w-5 h-5 md:w-6 md:h-6`} />
                  </div>
                  <div>
                    <p className="font-black text-xl md:text-2xl mb-1 md:mb-2 uppercase tracking-tight">Location</p>
                    <p className="opacity-70 text-lg md:text-xl leading-relaxed">{event.venue}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 md:gap-6 group">
                  <div className={`${themeConfig.accent.replace('text-', 'bg-')}/10 p-3 md:p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                    <MessageSquare className={`${themeConfig.accent} w-5 h-5 md:w-6 md:h-6`} />
                  </div>
                  <div>
                    <p className="font-black text-xl md:text-2xl mb-1 md:mb-2 uppercase tracking-tight">Host's Message</p>
                    <p className="opacity-70 text-lg md:text-xl italic leading-relaxed">"{event.message}"</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={shareOnWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-8 md:py-12 rounded-[2rem] md:rounded-[2.5rem] text-xl md:text-3xl font-black flex items-center justify-center gap-4 shadow-2xl shadow-[#25D366]/20"
              >
                <Share2 className="w-6 h-6 md:w-10 md:h-10" /> SHARE ON WHATSAPP
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
                  className={`${themeConfig.rsvpCard} p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-2xl text-center`}
                >
                  <div className="bg-green-500/10 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="text-green-500 w-8 h-8 md:w-10 md:h-10" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black mb-4">YOU'RE ON THE LIST!</h2>
                  <p className="opacity-60 mb-8 text-sm md:text-base">Screenshot your entry pass below to show at the door.</p>
                  
                  <DigitalInvite event={event} rsvpId={submittedRsvp.id} />
                  
                  <Button 
                    variant="ghost" 
                    onClick={() => setSubmittedRsvp(null)}
                    className="mt-8 text-[10px] font-bold uppercase tracking-widest opacity-50 hover:opacity-100"
                  >
                    RSVP for another guest
                  </Button>
                </motion.div>
              ) : (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`${themeConfig.rsvpCard} p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-2xl sticky top-32 border border-black/5`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className={`${theme === 'modern' ? 'text-[#e94560]' : 'text-current'} w-5 h-5 md:w-6 md:h-6`} />
                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter">RSVP NOW</h2>
                  </div>
                  <p className="opacity-60 mb-8 md:mb-10 text-base md:text-lg font-medium">Confirm your attendance to help the host plan better!</p>
                  
                  <form onSubmit={handleRSVP} className="space-y-6 md:space-y-8">
                    <div className="space-y-2 md:space-y-3">
                      <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Full Name</Label>
                      <Input 
                        id="name" 
                        required 
                        className={`${theme === 'modern' ? 'bg-black/5' : 'bg-white/10'} border-none h-14 md:h-16 rounded-2xl text-lg md:text-xl px-6 font-bold`}
                        placeholder="e.g. Tunde Afolayan"
                        value={rsvpData.name}
                        onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 md:space-y-3">
                      <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">WhatsApp Number</Label>
                      <Input 
                        id="phone" 
                        required 
                        className={`${theme === 'modern' ? 'bg-black/5' : 'bg-white/10'} border-none h-14 md:h-16 rounded-2xl text-lg md:text-xl px-6 font-bold`}
                        placeholder="08012345678"
                        value={rsvpData.phone}
                        onChange={(e) => setRsvpData({ ...rsvpData, phone: e.target.value })}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className={`w-full ${themeConfig.button} text-white h-16 md:h-20 rounded-2xl text-xl md:text-2xl font-black shadow-2xl transition-all hover:scale-105 active:scale-95`}
                    >
                      {isSubmitting ? 'SUBMITTING...' : 'CONFIRM ATTENDANCE'}
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