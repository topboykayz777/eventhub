"use client";

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';
import { Loader2, Lock, ArrowLeft, PartyPopper, Search, Coins, Ticket } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import EventHero from '@/components/event/EventHero';
import EventDetails from '@/components/event/EventDetails';
import EventGallery from '@/components/event/EventGallery';
import RSVPRegistry from '@/components/event/RSVPRegistry';
import GuestPortal from '@/components/event/GuestPortal';
import MediaLightbox from '@/components/MediaLightbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const EventPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [rsvpData, setRsvpData] = useState({ name: '', phone: '', songRequest: '', hasPlusOne: false, plusOneName: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [searchPhone, setSearchPhone] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ['event', slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase.from('events').select('*').eq('slug', slug.trim()).maybeSingle();
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  // Dynamic SEO Title Update
  useEffect(() => {
    if (event?.event_name) {
      document.title = `${event.event_name} | Official Digital Invitation | EventHub NG`;
    }
    return () => {
      document.title = "EventHub Nigeria | The Professional Digital Orchestration Suite";
    };
  }, [event]);

  const { data: submittedRsvp } = useQuery({
    queryKey: ['my-rsvp', event?.id],
    queryFn: async () => {
      if (!event?.id) return null;
      const savedRsvpId = localStorage.getItem(`eventhub_rsvp_${event.id}`);
      if (!savedRsvpId) return null;
      const { data } = await supabase.from('rsvps').select('*').eq('id', savedRsvpId).maybeSingle();
      return data;
    },
    enabled: !!event?.id,
  });

  const { data: tableMates = [] } = useQuery({
    queryKey: ['table-mates', event?.id, submittedRsvp?.table_number],
    queryFn: async () => {
      if (!event?.id || !submittedRsvp?.table_number) return [];
      const { data } = await supabase.from('rsvps').select('guest_name, checked_in').eq('event_id', event.id).eq('table_number', submittedRsvp.table_number);
      return data || [];
    },
    enabled: !!submittedRsvp?.table_number,
  });

  const handleFindPass = async () => {
    if (!searchPhone || !event) return;
    setIsSearching(true);
    try {
      const { data } = await supabase.from('rsvps').select('*').eq('event_id', event.id).eq('guest_phone', searchPhone).maybeSingle();
      if (data) {
        localStorage.setItem(`eventhub_rsvp_${event.id}`, data.id);
        queryClient.invalidateQueries({ queryKey: ['my-rsvp', event.id] });
        showSuccess(`Welcome back, ${data.guest_name}`);
      } else { showError("No RSVP found."); }
    } finally { setIsSearching(false); }
  };

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event?.is_paid) { showError("This event is pending activation."); return; }
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.from('rsvps').insert({
        event_id: event.id, guest_name: rsvpData.name, guest_phone: rsvpData.phone,
        song_request: rsvpData.songRequest, has_plus_one: rsvpData.hasPlusOne,
        plus_one_name: rsvpData.hasPlusOne ? rsvpData.plusOneName : null
      }).select('*').single();
      if (error) throw error;
      localStorage.setItem(`eventhub_rsvp_${event.id}`, data.id);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      queryClient.invalidateQueries({ queryKey: ['my-rsvp', event.id] });
    } catch (err: any) { showError(err.message); } finally { setIsSubmitting(false); }
  };

  if (eventLoading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" /></div>;
  if (!event) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white"><div className="text-center"><h2 className="text-3xl font-serif italic mb-4">Event Not Found</h2></div></div>;

  const isFinished = event.is_finished;
  const isStarted = new Date() >= new Date(event.event_date);
  const isUpcoming = !isStarted && !isFinished;
  const isOngoing = isStarted && !isFinished;

  const themeConfigs: Record<string, any> = {
    modern: { bg: "bg-[#050505]", text: "text-white", card: "bg-white/5", rsvpCard: "bg-[#D4AF37]", button: "bg-black text-white hover:bg-black/80" },
    traditional: { bg: "bg-[#064e3b]", text: "text-[#fdfcf0]", card: "bg-black/20", rsvpCard: "bg-[#D4AF37]", button: "bg-[#064e3b] text-white" },
    elegant: { bg: "bg-[#f8f8f8]", text: "text-gray-900", card: "bg-white border-gray-100", rsvpCard: "bg-black", button: "bg-white text-black hover:bg-gray-100" },
    sahara: { bg: "bg-[#451a03]", text: "text-[#fef3c7]", card: "bg-black/20", rsvpCard: "bg-[#fbbf24]", button: "bg-[#451a03] text-[#fef3c7]" },
    velvet: { bg: "bg-[#2e1065]", text: "text-[#f5f3ff]", card: "bg-black/20", rsvpCard: "bg-[#D4AF37]", button: "bg-[#2e1065] text-white" },
    garden: { bg: "bg-[#064e3b]", text: "text-[#ecfdf5]", card: "bg-black/20", rsvpCard: "bg-[#10b981]", button: "bg-[#064e3b] text-white" },
    oceanic: { bg: "bg-[#1e3a8a]", text: "text-[#eff6ff]", card: "bg-black/20", rsvpCard: "bg-[#93c5fd]", button: "bg-[#1e3a8a] text-white" },
    rose: { bg: "bg-[#831843]", text: "text-[#fdf2f8]", card: "bg-black/20", rsvpCard: "bg-[#fbcfe8]", button: "bg-[#831843] text-white" },
    earth: { bg: "bg-[#431407]", text: "text-[#fff7ed]", card: "bg-black/20", rsvpCard: "bg-[#fb923c]", button: "bg-[#431407] text-white" },
    silver: { bg: "bg-[#1f2937]", text: "text-[#f9fafb]", card: "bg-black/20", rsvpCard: "bg-[#9ca3af]", button: "bg-[#1f2937] text-white" },
    dynasty: { bg: "bg-[#7f1d1d]", text: "text-[#fef2f2]", card: "bg-black/20", rsvpCard: "bg-[#D4AF37]", button: "bg-[#7f1d1d] text-white" },
    vintage: { bg: "bg-[#fef3c7]", text: "text-[#451a03]", card: "bg-white/40", rsvpCard: "bg-[#92400e]", button: "bg-[#fef3c7] text-[#92400e]" },
    neon: { bg: "bg-black", text: "text-white", card: "bg-[#00f3ff]/5 border-[#00f3ff]/20", rsvpCard: "bg-[#00f3ff]", button: "bg-black text-[#00f3ff]" },
    royal: { bg: "bg-[#3b0764]", text: "text-white", card: "bg-white/5", rsvpCard: "bg-[#D4AF37]", button: "bg-[#3b0764] text-white" },
    blossom: { bg: "bg-[#fff1f2]", text: "text-gray-900", card: "bg-white border-pink-100", rsvpCard: "bg-[#f43f5e]", button: "bg-white text-[#f43f5e]" },
    tropic: { bg: "bg-[#022c22]", text: "text-[#f0fdf4]", card: "bg-white/5", rsvpCard: "bg-[#10b981]", button: "bg-[#022c22] text-white" },
    desert: { bg: "bg-[#451a03]", text: "text-[#fff7ed]", card: "bg-white/5", rsvpCard: "bg-[#f97316]", button: "bg-[#451a03] text-white" },
    glitch: { bg: "bg-black", text: "text-white", card: "bg-red-500/5 border-red-500/20", rsvpCard: "bg-red-600", button: "bg-black text-white" },
    minimal: { bg: "bg-[#f9fafb]", text: "text-[#111827]", card: "bg-white border-gray-200", rsvpCard: "bg-[#2563eb]", button: "bg-white text-white" },
    noir: { bg: "bg-[#0a0a0a]", text: "text-white", card: "bg-white/5", rsvpCard: "bg-white", button: "bg-black text-white" }
  };

  const config = themeConfigs[event.theme || 'modern'] || themeConfigs.modern;

  return (
    <div className={`min-h-screen ${config.bg} ${config.text} transition-colors duration-700 overflow-x-hidden w-full`}>
      <EventHero event={event} isFinished={isFinished} config={config} />
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
          <div className="lg:col-span-3 space-y-16 md:space-y-24">
            <EventDetails event={event} config={config} />
            <EventGallery galleryUrls={event.gallery_urls || []} onOpenLightbox={(i) => { setLightboxIndex(i); setIsLightboxOpen(true); }} />
          </div>
          <div className="lg:col-span-2">
            {submittedRsvp ? (
              <GuestPortal event={event} submittedRsvp={submittedRsvp} tableMates={tableMates} giftAmount="" setGiftAmount={() => {}} onSpray={() => navigate(`/spray/${event.slug}`)} isFinished={isFinished} config={config} />
            ) : isUpcoming ? (
              <RSVPRegistry rsvpData={rsvpData} setRsvpData={setRsvpData} isSubmitting={isSubmitting} onSubmit={handleRSVP} config={config} />
            ) : isOngoing ? (
              <div className="space-y-8 sticky top-32">
                <div className={`${config.card} p-10 md:p-12 rounded-[3rem] border text-center space-y-8`}>
                  <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto"><Ticket className="text-[#D4AF37] w-8 h-8" /></div>
                  <div><h2 className="text-2xl font-serif italic mb-2">Guest Concierge</h2><p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-6">Registration closed.</p>
                    <div className="space-y-4"><p className="text-xs text-gray-400">Retrieve your pass:</p>
                      <div className="flex gap-2"><Input placeholder="080..." className="bg-black/5 border-none h-14" value={searchPhone} onChange={(e) => setSearchPhone(e.target.value)} /><Button onClick={handleFindPass} disabled={isSearching} className="bg-[#D4AF37] text-black h-14 px-6">{isSearching ? <Loader2 className="animate-spin" /> : <Search size={18} />}</Button></div>
                    </div>
                  </div>
                </div>
                <div className={`${config.card} p-10 md:p-12 rounded-[3rem] border text-center`}>
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-8 flex items-center justify-center gap-4"><Coins className="w-4 h-4" /> Digital Spraying</h2>
                  <Button onClick={() => navigate(`/spray/${event.slug}`)} className={`w-full h-20 rounded-none text-[10px] font-bold tracking-[0.3em] uppercase ${config.button}`}>Spray the Host</Button>
                </div>
              </div>
            ) : (
              <div className={`${config.card} p-12 md:p-16 rounded-[3.5rem] border text-center space-y-8`}><div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto"><PartyPopper className="text-[#D4AF37] w-10 h-10" /></div><h2 className="text-3xl font-serif italic mb-4">Celebration Concluded</h2><Link to="/"><Button variant="outline" className="w-full border-white/10 text-white rounded-none py-8 text-[10px] font-bold uppercase tracking-widest">Return to Portal</Button></Link></div>
            )}
          </div>
        </div>
      </div>
      <MediaLightbox isOpen={isLightboxOpen} onClose={() => setIsLightboxOpen(false)} mediaUrls={event.gallery_urls || []} currentIndex={lightboxIndex} onNavigate={setLightboxIndex} />
    </div>
  );
};

export default EventPage;