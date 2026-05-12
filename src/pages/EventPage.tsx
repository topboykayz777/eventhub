"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Countdown from '@/components/Countdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { showSuccess, showError } from '@/utils/toast';
import { MapPin, Calendar, Sparkles, Loader2, Navigation, Music, UserPlus, Quote, Coins, Image as ImageIcon, Heart, Camera, Share2, ExternalLink, Bookmark, Users, CheckCircle2, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import DigitalInvite from '@/components/DigitalInvite';
import MediaLightbox from '@/components/MediaLightbox';
import GlassCard from '@/components/ui/GlassCard';

const EventPage = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpData, setRsvpData] = useState({ name: '', phone: '', songRequest: '', hasPlusOne: false, plusOneName: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRsvps, setSubmittedRsvps] = useState<any[]>([]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    if (slug) fetchEvent();
  }, [slug]);

  const fetchEvent = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, event_name, event_date, venue, venue_map_url, message, theme, photo_url, gallery_urls, is_paid, is_concluded, slug')
        .ilike('slug', slug.trim())
        .maybeSingle();

      if (data) {
        setEvent(data);
        const savedRsvpIds = localStorage.getItem(`eventhub_rsvps_${data.id}`);
        if (savedRsvpIds) {
          const ids = JSON.parse(savedRsvpIds);
          const { data: rsvps } = await supabase.from('rsvps').select('*').in('id', ids);
          if (rsvps && rsvps.length > 0) setSubmittedRsvps(rsvps);
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
    if (!event?.is_paid) { showError("This event is currently pending activation."); return; }
    if (rsvpData.hasPlusOne && !rsvpData.plusOneName) { showError("Please provide your plus one's name."); return; }

    setIsSubmitting(true);
    try {
      const rsvpEntries = [{ event_id: event.id, guest_name: rsvpData.name, guest_phone: rsvpData.phone, song_request: rsvpData.songRequest, has_plus_one: rsvpData.hasPlusOne }];
      if (rsvpData.hasPlusOne) rsvpEntries.push({ event_id: event.id, guest_name: rsvpData.plusOneName, guest_phone: rsvpData.phone, song_request: rsvpData.songRequest, has_plus_one: false });

      const { data, error } = await supabase.from('rsvps').insert(rsvpEntries).select('*');
      if (error) throw error;

      localStorage.setItem(`eventhub_rsvps_${event.id}`, JSON.stringify(data.map(r => r.id)));
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      showSuccess('Welcome to the guest list!');
      setSubmittedRsvps(data);
    } catch (err: any) {
      showError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" /></div>;
  if (!event) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white p-4"><div className="text-center"><h2 className="text-2xl font-serif italic mb-4">Event Not Found</h2></div></div>;

  const isConcluded = event.is_concluded || (new Date(event.event_date).getTime() + 86400000 < Date.now());
  const theme = event.theme || 'modern';
  
  const themeConfigs: Record<string, any> = {
    modern: { bg: "bg-[#050505]", text: "text-white", accent: "text-[#D4AF37]", button: "bg-[#D4AF37] text-black", card: "bg-white/5 border-white/10", rsvpCard: "bg-white text-black" },
    traditional: { bg: "bg-[#064e3b]", text: "text-[#fdfcf0]", accent: "text-[#D4AF37]", button: "bg-[#D4AF37] text-black", card: "bg-white/5 border-[#D4AF37]/20", rsvpCard: "bg-[#D4AF37] text-black" },
    elegant: { bg: "bg-white", text: "text-gray-900", accent: "text-black", button: "bg-black text-white", card: "bg-gray-50 border-gray-100", rsvpCard: "bg-white border-4 border-black text-black" },
    sahara: { bg: "bg-[#78350f]", text: "text-[#fef3c7]", accent: "text-[#fbbf24]", button: "bg-[#fbbf24] text-black", card: "bg-white/5 border-[#fbbf24]/20", rsvpCard: "bg-[#fbbf24] text-black" },
    velvet: { bg: "bg-[#2e1065]", text: "text-[#f5f3ff]", accent: "text-[#D4AF37]", button: "bg-[#D4AF37] text-black", card: "bg-white/5 border-[#D4AF37]/20", rsvpCard: "bg-[#D4AF37] text-black" },
    garden: { bg: "bg-[#064e3b]", text: "text-[#ecfdf5]", accent: "text-[#10b981]", button: "bg-[#10b981] text-white", card: "bg-white/5 border-[#10b981]/20", rsvpCard: "bg-[#10b981] text-white" },
    oceanic: { bg: "bg-[#1e3a8a]", text: "text-[#eff6ff]", accent: "text-[#93c5fd]", button: "bg-[#93c5fd] text-black", card: "bg-white/5 border-[#93c5fd]/20", rsvpCard: "bg-[#93c5fd] text-black" },
    rose: { bg: "bg-[#831843]", text: "text-[#fdf2f8]", accent: "text-[#fbcfe8]", button: "bg-[#fbcfe8] text-black", card: "bg-white/5 border-[#fbcfe8]/20", rsvpCard: "bg-[#fbcfe8] text-black" },
    earth: { bg: "bg-[#431407]", text: "text-[#fff7ed]", accent: "text-[#fb923c]", button: "bg-[#fb923c] text-white", card: "bg-white/5 border-[#fb923c]/20", rsvpCard: "bg-[#fb923c] text-white" },
    silver: { bg: "bg-[#1f2937]", text: "text-[#f9fafb]", accent: "text-[#9ca3af]", button: "bg-[#9ca3af] text-white", card: "bg-white/5 border-[#9ca3af]/20", rsvpCard: "bg-[#9ca3af] text-white" },
    dynasty: { bg: "bg-[#7f1d1d]", text: "text-[#fef2f2]", accent: "text-[#D4AF37]", button: "bg-[#D4AF37] text-black", card: "bg-white/5 border-[#D4AF37]/20", rsvpCard: "bg-[#D4AF37] text-black" },
    vintage: { bg: "bg-[#fef3c7]", text: "text-[#451a03]", accent: "text-[#92400e]", button: "bg-[#92400e] text-white", card: "bg-white/10 border-[#92400e]/20", rsvpCard: "bg-[#92400e] text-white" },
    onyx: { bg: "bg-[#1a1a1a]", text: "text-white", accent: "text-[#D4AF37]", button: "bg-[#D4AF37] text-black", card: "bg-white/5 border-[#D4AF37]/30", rsvpCard: "bg-black border border-[#D4AF37] text-white" },
    champagne: { bg: "bg-[#fdf2f8]", text: "text-[#831843]", accent: "text-[#be185d]", button: "bg-[#be185d] text-white", card: "bg-white border-[#be185d]/10", rsvpCard: "bg-white border-2 border-[#be185d] text-[#831843]" },
    pearl: { bg: "bg-[#0f172a]", text: "text-[#f8fafc]", accent: "text-[#38bdf8]", button: "bg-[#38bdf8] text-black", card: "bg-white/5 border-[#38bdf8]/20", rsvpCard: "bg-[#38bdf8] text-black" },
    tuscan: { bg: "bg-[#fefce8]", text: "text-[#854d0e]", accent: "text-[#ca8a04]", button: "bg-[#ca8a04] text-white", card: "bg-white border-[#ca8a04]/10", rsvpCard: "bg-[#ca8a04] text-white" },
    frost: { bg: "bg-[#f0f9ff]", text: "text-[#075985]", accent: "text-[#0ea5e9]", button: "bg-[#0ea5e9] text-white", card: "bg-white border-[#0ea5e9]/10", rsvpCard: "bg-white border-2 border-[#0ea5e9] text-[#075985]" },
    magenta: { bg: "bg-[#fdf2f8]", text: "text-[#be185d]", accent: "text-[#db2777]", button: "bg-[#db2777] text-white", card: "bg-white border-[#db2777]/10", rsvpCard: "bg-[#db2777] text-white" },
    jade: { bg: "bg-[#f0fdf4]", text: "text-[#166534]", accent: "text-[#15803d]", button: "bg-[#15803d] text-white", card: "bg-white border-[#15803d]/10", rsvpCard: "bg-[#15803d] text-white" },
    saffron: { bg: "bg-[#fff7ed]", text: "text-[#9a3412]", accent: "text-[#ea580c]", button: "bg-[#ea580c] text-white", card: "bg-white border-[#ea580c]/10", rsvpCard: "bg-[#ea580c] text-white" },
    slate: { bg: "bg-[#f8fafc]", text: "text-[#334155]", accent: "text-[#475569]", button: "bg-[#475569] text-white", card: "bg-white border-[#475569]/10", rsvpCard: "bg-[#475569] text-white" },
    lavender: { bg: "bg-[#f5f3ff]", text: "text-[#5b21b6]", accent: "text-[#7c3aed]", button: "bg-[#7c3aed] text-white", card: "bg-white border-[#7c3aed]/10", rsvpCard: "bg-[#7c3aed] text-white" },
    ruby: { bg: "bg-[#fff1f2]", text: "text-[#9f1239]", accent: "text-[#e11d48]", button: "bg-[#e11d48] text-white", card: "bg-white border-[#e11d48]/10", rsvpCard: "bg-[#e11d48] text-white" },
    golden: { bg: "bg-[#fffbeb]", text: "text-[#854d0e]", accent: "text-[#d97706]", button: "bg-[#d97706] text-white", card: "bg-white border-[#d97706]/10", rsvpCard: "bg-[#d97706] text-white" },
    birch: { bg: "bg-[#f9fafb]", text: "text-[#374151]", accent: "text-[#4b5563]", button: "bg-[#4b5563] text-white", card: "bg-white border-[#4b5563]/10", rsvpCard: "bg-[#4b5563] text-white" },
    bronze: { bg: "bg-[#fff7ed]", text: "text-[#7c2d12]", accent: "text-[#9a3412]", button: "bg-[#9a3412] text-white", card: "bg-white border-[#9a3412]/10", rsvpCard: "bg-[#9a3412] text-white" },
    plum: { bg: "bg-[#faf5ff]", text: "text-[#6b21a8]", accent: "text-[#9333ea]", button: "bg-[#9333ea] text-white", card: "bg-white border-[#9333ea]/10", rsvpCard: "bg-[#9333ea] text-white" },
    teal: { bg: "bg-[#f0fdfa]", text: "text-[#115e59]", accent: "text-[#0d9488]", button: "bg-[#0d9488] text-white", card: "bg-white border-[#0d9488]/10", rsvpCard: "bg-[#0d9488] text-white" },
    charcoal: { bg: "bg-[#111827]", text: "text-white", accent: "text-[#f43f5e]", button: "bg-[#f43f5e] text-white", card: "bg-white/5 border-[#f43f5e]/20", rsvpCard: "bg-[#f43f5e] text-white" },
    sand: { bg: "bg-[#fafaf9]", text: "text-[#44403c]", accent: "text-[#78716c]", button: "bg-[#78716c] text-white", card: "bg-white border-[#78716c]/10", rsvpCard: "bg-[#78716c] text-white" },
    forest: { bg: "bg-[#022c22]", text: "text-[#ecfdf5]", accent: "text-[#10b981]", button: "bg-[#10b981] text-white", card: "bg-white/5 border-[#10b981]/20", rsvpCard: "bg-[#10b981] text-white" },
    ember: { bg: "bg-[#450a0a]", text: "text-[#fef2f2]", accent: "text-[#ef4444]", button: "bg-[#ef4444] text-white", card: "bg-white/5 border-[#ef4444]/20", rsvpCard: "bg-[#ef4444] text-white" },
    blossom: { bg: "bg-[#fff1f2]", text: "text-[#9f1239]", accent: "text-[#fb7185]", button: "bg-[#fb7185] text-white", card: "bg-white border-[#fb7185]/10", rsvpCard: "bg-[#fb7185] text-white" },
    solstice: { bg: "bg-[#1e1b4b]", text: "text-[#e0e7ff]", accent: "text-[#818cf8]", button: "bg-[#818cf8] text-white", card: "bg-white/5 border-[#818cf8]/20", rsvpCard: "bg-[#818cf8] text-white" },
    breeze: { bg: "bg-[#f0f9ff]", text: "text-[#075985]", accent: "text-[#38bdf8]", button: "bg-[#38bdf8] text-white", card: "bg-white border-[#38bdf8]/10", rsvpCard: "bg-[#38bdf8] text-white" }
  };

  const config = themeConfigs[theme] || themeConfigs.modern;

  return (
    <div className={`min-h-screen ${config.bg} ${config.text} transition-colors duration-700 overflow-x-hidden w-full`}>
      <div className="relative h-[50vh] lg:h-[85vh] w-full overflow-hidden">
        <motion.img initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: heroLoaded ? 1 : 0 }} transition={{ duration: 1.5 }} src={event.photo_url} loading="lazy" className={`w-full h-full object-cover transition-opacity duration-1000 ${isConcluded ? 'grayscale' : 'brightness-75'}`} alt="" onLoad={() => setHeroLoaded(true)} />
        <div className={`absolute inset-0 bg-gradient-to-t from-${config.bg.replace('bg-', '')} via-transparent to-transparent`} />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-16 max-w-6xl mx-auto">
          {!isConcluded ? <Countdown targetDate={event.event_date} /> : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-2 block">Celebration Successful</span>
              <h1 className="text-3xl md:text-7xl font-serif italic mb-4">A Legacy of <span className="text-[#D4AF37]">Love</span></h1>
            </motion.div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-20">
          <div className="lg:col-span-3 space-y-12 lg:space-y-24">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`${config.card} p-8 lg:p-16 rounded-[3rem] border`}>
              <h2 className={`text-[10px] font-bold uppercase tracking-[0.4em] ${config.accent} mb-12 flex items-center gap-4`}><Calendar className="w-4 h-4" /> The Particulars</h2>
              <div className="space-y-12">
                <div className="flex items-start gap-8 group">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#D4AF37]/10 transition-colors shrink-0"><Sparkles className={`${config.accent} w-6 h-6`} /></div>
                  <div><p className="text-[8px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-1">The Celebration</p><h1 className="text-3xl lg:text-5xl font-serif italic leading-tight">{event.event_name}</h1></div>
                </div>
                <div className="flex items-start gap-8 group">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#D4AF37]/10 transition-colors shrink-0"><MapPin className={`${config.accent} w-6 h-6`} /></div>
                  <div><p className="text-[8px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-1">The Venue</p><p className="text-lg lg:text-3xl font-light leading-relaxed mb-2">{event.venue}</p>
                  {event.venue_map_url && <a href={event.venue_map_url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${config.accent} hover:underline`}><Navigation size={10} /> View on Google Maps</a>}</div>
                </div>
              </div>
            </motion.div>

            {event.message && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative">
                <Quote className={`absolute -top-4 -left-4 w-16 h-16 ${config.accent} opacity-10`} />
                <div className={`${config.card} p-8 lg:p-16 rounded-[3rem] border italic text-lg lg:text-3xl font-light leading-relaxed text-center`}>"{event.message}"</div>
              </motion.div>
            )}

            {event.gallery_urls?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="flex justify-between items-end mb-12">
                  <div><span className={`${config.accent} text-[10px] font-bold tracking-[0.4em] uppercase mb-2 block`}>The Memory Wall</span><h2 className="text-2xl lg:text-5xl font-serif italic">Captured <span className={config.accent}>Moments</span></h2></div>
                  <ImageIcon className="text-gray-600 w-8 h-8" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                  {event.gallery_urls.map((url: string, i: number) => (
                    <motion.div key={i} whileHover={{ scale: 1.02 }} onClick={() => { setLightboxIndex(i); setIsLightboxOpen(true); }} className="aspect-[4/5] overflow-hidden border border-white/10 cursor-pointer group"><img src={url} loading="lazy" className="w-full h-full object-cover transition-all duration-700" alt="" /></motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {isConcluded ? (
                <motion.div key="concluded" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="sticky top-32 space-y-10">
                  <GlassCard className={`${config.card} p-16 rounded-[3.5rem] border text-center`}>
                    <div className={`w-20 h-20 rounded-full ${config.accent} bg-opacity-10 flex items-center justify-center mx-auto mb-8`}><Trophy className={`${config.accent} w-10 h-10`} /></div>
                    <h3 className="text-2xl font-serif italic mb-6">Event Concluded</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-10">The host thanks you for your time and for being part of this beautiful journey. The celebration was a massive success!</p>
                  </GlassCard>
                </motion.div>
              ) : submittedRsvps.length > 0 ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="sticky top-32 space-y-10">
                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 ${config.accent} bg-opacity-10 border border-opacity-20 rounded-full mb-4`}><Bookmark size={10} className={config.accent} /><span className={`text-[8px] font-black uppercase tracking-widest ${config.accent}`}>Guest Instruction</span></div>
                    <p className="text-[11px] font-medium leading-relaxed opacity-70 px-4">Please <span className={config.accent}>Bookmark</span> this page. These are your live entry passes.</p>
                  </div>
                  <div className="space-y-8">{submittedRsvps.map((rsvp) => (<DigitalInvite key={rsvp.id} event={event} rsvpId={rsvp.id} guestName={rsvp.guest_name} />))}</div>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={`${config.rsvpCard} p-16 rounded-[3.5rem] shadow-2xl sticky top-32 border border-black/5`}>
                  <h2 className="text-4xl font-serif italic tracking-tight mb-10">The Registry</h2>
                  <form onSubmit={handleRSVP} className="space-y-10">
                    <div className="space-y-2"><Label className="text-[8px] font-bold uppercase tracking-widest opacity-50">Full Name</Label><Input required className="bg-black/5 border-none h-16 rounded-none text-xl px-6" placeholder="e.g. Chidi Benson" value={rsvpData.name} onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })} /></div>
                    <div className="space-y-2"><Label className="text-[8px] font-bold uppercase tracking-widest opacity-50">WhatsApp Number</Label><Input required className="bg-black/5 border-none h-16 rounded-none text-xl px-6" placeholder="080..." value={rsvpData.phone} onChange={(e) => setRsvpData({ ...rsvpData, phone: e.target.value })} /></div>
                    <div className="flex items-center justify-between p-6 bg-black/5"><Label className="text-[10px] font-bold uppercase tracking-widest">Bringing a Plus One?</Label><Switch checked={rsvpData.hasPlusOne} onCheckedChange={(v) => setRsvpData({ ...rsvpData, hasPlusOne: v })} /></div>
                    <AnimatePresence>{rsvpData.hasPlusOne && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2 overflow-hidden"><Label className="text-[8px] font-bold uppercase tracking-widest opacity-50">Plus One's Name</Label><Input required className="bg-black/5 border-none h-16 rounded-none text-xl px-6" placeholder="e.g. Amaka Benson" value={rsvpData.plusOneName} onChange={(e) => setRsvpData({ ...rsvpData, plusOneName: e.target.value })} /></motion.div>)}</AnimatePresence>
                    <Button type="submit" disabled={isSubmitting} className={`w-full ${config.button} h-24 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase shadow-2xl`}>{isSubmitting ? <Loader2 className="animate-spin" /> : 'Confirm Attendance'}</Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <MediaLightbox isOpen={isLightboxOpen} onClose={() => setIsLightboxOpen(false)} mediaUrls={event.gallery_urls || []} currentIndex={lightboxIndex} onNavigate={setLightboxIndex} />
    </div>
  );
};

export default EventPage;