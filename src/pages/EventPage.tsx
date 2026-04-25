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
import { MapPin, Calendar, MessageSquare, Sparkles, CheckCircle2, Loader2, Navigation, Music, UserPlus, Quote, Wallet, Coins, Image as ImageIcon, Heart } from 'lucide-react';
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
  const [toastContent, setToastContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingToast, setIsSubmittingToast] = useState(false);
  const [submittedRsvp, setSubmittedRsvp] = useState<any>(null);
  const [liveToasts, setLiveToasts] = useState<any[]>([]);
  const [giftAmount, setGiftAmount] = useState('');
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

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

        const { data: toasts } = await supabase
          .from('toasts')
          .select('*')
          .eq('event_id', data.id)
          .eq('is_live', true)
          .order('created_at', { ascending: false });
        setLiveToasts(toasts || []);

        if (data.is_paid) {
          await supabase.rpc('increment_view_count', { event_id: data.id });
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

  const submitToast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toastContent.trim() || !submittedRsvp) return;
    setIsSubmittingToast(true);
    try {
      const { error } = await supabase.from('toasts').insert({
        event_id: event.id,
        guest_name: submittedRsvp.guest_name,
        content: toastContent
      });
      if (error) throw error;
      showSuccess('Your toast has been sent to the host.');
      setToastContent('');
    } catch (err: any) {
      showError(err.message);
    } finally {
      setIsSubmittingToast(false);
    }
  };

  const paystackConfig = {
    reference: (new Date()).getTime().toString(),
    email: submittedRsvp?.guest_phone ? `${submittedRsvp.guest_phone}@eventhub.ng` : "guest@eventhub.ng",
    amount: parseInt(giftAmount) * 100,
    publicKey: 'pk_test_8a5989e07b1762ec4037cc3318626f1e4fda67cb',
    metadata: {
      // Double-layering metadata for robustness
      event_id: event?.id,
      payment_type: "gift",
      guest_name: submittedRsvp?.guest_name || "Anonymous Guest",
      custom_fields: [
        { display_name: "Event ID", variable_name: "event_id", value: event?.id || "" },
        { display_name: "Guest Name", variable_name: "guest_name", value: submittedRsvp?.guest_name || "Anonymous Guest" },
        { display_name: "Payment Type", variable_name: "payment_type", value: "gift" }
      ]
    }
  };

  const initializeGiftPayment = usePaystackPayment(paystackConfig);

  const handleGiftSuccess = () => {
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: ['#D4AF37', '#ffffff'] });
    showSuccess(`You just sprayed ₦${parseInt(giftAmount).toLocaleString()}! The host has been notified.`);
    setGiftAmount('');
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" />
    </div>
  );

  if (!event) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-6">
      <h1 className="text-4xl font-serif italic mb-4">Event Not Found</h1>
      <p className="text-gray-500 mb-8">The invitation you are looking for does not exist or has been moved.</p>
      <Button onClick={() => window.location.href = '/'} className="bg-[#D4AF37] text-black rounded-none px-12 py-6">Return Home</Button>
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
  const gallery = event.gallery_urls || [];

  return (
    <div className={`min-h-screen ${config.bg} ${config.text} transition-colors duration-700 overflow-x-hidden`}>
      <AnimatePresence>
        {event.message && (
          <motion.div 
            initial={{ y: -100 }} 
            animate={{ y: 0 }} 
            exit={{ y: -100 }} 
            className="fixed top-0 left-0 right-0 z-[100] bg-[#D4AF37] text-black py-4 px-8 flex items-center justify-center gap-4 shadow-2xl"
          >
            <MessageSquare className="w-5 h-5 animate-bounce" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-center">{event.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[85vh] w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ duration: 1.5 }} 
          src={event.photo_url} 
          className="w-full h-full object-cover brightness-75" 
          alt="" 
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-${config.bg.replace('bg-', '')} via-transparent to-transparent`} />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16 max-w-6xl mx-auto text-center">
          <div className="max-w-3xl mx-auto scale-90 md:scale-100 mb-8">
            <Countdown targetDate={event.event_date} />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-24">
        <div className="grid md:grid-cols-5 gap-12 md:gap-20">
          <div className="md:col-span-3 space-y-16 md:space-y-24">
            {/* Logistics Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              className={`${config.card} p-8 md:p-16 rounded-[3rem] border`}
            >
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-12 flex items-center gap-4">
                <Calendar className="w-4 h-4" /> The Particulars
              </h2>
              <div className="space-y-12">
                <div className="flex items-start gap-8 group">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#D4AF37]/10 transition-colors shrink-0">
                    <Sparkles className="text-[#D4AF37] w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-2">The Celebration</p>
                    <h1 className="text-3xl md:text-5xl font-serif italic leading-tight">{event.event_name}</h1>
                  </div>
                </div>

                <div className="flex items-start gap-8 group">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#D4AF37]/10 transition-colors shrink-0">
                    <MapPin className="text-[#D4AF37] w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-2">The Venue</p>
                    <p className="text-xl md:text-3xl font-light leading-relaxed mb-4">{event.venue}</p>
                    {event.venue_map_url && (
                      <a 
                        href={event.venue_map_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#D4AF37] hover:opacity-70"
                      >
                        <Navigation size={12} className="fill-current" /> Open in Maps
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Gallery Section */}
            {gallery.length > 0 && (
              <div className="space-y-12">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] flex items-center gap-4">
                  <ImageIcon className="w-4 h-4" /> The Gallery
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
                  {gallery.map((url: string, i: number) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="aspect-square overflow-hidden border border-white/10 cursor-pointer"
                      onClick={() => { setCurrentMediaIndex(i); setLightboxOpen(true); }}
                    >
                      <img src={url} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Digital Spraying Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              className={`${config.card} p-8 md:p-16 rounded-[3rem] border relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/5 rounded-full -mr-24 -mt-24 blur-3xl" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-12 flex items-center gap-4">
                <Coins className="w-4 h-4" /> Digital Spraying
              </h2>
              <p className="text-xl md:text-2xl font-light leading-relaxed mb-12 text-gray-400">
                Honor the host with a digital cash gift. Your generosity will be recorded in the event's official ledger.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4AF37] font-serif text-2xl">₦</span>
                  <Input 
                    type="number" 
                    placeholder="Enter Amount" 
                    className="h-20 pl-14 bg-white/5 border-white/10 rounded-none text-2xl font-light focus:border-[#D4AF37]/50"
                    value={giftAmount}
                    onChange={(e) => setGiftAmount(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={() => {
                    if (!giftAmount || parseInt(giftAmount) < 500) {
                      showError("Minimum gift amount is ₦500");
                      return;
                    }
                    initializeGiftPayment({ onSuccess: handleGiftSuccess, onClose: () => showError("Payment cancelled") });
                  }}
                  className={`h-20 px-12 rounded-none text-[10px] font-bold tracking-[0.3em] uppercase ${config.button}`}
                >
                  Spray the Host
                </Button>
              </div>
              <p className="mt-6 text-[8px] text-gray-500 uppercase tracking-widest text-center sm:text-left">Secured by Paystack. Direct settlement to host.</p>
            </motion.div>

            {/* Toasts Section */}
            <div className="space-y-12">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] flex items-center gap-4">
                <Quote className="w-4 h-4" /> Digital Toasts
              </h2>
              
              {submittedRsvp && (
                <form onSubmit={submitToast} className="space-y-6 mb-12">
                  <Textarea 
                    placeholder="Leave a message for the host..."
                    className="min-h-[120px] bg-white/5 border-white/10 rounded-none text-lg font-light resize-none"
                    value={toastContent}
                    onChange={(e) => setToastContent(e.target.value)}
                  />
                  <Button 
                    type="submit" 
                    disabled={isSubmittingToast || !toastContent.trim()}
                    className={`w-full h-16 rounded-none text-[10px] font-bold tracking-[0.3em] uppercase ${config.button}`}
                  >
                    {isSubmittingToast ? <Loader2 className="animate-spin" /> : 'Send Toast'}
                  </Button>
                </form>
              )}

              <div className="grid gap-8">
                {liveToasts.map((toast) => (
                  <motion.div 
                    key={toast.id} 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    className={`${config.card} p-10 rounded-[2rem] border-l-4 border-l-[#D4AF37]`}
                  >
                    <p className="text-xl md:text-2xl font-serif italic mb-6">"{toast.content}"</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">— {toast.guest_name}</p>
                  </motion.div>
                ))}
                {liveToasts.length === 0 && (
                  <p className="text-center py-12 text-gray-500 text-[10px] font-bold uppercase tracking-widest">No public toasts yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar / RSVP Section */}
          <div className="md:col-span-2">
            <AnimatePresence mode="wait">
              {submittedRsvp ? (
                <motion.div 
                  key="success" 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className="sticky top-32 space-y-10"
                >
                  <div className="text-center mb-12">
                    <div className="bg-green-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
                      <CheckCircle2 className="text-green-500 w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-serif italic mb-3">You're on the list</h2>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Save your elite pass below</p>
                  </div>
                  <DigitalInvite event={event} rsvpId={submittedRsvp.id} guestName={submittedRsvp.guest_name} />
                </motion.div>
              ) : (
                <motion.div 
                  key="form" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  className={`${config.rsvpCard} p-10 md:p-16 rounded-[3.5rem] shadow-2xl sticky top-32 border border-black/5`}
                >
                  <div className="flex items-center gap-4 mb-10">
                    <Sparkles className="text-[#D4AF37] w-6 h-6" />
                    <h2 className="text-4xl font-serif italic tracking-tight">The Registry</h2>
                  </div>
                  <form onSubmit={handleRSVP} className="space-y-10">
                    <div className="space-y-4">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">Full Name</Label>
                      <Input 
                        required 
                        className="bg-black/5 border-none h-16 rounded-none text-xl px-6 font-light" 
                        placeholder="e.g. Tunde Afolayan" 
                        value={rsvpData.name} 
                        onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })} 
                      />
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">WhatsApp Number</Label>
                      <Input 
                        required 
                        className="bg-black/5 border-none h-16 rounded-none text-xl px-6 font-light" 
                        placeholder="08012345678" 
                        value={rsvpData.phone} 
                        onChange={(e) => setRsvpData({ ...rsvpData, phone: e.target.value })} 
                      />
                    </div>
                    <div className="flex items-center justify-between p-6 bg-black/5">
                      <div className="flex items-center gap-3">
                        <UserPlus size={16} className="text-[#D4AF37]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Bringing a Plus One?</span>
                      </div>
                      <Switch 
                        checked={rsvpData.hasPlusOne} 
                        onCheckedChange={(v) => setRsvpData({ ...rsvpData, hasPlusOne: v })} 
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className={`w-full ${config.button} h-24 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase shadow-2xl`}
                    >
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
        isOpen={lightboxOpen} 
        onClose={() => setLightboxOpen(false)} 
        mediaUrls={gallery} 
        currentIndex={currentMediaIndex} 
        onNavigate={setCurrentMediaIndex} 
      />
    </div>
  );
};

export default EventPage;