"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Countdown from '@/components/Countdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { showSuccess, showError } from '@/utils/toast';
import { MapPin, Calendar, MessageSquare, Sparkles, CheckCircle2, Loader2, Navigation, Music, UserPlus, Quote, Wallet, Coins, Image as ImageIcon, Heart, Camera, Share2, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import DigitalInvite from '@/components/DigitalInvite';
import MediaLightbox from '@/components/MediaLightbox';
import GlassCard from '@/components/ui/GlassCard';
import { usePaystackPayment } from 'react-paystack';

const EventPage = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpData, setRsvpData] = useState({ name: '', phone: '', songRequest: '', hasPlusOne: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRsvp, setSubmittedRsvp] = useState<any>(null);
  const [giftAmount, setGiftAmount] = useState('');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (slug) fetchEvent();
  }, [slug]);

  const fetchEvent = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .ilike('slug', slug.trim())
        .maybeSingle();

      if (data) {
        setEvent(data);
        const savedRsvpId = localStorage.getItem(`eventhub_rsvp_${data.id}`);
        if (savedRsvpId) {
          const { data: rsvp } = await supabase.from('rsvps').select('*').eq('id', savedRsvpId).maybeSingle();
          if (rsvp) setSubmittedRsvp(rsvp);
        }
      }
    } catch (err: any) {
      console.error(err.message);
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
      const { data, error } = await supabase.from('rsvps').insert({
        event_id: event.id,
        guest_name: rsvpData.name,
        guest_phone: rsvpData.phone,
        song_request: rsvpData.songRequest,
        has_plus_one: rsvpData.hasPlusOne
      }).select('*').single();

      if (error) throw error;

      localStorage.setItem(`eventhub_rsvp_${event.id}`, data.id);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      showSuccess('Welcome to the guest list!');
      setSubmittedRsvp(data);
    } catch (err: any) {
      showError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGiftSuccess = () => {
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: ['#D4AF37', '#ffffff'] });
    showSuccess(`Thank you for spraying! The host has been notified.`);
    setGiftAmount('');
  };

  const paystackConfig = {
    reference: (new Date()).getTime().toString(),
    email: submittedRsvp?.guest_phone ? `${submittedRsvp.guest_phone}@eventhub.ng` : "guest@eventhub.ng",
    amount: parseInt(giftAmount) * 100,
    publicKey: 'pk_test_8a5989e07b1762ec4037cc3318626f1e4fda67cb',
    metadata: {
      custom_fields: [
        { display_name: "Event ID", variable_name: "event_id", value: event?.id || "" },
        { display_name: "Payment Type", variable_name: "payment_type", value: "gift" },
        { display_name: "Guest Name", variable_name: "guest_name", value: submittedRsvp?.guest_name || "Anonymous" }
      ]
    }
  };

  const initializeGiftPayment = usePaystackPayment(paystackConfig);

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" /></div>;
  if (!event) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Event not found.</div>;

  const isEventOver = new Date(event.event_date) < new Date();
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
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[85vh] w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ duration: 1.5 }} 
          src={event.photo_url} 
          className={`w-full h-full object-cover ${isEventOver ? 'grayscale' : 'brightness-75'}`} 
          alt="" 
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-${config.bg.replace('bg-', '')} via-transparent to-transparent`} />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16 max-w-6xl mx-auto text-center">
          {!isEventOver ? (
            <div className="max-w-3xl mx-auto scale-90 md:scale-100 mb-8">
              <Countdown targetDate={event.event_date} />
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
              <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">The Celebration has Concluded</span>
              <h1 className="text-4xl md:text-7xl font-serif italic mb-4">Thank You for <br /> <span className="text-[#D4AF37]">Celebrating</span> With Us</h1>
            </motion.div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-24">
        <div className="grid md:grid-cols-5 gap-12 md:gap-20">
          <div className="md:col-span-3 space-y-16 md:space-y-24">
            {/* Event Details */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`${config.card} p-8 md:p-16 rounded-[3rem] border`}>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-12 flex items-center gap-4"><Calendar className="w-4 h-4" /> The Particulars</h2>
              <div className="space-y-12">
                <div className="flex items-start gap-8 group">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#D4AF37]/10 transition-colors shrink-0"><Sparkles className="text-[#D4AF37] w-6 h-6" /></div>
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-2">The Celebration</p>
                    <h1 className="text-3xl md:text-5xl font-serif italic leading-tight">{event.event_name}</h1>
                  </div>
                </div>
                <div className="flex items-start gap-8 group">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#D4AF37]/10 transition-colors shrink-0"><MapPin className="text-[#D4AF37] w-6 h-6" /></div>
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-2">The Venue</p>
                    <p className="text-xl md:text-3xl font-light leading-relaxed mb-4">{event.venue}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Host Message */}
            {event.message && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative">
                <Quote className="absolute -top-8 -left-8 w-16 h-16 text-[#D4AF37]/10" />
                <div className={`${config.card} p-10 md:p-16 rounded-[3rem] border italic text-xl md:text-3xl font-light leading-relaxed text-center`}>
                  "{event.message}"
                </div>
              </motion.div>
            )}

            {/* Memory Wall / Gallery */}
            {event.gallery_urls && event.gallery_urls.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="flex justify-between items-end mb-12">
                  <div>
                    <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.4em] uppercase mb-2 block">The Memory Wall</span>
                    <h2 className="text-3xl md:text-5xl font-serif italic">Captured <span className="text-[#D4AF37]">Moments</span></h2>
                  </div>
                  <ImageIcon className="text-gray-600 w-8 h-8" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {event.gallery_urls.map((url: string, i: number) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.02 }}
                      onClick={() => { setLightboxIndex(i); setIsLightboxOpen(true); }}
                      className="aspect-[4/5] overflow-hidden border border-white/10 cursor-pointer group"
                    >
                      <img src={url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="md:col-span-2">
            <AnimatePresence mode="wait">
              {isEventOver ? (
                <motion.div key="post-event" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="sticky top-32 space-y-10">
                  <GlassCard className={`${config.card} p-10 md:p-16 rounded-[3.5rem] border text-center`}>
                    <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-8">
                      <Heart className="text-[#D4AF37] w-10 h-10 fill-current" />
                    </div>
                    <h3 className="text-2xl font-serif italic mb-6">A Legacy of Love</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-10">
                      The celebration has concluded, but the memories remain. Thank you to everyone who joined us and made this day unforgettable.
                    </p>
                    <div className="pt-8 border-t border-white/5">
                      <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-gray-600 mb-4">Share the Memories</p>
                      <div className="flex justify-center gap-4">
                        <Button variant="outline" className="rounded-full w-12 h-12 p-0 border-white/10 hover:bg-[#D4AF37] hover:text-black transition-all">
                          <Share2 size={18} />
                        </Button>
                        <Button variant="outline" className="rounded-full w-12 h-12 p-0 border-white/10 hover:bg-[#D4AF37] hover:text-black transition-all">
                          <Camera size={18} />
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ) : submittedRsvp ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="sticky top-32 space-y-10">
                  <DigitalInvite event={event} rsvpId={submittedRsvp.id} guestName={submittedRsvp.guest_name} />
                  
                  {/* Digital Spraying for RSVP'd guests */}
                  <GlassCard className={`${config.card} p-10 rounded-[2.5rem] border`}>
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-8 flex items-center gap-4"><Coins className="w-4 h-4" /> Digital Spraying</h2>
                    <div className="space-y-6">
                      <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4AF37] font-serif text-xl">₦</span>
                        <Input type="number" placeholder="Amount" className="h-16 pl-12 bg-white/5 border-white/10 rounded-none text-lg font-light" value={giftAmount} onChange={(e) => setGiftAmount(e.target.value)} />
                      </div>
                      <Button 
                        onClick={() => {
                          if (!giftAmount || parseInt(giftAmount) < 100) {
                            showError("Minimum spray is ₦100");
                            return;
                          }
                          initializeGiftPayment({ onSuccess: handleGiftSuccess, onClose: () => {} });
                        }} 
                        className={`w-full h-16 rounded-none text-[10px] font-bold tracking-[0.3em] uppercase ${config.button}`}
                      >
                        Spray the Host
                      </Button>
                    </div>
                  </GlassCard>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={`${config.rsvpCard} p-10 md:p-16 rounded-[3.5rem] shadow-2xl sticky top-32 border border-black/5`}>
                  <h2 className="text-4xl font-serif italic tracking-tight mb-10">The Registry</h2>
                  <form onSubmit={handleRSVP} className="space-y-10">
                    <div className="space-y-2">
                      <Label className="text-[8px] font-bold uppercase tracking-widest opacity-50">Full Name</Label>
                      <Input required className="bg-black/5 border-none h-16 rounded-none text-xl px-6" placeholder="e.g. Chidi Benson" value={rsvpData.name} onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[8px] font-bold uppercase tracking-widest opacity-50">WhatsApp Number</Label>
                      <Input required className="bg-black/5 border-none h-16 rounded-none text-xl px-6" placeholder="080..." value={rsvpData.phone} onChange={(e) => setRsvpData({ ...rsvpData, phone: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[8px] font-bold uppercase tracking-widest opacity-50">Song Request (Optional)</Label>
                      <Input className="bg-black/5 border-none h-16 rounded-none text-xl px-6" placeholder="Your favorite vibe..." value={rsvpData.songRequest} onChange={(e) => setRsvpData({ ...rsvpData, songRequest: e.target.value })} />
                    </div>
                    <div className="flex items-center justify-between p-6 bg-black/5">
                      <Label className="text-[10px] font-bold uppercase tracking-widest">Bringing a Plus One?</Label>
                      <Switch checked={rsvpData.hasPlusOne} onCheckedChange={(v) => setRsvpData({ ...rsvpData, hasPlusOne: v })} />
                    </div>
                    <Button type="submit" disabled={isSubmitting} className={`w-full ${config.button} h-24 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase shadow-2xl`}>
                      {isSubmitting ? <Loader2 className="animate-spin" /> : 'Confirm Attendance'}
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <MediaLightbox 
        isOpen={isLightboxOpen} 
        onClose={() => setIsLightboxOpen(false)} 
        mediaUrls={event.gallery_urls || []} 
        currentIndex={lightboxIndex} 
        onNavigate={setLightboxIndex} 
      />
    </div>
  );
};

export default EventPage;