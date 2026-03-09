"use client";

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Countdown from '@/components/Countdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';
import { MapPin, Calendar, MessageSquare, Share2, Image as ImageIcon, Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

const EventPage = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpData, setRsvpData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    const { error } = await supabase.from('rsvps').insert({
      event_id: event.id,
      guest_name: rsvpData.name,
      guest_phone: rsvpData.phone
    });

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
      setRsvpData({ name: '', phone: '' });
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
        className="w-16 h-16 border-4 border-[#e94560] border-t-transparent rounded-full mb-4"
      />
      <p className="text-xl font-black tracking-widest animate-pulse">LOADING EVENT...</p>
    </div>
  );

  if (!event) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a1a] text-white p-6 text-center">
      <div className="bg-white/5 p-12 rounded-[3rem] border border-white/10 max-w-md">
        <h1 className="text-4xl font-black mb-4 text-[#e94560]">EVENT NOT FOUND</h1>
        <p className="text-gray-400 mb-8 text-lg">This event page might be inactive, pending payment, or the link is incorrect.</p>
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

  const hasGallery = (event.plan === 'Standard' || event.plan === 'Pro') && event.gallery_urls?.length > 0;

  return (
    <div className={`min-h-screen ${themeConfig.bg} ${themeConfig.text} ${themeConfig.font} transition-colors duration-700`}>
      {/* Hero Section */}
      <div className="relative h-[85vh] w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5 }}
          src={event.photo_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80'} 
          className="w-full h-full object-cover"
          alt={event.event_name}
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-${themeConfig.bg.replace('bg-', '')} via-transparent to-transparent`} />
        
        {/* Floating Elements for Modern Theme */}
        {theme === 'modern' && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-[#e94560]/20 rounded-full blur-[100px] animate-blob" />
            <div className="absolute bottom-[20%] right-[10%] w-64 h-64 bg-[#4ecca3]/20 rounded-full blur-[100px] animate-blob animation-delay-2000" />
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className={`text-6xl md:text-[10rem] font-black mb-12 tracking-tighter uppercase italic leading-[0.8] ${theme === 'traditional' ? 'font-serif' : ''}`}>
              {event.event_name}
            </h1>
            <div className="max-w-3xl mx-auto">
              <Countdown targetDate={event.event_date} />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-5 gap-16">
          {/* Details Column */}
          <div className="md:col-span-3 space-y-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`${themeConfig.card} p-12 rounded-[3rem] border`}
            >
              <h2 className="text-4xl font-black mb-12 flex items-center gap-4">
                <Calendar className={`${themeConfig.accent} w-10 h-10`} /> EVENT DETAILS
              </h2>
              <div className="space-y-12">
                <div className="flex items-start gap-6 group">
                  <div className={`${themeConfig.accent.replace('text-', 'bg-')}/10 p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                    <MapPin className={`${themeConfig.accent} w-6 h-6`} />
                  </div>
                  <div>
                    <p className="font-black text-2xl mb-2 uppercase tracking-tight">Location</p>
                    <p className="opacity-70 text-xl leading-relaxed">{event.venue}</p>
                  </div>
                </div>
                <div className="flex items-start gap-6 group">
                  <div className={`${themeConfig.accent.replace('text-', 'bg-')}/10 p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                    <MessageSquare className={`${themeConfig.accent} w-6 h-6`} />
                  </div>
                  <div>
                    <p className="font-black text-2xl mb-2 uppercase tracking-tight">Host's Message</p>
                    <p className="opacity-70 text-xl italic leading-relaxed">"{event.message}"</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Gallery Section */}
            {hasGallery && (
              <div className="space-y-8">
                <h2 className="text-4xl font-black flex items-center gap-4">
                  <ImageIcon className={`${themeConfig.accent} w-10 h-10`} /> PHOTO GALLERY
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  {event.gallery_urls.map((url: string, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl"
                    >
                      <img 
                        src={url} 
                        className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110" 
                        alt={`Gallery ${i}`} 
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={shareOnWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-12 rounded-[2.5rem] text-3xl font-black flex items-center justify-center gap-4 shadow-2xl shadow-[#25D366]/20"
              >
                <Share2 className="w-10 h-10" /> SHARE ON WHATSAPP
              </Button>
            </motion.div>
          </div>

          {/* RSVP Column */}
          <div className="md:col-span-2">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className={`${themeConfig.rsvpCard} p-12 rounded-[3rem] shadow-2xl sticky top-32 border border-black/5`}
            >
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className={`${theme === 'modern' ? 'text-[#e94560]' : 'text-current'} w-6 h-6`} />
                <h2 className="text-4xl font-black tracking-tighter">RSVP NOW</h2>
              </div>
              <p className="opacity-60 mb-10 text-lg font-medium">Confirm your attendance to help the host plan better!</p>
              
              <form onSubmit={handleRSVP} className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-xs font-black uppercase tracking-[0.2em] opacity-50">Full Name</Label>
                  <Input 
                    id="name" 
                    required 
                    className={`${theme === 'modern' ? 'bg-black/5' : 'bg-white/10'} border-none h-16 rounded-2xl text-xl px-6 font-bold`}
                    placeholder="e.g. Tunde Afolayan"
                    value={rsvpData.name}
                    onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-xs font-black uppercase tracking-[0.2em] opacity-50">WhatsApp Number</Label>
                  <Input 
                    id="phone" 
                    required 
                    className={`${theme === 'modern' ? 'bg-black/5' : 'bg-white/10'} border-none h-16 rounded-2xl text-xl px-6 font-bold`}
                    placeholder="08012345678"
                    value={rsvpData.phone}
                    onChange={(e) => setRsvpData({ ...rsvpData, phone: e.target.value })}
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full ${themeConfig.button} text-white h-20 rounded-2xl text-2xl font-black shadow-2xl transition-all hover:scale-105 active:scale-95`}
                >
                  {isSubmitting ? 'SUBMITTING...' : 'CONFIRM ATTENDANCE'}
                </Button>
              </form>

              <div className="mt-10 pt-8 border-t border-current/10 text-center">
                <p className="text-sm opacity-50 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                  <Heart className="w-4 h-4 fill-current" /> Built with Event Hub Nigeria
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5 -z-10" />
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl md:text-5xl font-black mb-10 leading-tight">WANT A STUNNING PAGE FOR YOUR OWN EVENT?</h3>
          <Link to="/">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button className={`${themeConfig.button} text-white px-16 py-10 rounded-full text-2xl font-black shadow-2xl`}>
                CREATE YOUR EVENT PAGE
              </Button>
            </motion.div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default EventPage;