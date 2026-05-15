"use client";

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';
import { Loader2, Lock, ArrowLeft, PartyPopper, Search, Coins, Ticket } from 'lucide-react';
import confetti from 'canvas-confetti';
import { usePaystackPayment } from 'react-paystack';

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
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpData, setRsvpData] = useState({ name: '', phone: '', songRequest: '', hasPlusOne: false, plusOneName: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRsvp, setSubmittedRsvp] = useState<any>(null);
  const [tableMates, setTableMates] = useState<any[]>([]);
  const [giftAmount, setGiftAmount] = useState('');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [searchPhone, setSearchPhone] = useState('');
  const [isSearching, setIsSearching] = useState(false);

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
          if (rsvp) {
            setSubmittedRsvp(rsvp);
            if (rsvp.table_number) {
              fetchTableMates(data.id, rsvp.table_number);
            }
          }
        }
      }
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTableMates = async (eventId: string, tableNum: string) => {
    const { data } = await supabase
      .from('rsvps')
      .select('guest_name, checked_in')
      .eq('event_id', eventId)
      .eq('table_number', tableNum);
    setTableMates(data || []);
  };

  const handleFindPass = async () => {
    if (!searchPhone) return;
    setIsSearching(true);
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .eq('event_id', event.id)
      .eq('guest_phone', searchPhone)
      .maybeSingle();

    if (data) {
      localStorage.setItem(`eventhub_rsvp_${event.id}`, data.id);
      setSubmittedRsvp(data);
      showSuccess(`Welcome back, ${data.guest_name}`);
    } else {
      showError("No RSVP found for this number.");
    }
    setIsSearching(false);
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
        has_plus_one: rsvpData.hasPlusOne,
        plus_one_name: rsvpData.hasPlusOne ? rsvpData.plusOneName : null
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
    publicKey: 'pk_live_b34e33d09dceeebd5dfa469b9139257b308a2c9d',
    metadata: {
      custom_fields: [
        { display_name: "Event ID", variable_name: "event_id", value: event?.id || "" },
        { display_name: "Payment Type", variable_name: "payment_type", value: "gift" },
        { display_name: "Guest Name", variable_name: "guest_name", value: submittedRsvp?.guest_name || "Anonymous" }
      ]
    }
  };

  const initializeGiftPayment = usePaystackPayment(paystackConfig);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" />
    </div>
  );
  
  if (!event) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white p-4">
      <div className="text-center">
        <h2 className="text-3xl font-serif italic mb-4">Event Not Found</h2>
        <p className="text-gray-500">This event doesn't exist or has been removed.</p>
      </div>
    </div>
  );

  const isFinished = event.is_finished;
  const isStarted = new Date() >= new Date(event.event_date);
  const isUpcoming = !isStarted && !isFinished;
  const isOngoing = isStarted && !isFinished;

  const theme = event.theme || 'modern';
  const themeConfigs: Record<string, any> = {
    modern: { bg: "bg-[#0a0a1a]", text: "text-white", accent: "text-[#D4AF37]", button: "bg-[#D4AF37] hover:bg-[#B8860B] text-black", card: "bg-white/5 border-white/10 backdrop-blur-xl", rsvpCard: "bg-white text-black" },
    traditional: { bg: "bg-[#064e3b]", text: "text-[#fdfcf0]", accent: "text-[#D4AF37]", button: "bg-[#D4AF37] hover:bg-[#B8860B] text-black", card: "bg-white/5 border-[#D4AF37]/20 shadow-xl", rsvpCard: "bg-[#D4AF37] text-black" },
    elegant: { bg: "bg-white", text: "text-gray-900", accent: "text-black", button: "bg-black hover:bg-gray-800 text-white", card: "bg-gray-50 border-gray-100 shadow-lg", rsvpCard: "bg-white border-4 border-black text-black" },
    sahara: { bg: "bg-[#78350f]", text: "text-[#fef3c7]", accent: "text-[#fbbf24]", button: "bg-[#fbbf24] hover:bg-[#d97706] text-black", card: "bg-white/5 border-[#fbbf24]/20 backdrop-blur-xl", rsvpCard: "bg-[#fbbf24] text-black" },
    velvet: { bg: "bg-[#2e1065]", text: "text-[#f5f3ff]", accent: "text-[#D4AF37]", button: "bg-[#D4AF37] hover:bg-[#B8860B] text-black", card: "bg-white/5 border-[#D4AF37]/20 backdrop-blur-xl", rsvpCard: "bg-[#D4AF37] text-black" },
    garden: { bg: "bg-[#064e3b]", text: "text-[#ecfdf5]", accent: "text-[#10b981]", button: "bg-[#10b981] hover:bg-[#059669] text-white", card: "bg-white/5 border-10b981/20 backdrop-blur-xl", rsvpCard: "bg-[#10b981] text-white" },
    oceanic: { bg: "bg-[#1e3a8a]", text: "text-[#eff6ff]", accent: "text-[#93c5fd]", button: "bg-[#93c5fd] hover:bg-[#60a5fa] text-black", card: "bg-white/5 border-[#93c5fd]/20 backdrop-blur-xl", rsvpCard: "bg-[#93c5fd] text-black" },
    rose: { bg: "bg-[#831843]", text: "text-[#fdf2f8]", accent: "text-[#fbcfe8]", button: "bg-[#fbcfe8] hover:bg-[#f9a8d4] text-black", card: "bg-white/5 border-[#fbcfe8]/20 backdrop-blur-xl", rsvpCard: "bg-[#fbcfe8] text-black" },
    earth: { bg: "bg-[#431407]", text: "text-[#fff7ed]", accent: "text-[#fb923c]", button: "bg-[#fb923c] hover:bg-[#ea580c] text-white", card: "bg-white/5 border-[#fb923c]/20 backdrop-blur-xl", rsvpCard: "bg-[#fb923c] text-white" },
    silver: { bg: "bg-[#1f2937]", text: "text-[#f9fafb]", accent: "text-[#9ca3af]", button: "bg-[#9ca3af] hover:bg-[#6b7280] text-white", card: "bg-white/5 border-[#9ca3af]/20 backdrop-blur-xl", rsvpCard: "bg-[#9ca3af] text-white" },
    dynasty: { bg: "bg-[#7f1d1d]", text: "text-[#fef2f2]", accent: "text-[#D4AF37]", button: "bg-[#D4AF37] hover:bg-[#B8860B] text-black", card: "bg-white/5 border-[#D4AF37]/20 backdrop-blur-xl", rsvpCard: "bg-[#D4AF37] text-black" },
    vintage: { bg: "bg-[#fef3c7]", text: "text-[#451a03]", accent: "text-[#92400e]", button: "bg-[#92400e] hover:bg-[#78350f] text-white", card: "bg-white/10 border-[#92400e]/20 backdrop-blur-xl", rsvpCard: "bg-[#92400e] text-white" },
    onyx: { bg: "bg-[#050505]", text: "text-white", accent: "text-[#06b6d4]", button: "bg-[#06b6d4] hover:bg-[#0891b2] text-black", card: "bg-white/5 border-[#06b6d4]/20 backdrop-blur-xl", rsvpCard: "bg-[#06b6d4] text-black" },
    lavender: { bg: "bg-[#f5f3ff]", text: "text-[#4c1d95]", accent: "text-[#8b5cf6]", button: "bg-[#8b5cf6] hover:bg-[#7c3aed] text-white", card: "bg-white border-[#8b5cf6]/20 shadow-lg", rsvpCard: "bg-[#8b5cf6] text-white" },
    midnight: { bg: "bg-[#020617]", text: "text-[#f8fafc]", accent: "text-[#38bdf8]", button: "bg-[#38bdf8] hover:bg-[#0ea5e9] text-black", card: "bg-white/5 border-[#38bdf8]/20 backdrop-blur-xl", rsvpCard: "bg-[#38bdf8] text-black" },
    champagne: { bg: "bg-[#fafaf9]", text: "text-[#44403c]", accent: "text-[#d97706]", button: "bg-[#d97706] hover:bg-[#b45309] text-white", card: "bg-white border-[#d97706]/20 shadow-md", rsvpCard: "bg-[#d97706] text-white" },
    forest: { bg: "bg-[#022c22]", text: "text-[#f0fdf4]", accent: "text-[#10b981]", button: "bg-[#10b981] hover:bg-[#059669] text-white", card: "bg-white/5 border-[#10b981]/20 backdrop-blur-xl", rsvpCard: "bg-[#10b981] text-white" },
    sunset: { bg: "bg-[#451a03]", text: "text-[#fff7ed]", accent: "text-[#f97316]", button: "bg-[#f97316] hover:bg-[#ea580c] text-white", card: "bg-white/5 border-[#f97316]/20 backdrop-blur-xl", rsvpCard: "bg-[#f97316] text-white" },
    marble: { bg: "bg-[#f9fafb]", text: "text-[#111827]", accent: "text-[#6b7280]", button: "bg-[#111827] hover:bg-black text-white", card: "bg-white border-[#e5e7eb] shadow-xl", rsvpCard: "bg-[#111827] text-white" },
    platinum: { bg: "bg-[#f3f4f6]", text: "text-[#1f2937]", accent: "text-[#9ca3af]", button: "bg-[#1f2937] hover:bg-[#111827] text-white", card: "bg-white border-[#d1d5db] shadow-lg", rsvpCard: "bg-[#1f2937] text-white" }
  };

  const config = themeConfigs[theme] || themeConfigs.modern;

  return (
    <div className={`min-h-screen ${config.bg} ${config.text} transition-colors duration-700 overflow-x-hidden w-full`}>
      <EventHero event={event} isFinished={isFinished} config={config} />

      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
          <div className="lg:col-span-3 space-y-16 md:space-y-24">
            <EventDetails event={event} config={config} />
            <EventGallery 
              galleryUrls={event.gallery_urls || []} 
              onOpenLightbox={(i) => { setLightboxIndex(i); setIsLightboxOpen(true); }} 
            />
          </div>

          <div className="lg:col-span-2">
            {submittedRsvp ? (
              <GuestPortal 
                event={event}
                submittedRsvp={submittedRsvp}
                tableMates={tableMates}
                giftAmount={giftAmount}
                setGiftAmount={setGiftAmount}
                onSpray={() => {
                  if (!giftAmount || parseInt(giftAmount) < 100) {
                    showError("Minimum spray is ₦100");
                    return;
                  }
                  initializeGiftPayment({ onSuccess: handleGiftSuccess, onClose: () => {} });
                }}
                isFinished={isFinished}
                config={config}
              />
            ) : isUpcoming ? (
              <RSVPRegistry 
                rsvpData={rsvpData}
                setRsvpData={setRsvpData}
                isSubmitting={isSubmitting}
                onSubmit={handleRSVP}
                config={config}
              />
            ) : isOngoing ? (
              <div className="space-y-8 sticky top-32">
                <div className={`${config.card} p-10 md:p-12 rounded-[3rem] border text-center space-y-8`}>
                  <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto">
                    <Ticket className="text-[#D4AF37] w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif italic mb-2">Guest Concierge</h2>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-6">Registration is now closed.</p>
                    <div className="space-y-4">
                      <p className="text-xs text-gray-400 leading-relaxed">Already RSVP'd? Enter your phone number to retrieve your digital pass.</p>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="080..." 
                          className="bg-black/5 border-none h-14 rounded-none"
                          value={searchPhone}
                          onChange={(e) => setSearchPhone(e.target.value)}
                        />
                        <Button onClick={handleFindPass} disabled={isSearching} className="bg-[#D4AF37] text-black rounded-none h-14 px-6">
                          {isSearching ? <Loader2 className="animate-spin" /> : <Search size={18} />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${config.card} p-10 md:p-12 rounded-[3rem] border`}>
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-8 flex items-center gap-4">
                    <Coins className="w-4 h-4" /> Digital Spraying
                  </h2>
                  <div className="space-y-6">
                    <p className="text-xs text-gray-400 leading-relaxed">You can still honor the host with a digital spray even if you aren't on the guest list.</p>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4AF37] font-serif text-xl">₦</span>
                      <Input 
                        type="number" 
                        placeholder="Amount" 
                        className="h-16 pl-12 bg-black/5 border-none rounded-none text-2xl font-light" 
                        value={giftAmount} 
                        onChange={(e) => setGiftAmount(e.target.value)} 
                      />
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
                </div>
              </div>
            ) : (
              <div className={`${config.card} p-12 md:p-16 rounded-[3.5rem] border text-center space-y-8`}>
                <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto">
                  <PartyPopper className="text-[#D4AF37] w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-3xl font-serif italic mb-4">Celebration Concluded</h2>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    This event has successfully concluded. The host thanks you for your support and well wishes.
                  </p>
                </div>
                <Link to="/">
                  <Button variant="outline" className="w-full border-white/10 text-white rounded-none py-8 text-[10px] font-bold uppercase tracking-widest">
                    Return to Portal
                  </Button>
                </Link>
              </div>
            )}
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