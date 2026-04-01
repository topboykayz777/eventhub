"use client";

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Countdown from '@/components/Countdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';
import { MapPin, Calendar, MessageSquare, Share2, Sparkles, CheckCircle2, Image as ImageIcon, Loader2, Camera, Users, Heart, Download, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import DigitalInvite from '@/components/DigitalInvite';

const EventPage = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpData, setRsvpData] = useState({ name: '', phone: '', guestCount: 1 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRsvp, setSubmittedRsvp] = useState<any>(null);
  const [livePhotos, setLivePhotos] = useState<any[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [slug]);

  const fetchEvent = async () => {
    if (!slug) return;

    // Robust case-insensitive slug lookup
    const { data, error } = await supabase
      .from('events')
      .select('*, profiles(full_name)')
      .ilike('slug', slug)
      .maybeSingle();

    if (error) {
      console.error("[EventPage] Fetch error:", error);
      setLoading(false);
      return;
    }

    if (!data) {
      setLoading(false);
      return;
    }

    setEvent(data);
    fetchLivePhotos(data.id);
    setLoading(false);

    if (data.is_paid) {
      await supabase.rpc('increment_view_count', { event_id: data.id });
    }
  };

  const fetchLivePhotos = async (eventId: string) => {
    const { data } = await supabase
      .from('event_photos')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });
    setLivePhotos(data || []);
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
      
      await supabase.from('event_photos').insert({
        event_id: event.id,
        photo_url: publicUrl
      });

      showSuccess('HD Sharpness Processing Complete.');
      fetchLivePhotos(event.id);
    } catch (err: any) {
      showError(err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const downloadImage = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}_HD.png`;
    link.target = "_blank";
    link.click();
    showSuccess('HD Asset downloading...');
  };

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
      guest_phone: rsvpData.phone,
      guest_count: rsvpData.guestCount
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

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f0f] text-white">
      <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37] mb-4" />
      <p className="text-[10px] font-bold tracking-[0.5em] uppercase animate-pulse">Accessing Invitation...</p>
    </div>
  );

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
    modern: { bg: "bg-[#0a0a1a]", text: "text-white", accent: "text-[#e94560]", button: "bg-[#e94560] hover:bg-[#d43d56]", card: "bg-white/5 border-white/10 backdrop-blur-xl", rsvpCard: "bg-white text-[#0a0a1a]" },
    traditional: { bg: "bg-[#2d1b0d]", text: "text-[#fdfcf0]", accent: "text-[#D4AF37]", button: "bg-[#D4AF37] hover:bg-[#B8860B] text-black", card: "bg-white/5 border-[#D4AF37]/20 shadow-xl", rsvpCard: "bg-[#D4AF37] text-black" },
    elegant: { bg: "bg-white", text: "text-gray-900", accent: "text-black", button: "bg-black hover:bg-gray-800", card: "bg-gray-50 border-gray-100 shadow-lg", rsvpCard: "bg-white border-4 border-black text-black" },
    sahara: { bg: "bg-[#78350f]", text: "text-[#fef3c7]", accent: "text-[#fbbf24]", button: "bg-[#fbbf24] hover:bg-[#d97706] text-black", card: "bg-white/5 border-[#fbbf24]/20 backdrop-blur-xl", rsvpCard: "bg-[#fbbf24] text-black" },
    blush: { bg: "bg-[#be185d]", text: "text-[#fdf2f8]", accent: "text-[#fbcfe8]", button: "bg-[#fbcfe8] hover:bg-[#f9a8d4] text-black", card: "bg-white/5 border-[#fbcfe8]/20 backdrop-blur-xl", rsvpCard: "bg-[#fbcfe8] text-black" },
    amethyst: { bg: "bg-[#581c87]", text: "text-[#f5f3ff]", accent: "text-[#D4AF37]", button: "bg-[#D4AF37] hover:bg-[#B8860B] text-black", card: "bg-white/5 border-[#D4AF37]/20 backdrop-blur-xl", rsvpCard: "bg-[#D4AF37] text-black" },
    azure: { bg: "bg-[#1e3a8a]", text: "text-[#eff6ff]", accent: "text-[#93c5fd]", button: "bg-[#93c5fd] hover:bg-[#60a5fa] text-black", card: "bg-white/5 border-[#93c5fd]/20 backdrop-blur-xl", rsvpCard: "bg-[#93c5fd] text-black" }
  }[theme as string] || { bg: "bg-[#0a0a1a]", text: "text-white", accent: "text-[#e94560]", button: "bg-[#e94560] hover:bg-[#d43d56]", card: "bg-white/5 border-white/10 backdrop-blur-xl", rsvpCard: "bg-white text-[#0a0a1a]" };

  const hasGallery = event.plan === 'Standard' || event.plan === 'Pro';
  const hasDigitalInvite = event.plan === 'Standard' || event.plan === 'Pro';

  return (
    <div className={`min-h-screen ${themeConfig.bg} ${themeConfig.text} transition-colors duration-700 overflow-x-hidden`}>
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5 }}
          src={event.photo_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80'} 
          className="w-full h-full object-cover grayscale contrast-125"
          style={{ filter: 'contrast(1.2) brightness(0.8)' }}
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
        {!event.is_paid && (
          <div className="mb-16 p-8 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-center rounded-[2rem]">
            <Sparkles className="w-8 h-8 text-[#D4AF37] mx-auto mb-4" />
            <h3 className="text-xl font-serif italic mb-2">Preview Mode</h3>
            <p className="text-sm opacity-70">This page is currently pending activation. RSVPs are disabled for guests.</p>
          </div>
        )}

        <div className="grid md:grid-cols-5 gap-12 md:gap-16">
          <div className="md:col-span-3 space-y-12 md:space-y-16">
            {/* The Digital IV - Featured prominently for guests */}
            {hasDigitalInvite && (
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

            {/* Wall of Fame (Live Feed) - Only for Standard/Pro */}
            {hasGallery && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`${themeConfig.card} p-10 md:p-16 rounded-[3rem] border`}>
                <div className="flex justify-between items-center mb-12">
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] flex items-center gap-4">
                    <Camera className="w-4 h-4" /> Wall of Fame
                  </h2>
                  <Label htmlFor="live-upload" className="cursor-pointer bg-[#D4AF37] text-black px-6 py-3 text-[8px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
                    {uploadingPhoto ? 'Processing HD...' : 'Add HD Photo'}
                    <input id="live-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
                  </Label>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {livePhotos.map((photo, i) => (
                    <motion.div key={photo.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="aspect-square relative group overflow-hidden">
                      <img 
                        src={photo.photo_url} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 contrast-125" 
                        style={{ filter: 'contrast(1.1) brightness(0.9)' }}
                        alt="Live feed" 
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                        <div className="flex items-center gap-2 px-2 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                          <ShieldCheck size={10} className="text-green-500" />
                          <span className="text-[6px] font-black uppercase tracking-widest text-white">HD Sharp</span>
                        </div>
                        <button 
                          onClick={() => downloadImage(photo.photo_url, `Event_Photo_${i}`)}
                          className="p-3 bg-[#D4AF37] rounded-full text-black hover:scale-110 transition-transform"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  {livePhotos.length === 0 && (
                    <div className="col-span-full py-20 text-center border border-dashed border-white/10">
                      <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-gray-500">Be the first to capture a moment.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* RSVP Column */}
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
                  {hasDigitalInvite && <DigitalInvite event={event} rsvpId={submittedRsvp.id} />}
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
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">Number of Guests</Label>
                      <div className="flex items-center gap-4 bg-black/5 p-2">
                        <Users className="ml-4 text-gray-400 w-5 h-5" />
                        <Input type="number" min="1" max="10" required className="bg-transparent border-none h-12 text-lg font-light" value={rsvpData.guestCount} onChange={(e) => setRsvpData({ ...rsvpData, guestCount: parseInt(e.target.value) })} />
                      </div>
                    </div>
                    <Button type="submit" disabled={isSubmitting || !event.is_paid} className={`w-full ${themeConfig.button} h-20 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase shadow-2xl transition-all hover:scale-105 active:scale-95`}>
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