"use client";

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Countdown from '@/components/Countdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';
import { MapPin, Calendar, MessageSquare, Sparkles, CheckCircle2, Loader2, Camera, Download, ShieldCheck, RefreshCw, Users, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import DigitalInvite from '@/components/DigitalInvite';

const EventPage = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [rsvpData, setRsvpData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRsvp, setSubmittedRsvp] = useState<any>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchEvent();
      
      const channel = supabase
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
            if (payload.new.is_paid) {
              confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            }
          }
        )
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [slug]);

  const fetchEvent = async () => {
    if (!slug) return;
    setLoading(true);
    setErrorDetail(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .ilike('slug', slug.trim())
        .maybeSingle();

      if (error) {
        setErrorDetail(error.message);
      } else if (data) {
        setEvent(data);
        setIsHost(user?.id === data.host_id);
        
        if (data.is_paid) {
          supabase.rpc('increment_view_count', { event_id: data.id }).catch(() => {});
        }
      }
    } catch (err: any) {
      setErrorDetail(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !event) return;
    setUploadingPhoto(true);

    try {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${event.id}-${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('event-photos')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage.from('event-photos').getPublicUrl(fileName);
      
      // Update the gallery_urls array in the events table instead of a separate table
      const currentGallery = event.gallery_urls || [];
      const { error: updateError } = await supabase
        .from('events')
        .update({
          gallery_urls: [...currentGallery, publicUrl]
        })
        .eq('id', event.id);

      if (updateError) throw updateError;

      showSuccess('Photo added to the gallery.');
      fetchEvent(); // Refresh to show new photo
    } catch (err: any) {
      showError(err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event?.is_paid) {
      showError("This event is currently pending activation.");
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
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      showSuccess('Welcome to the guest list!');
      setSubmittedRsvp(data);
    }
    setIsSubmitting(false);
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
        <p className="text-gray-500 mb-8 leading-relaxed">
          The link you followed may be broken or the event has been removed. 
          Please verify the URL or contact the host.
        </p>
        {errorDetail && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-mono text-red-400 text-left overflow-x-auto">
            Error: {errorDetail}
          </div>
        )}
        <div className="flex flex-col gap-4">
          <Button onClick={() => fetchEvent()} variant="outline" className="border-white/10 text-white rounded-none py-6">
            <RefreshCw className="w-4 h-4 mr-2" /> Try Again
          </Button>
          <Link to="/"><Button variant="ghost" className="text-gray-500 hover:text-white">Return Home</Button></Link>
        </div>
      </motion.div>
    </div>
  );

  if (!event.is_paid && !isHost) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f0f] text-white p-6 text-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 p-12 rounded-[3rem] border border-white/10 max-w-md">
        <Sparkles className="w-12 h-12 text-[#D4AF37] mx-auto mb-8 opacity-20" />
        <h1 className="text-3xl font-serif italic mb-4 text-[#D4AF37]">Pending Activation</h1>
        <p className="text-gray-500 mb-10 text-sm leading-relaxed">
          The host is currently finalizing the details for <span className="text-white font-bold">"{event.event_name}"</span>. 
          This page will activate automatically once the masterpiece is ready.
        </p>
        <div className="flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] animate-pulse">
          <RefreshCw className="w-3 h-3 animate-spin" /> Waiting for Host...
        </div>
      </motion.div>
    </div>
  );

  const theme = event.theme || 'modern';
  const themeConfig = {
    modern: { bg: "bg-[#0a0a1a]", text: "text-white", accent: "text-[#e94560]", button: "bg-[#e94560] hover:bg-[#d43d56]", card: "bg-white/5 border-white/10 backdrop-blur-xl", rsvpCard: "bg-white text-[#0a0a1a]" },
    traditional: { bg: "bg-[#2d1b0d]", text: "text-[#fdfcf0]", accent: "text-[#D4AF37]", button: "bg-[#D4AF37] hover:bg-[#B8860B] text-black", card: "bg-white/5 border-[#D4AF37]/20 shadow-xl", rsvpCard: "bg-[#D4AF37] text-black" },
    elegant: { bg: "bg-white", text: "text-gray-900", accent: "text-black", button: "bg-black hover:bg-gray-800", card: "bg-gray-50 border-gray-100 shadow-lg", rsvpCard: "bg-white border-4 border-black text-black" },
    sahara: { bg: "bg-[#78350f]", text: "text-[#fef3c7]", accent: "text-[#fbbf24]", button: "bg-[#fbbf24] hover:bg-[#d97706] text-black", card: "bg-white/5 border-[#fbbf24]/20 backdrop-blur-xl", rsvpCard: "bg-[#fbbf24] text-black" },
    blush: { bg: "bg-[#be185d]", text: "text-[#fdf2f8]", accent: "text-[#fbcfe8]", button: "bg-[#fbcfe8] hover:bg-[#f9a8d4] text-black", card: "bg-white/5 border-[#fbcfe8]/20 backdrop-blur-xl", rsvpCard: "bg-[#fbcfe8] text-black" },
    amethyst: { bg: "bg-[#581c87]", text: "text-[#f5f3ff]", accent: "text-[#D4AF37]", button: "bg-[#D4AF37] hover:bg-[#B8860B] text-black", card: "bg-white/5 border-[#D4AF37]/20 backdrop-blur-xl", rsvpCard: "bg-[#D4AF37] text-black" },
    azure: { bg: "bg-[#1e3a8a]", text: "text-[#eff6ff]", accent: "text-[#93c5fd]", button: "bg-[#93c5fd] hover:bg-[#60a5fa] text-black", card: "bg-white/5 border-[#93c5fd]/20 backdrop-blur-xl", rsvpCard: "bg-[#93c5fd] text-black" }
  }[theme as string] || { bg: "bg-[#0a0a1a]", text: "text-white", accent: "text-[#e94560]", button: "bg-[#e94560] hover:bg-[#d43d56]", card: "bg-white/5 border-white/10 backdrop-blur-xl", rsvpCard: "bg-white text-[#0a0a1a]" };

  return (
    <div className={`min-h-screen ${themeConfig.bg} ${themeConfig.text} transition-colors duration-700 overflow-x-hidden`}>
      <div className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5 }}
          src={event.photo_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80'} 
          className="w-full h-full object-cover grayscale contrast-125"
          alt={event.event_name}
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-${themeConfig.bg.replace('bg-', '')} via-transparent to-transparent`} />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16 max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[#D4AF37] text-[8px] font-bold tracking-[0.5em] uppercase">HD Masterpiece Live</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif italic mb-8 tracking-tight leading-[0.9]">
              {event.event_name}
            </h1>
            <div className="max-w-3xl mx-auto">
              <Countdown targetDate={event.event_date} />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20">
        {!event.is_paid && isHost && (
          <div className="mb-16 p-8 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-center rounded-[2rem]">
            <Sparkles className="w-8 h-8 text-[#D4AF37] mx-auto mb-4" />
            <h3 className="text-xl font-serif italic mb-2">Preview Mode</h3>
            <p className="text-sm opacity-70">This page is currently pending activation. Guests will see a "Pending" screen until you complete payment.</p>
            <Link to={`/payment/${event.id}`} className="mt-6 inline-block">
              <Button className="bg-[#D4AF37] text-black rounded-none px-8 py-4 text-[8px] font-black uppercase tracking-widest">Activate Now</Button>
            </Link>
          </div>
        )}

        <div className="grid md:grid-cols-5 gap-12 md:gap-16">
          <div className="md:col-span-3 space-y-12 md:space-y-16">
            {(event.plan === 'Standard' || event.plan === 'Pro') && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-12 text-center">The Official Invitation</h2>
                <DigitalInvite event={event} />
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`${themeConfig.card} p-10 md:p-16 rounded-[3rem] border`}>
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

            {/* Gallery Section */}
            {event.gallery_urls && event.gallery_urls.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {event.gallery_urls.map((url: string, i: number) => (
                  <img key={i} src={url} className="w-full aspect-square object-cover rounded-2xl border border-white/10" alt={`Gallery ${i}`} />
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <AnimatePresence mode="wait">
              {submittedRsvp ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="sticky top-32">
                  <div className="text-center mb-12">
                    <div className="bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="text-green-500 w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-serif italic mb-2">You're on the list</h2>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Save your elite pass below</p>
                  </div>
                  <DigitalInvite event={event} rsvpId={submittedRsvp.id} />
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={`${themeConfig.rsvpCard} p-10 md:p-16 rounded-[3rem] shadow-2xl sticky top-32 border border-black/5`}>
                  <div className="flex items-center gap-3 mb-8">
                    <Sparkles className="text-[#D4AF37] w-5 h-5" />
                    <h2 className="text-3xl font-serif italic tracking-tight">The Registry</h2>
                  </div>
                  <form onSubmit={handleRSVP} className="space-y-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">Full Name</Label>
                      <Input required className="bg-black/5 border-none h-16 rounded-none text-lg px-6 font-light" placeholder="e.g. Tunde Afolayan" value={rsvpData.name} onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })} />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">WhatsApp Number</Label>
                      <Input required className="bg-black/5 border-none h-16 rounded-none text-lg px-6 font-light" placeholder="08012345678" value={rsvpData.phone} onChange={(e) => setRsvpData({ ...rsvpData, phone: e.target.value })} />
                    </div>
                    <Button type="submit" disabled={isSubmitting} className={`w-full ${themeConfig.button} h-20 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase shadow-2xl transition-all hover:scale-105 active:scale-95`}>
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