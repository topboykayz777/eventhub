"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { showSuccess, showError } from '@/utils/toast';
import { RefreshCw, Plus, Loader2, LayoutDashboard, Sparkles, Users, Wallet, Monitor, Ticket, Send, FileDown, Edit3, Copy, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/components/SessionProvider';
import { motion, AnimatePresence } from 'framer-motion';

import BentoTile from '@/components/dashboard/BentoTile';
import GuestList from '@/components/dashboard/GuestList';
import QRScannerOverlay from '@/components/dashboard/QRScannerOverlay';
import BroadcastBox from '@/components/dashboard/BroadcastBox';
import WhatsAppBlast from '@/components/dashboard/WhatsAppBlast';
import DigitalSpray from '@/components/dashboard/DigitalSpray';

const DRAFT_KEY = 'eventhub_creation_draft';

const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, loading: sessionLoading } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isBlastOpen, setIsBlastOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRescuing, setIsRescuing] = useState(false);

  // --- DRAFT RESCUE LOGIC ---
  const rescueDraft = useCallback(async (currentUser: any) => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (!saved || isRescuing) return;
    setIsRescuing(true);
    const draft = JSON.parse(saved);
    try {
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', currentUser.id).single();
      const lastName = profile?.full_name?.split(' ').pop()?.toLowerCase() || 'event';
      const slug = `${draft.eventName.toLowerCase().replace(/\s+/g, '-')}-${lastName}-${Math.floor(Math.random() * 1000)}`;
      const { error } = await supabase.from('events').insert({
        host_id: currentUser.id, event_name: draft.eventName,
        event_date: draft.eventDate ? new Date(draft.eventDate).toISOString() : new Date().toISOString(),
        venue: draft.venue, venue_map_url: draft.venue_map_url,
        message: draft.message, plan: draft.plan,
        theme: draft.theme, slug, photo_url: draft.photo_url
      });
      if (!error) {
        localStorage.removeItem(DRAFT_KEY);
        showSuccess(`Welcome! We've initialized your "${draft.eventName}" celebration.`);
        queryClient.invalidateQueries({ queryKey: ['host-dashboard-data'] });
      }
    } finally { setIsRescuing(false); }
  }, [isRescuing, queryClient]);

  useEffect(() => {
    if (!sessionLoading) {
      if (!user) navigate('/login');
      else rescueDraft(user);
    }
  }, [user, sessionLoading, navigate, rescueDraft]);
  
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['host-dashboard-data', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data: eventsData, error } = await supabase.from('events').select('*').eq('host_id', user.id).order('created_at', { ascending: false });
      if (error) throw error;
      if (!eventsData || eventsData.length === 0) return [];
      const eventIds = eventsData.map(e => e.id);
      const { data: allRSVPs, error: rsvpError } = await supabase.from('rsvps').select('*').in('event_id', eventIds);
      if (rsvpError) throw rsvpError;
      const rsvpsByEvent = (allRSVPs || []).reduce((acc: any, rsvp: any) => {
        if (!acc[rsvp.event_id]) acc[rsvp.event_id] = [];
        acc[rsvp.event_id].push(rsvp);
        return acc;
      }, {});
      return eventsData.map((event) => ({
        ...event,
        rsvps: rsvpsByEvent[event.id] || [],
      }));
    },
    enabled: !!user,
  });

  // Automatically select the first event if none selected
  useEffect(() => {
    if (events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0].id);
    }
  }, [events, selectedEventId]);

  const activeEvent = events.find(e => e.id === selectedEventId) || events[0];

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['host-dashboard-data'] });
    setTimeout(() => setIsRefreshing(false), 1000);
    showSuccess("Dashboard Synchronized.");
  };

  const handleQRScan = async (scannedText: string) => {
    if (!scannedText) return;
    let rsvpId = scannedText.trim();
    let isPlusOne = false;
    if (rsvpId.includes(':plus-one')) { rsvpId = rsvpId.split(':plus-one')[0]; isPlusOne = true; }
    if (rsvpId.includes('/')) { const parts = rsvpId.split('/'); rsvpId = parts[parts.length - 1]; }
    const updateData = isPlusOne ? { plus_one_checked_in: true } : { checked_in: true };
    try {
      const { data, error } = await supabase.from('rsvps').update(updateData).eq('id', rsvpId).select('guest_name').maybeSingle();
      if (error || !data) showError("Pass not found or invalid.");
      else { showSuccess(`${data.guest_name} verified.`); queryClient.invalidateQueries({ queryKey: ['host-dashboard-data'] }); }
    } catch (err) { showError("Invalid format."); }
  };

  if (sessionLoading || (isLoading && events.length === 0)) {
    return <div className="flex items-center justify-center min-h-screen bg-[#050505]"><Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-black">
      <Navbar />
      <DigitalSpray eventIds={events.map((e: any) => e.id)} />

      <div className="max-w-7xl mx-auto py-12 md:py-24 px-6">
        
        {/* TOP BAR: IDENTITY & GLOBAL ACTIONS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-2 block">Command Center</span>
            <h1 className="text-4xl md:text-6xl font-serif italic leading-tight">The <span className="text-[#D4AF37]">Atelier</span></h1>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button variant="ghost" onClick={handleManualRefresh} className="flex-1 md:flex-none h-14 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold uppercase tracking-widest px-6">
              <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} /> Sync
            </Button>
            <Button onClick={() => navigate('/create-event')} className="flex-[2] md:flex-none h-14 rounded-full bg-[#D4AF37] hover:bg-[#B8860B] text-black text-[9px] font-black uppercase tracking-[0.2em] px-8">
              <Plus className="w-4 h-4 mr-2" /> New Celebration
            </Button>
          </div>
        </div>

        {events.length > 0 ? (
          <div className="space-y-12">
            
            {/* THE CELEBRATION REEL: Handles 15+ events with ease */}
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <LayoutDashboard size={14} className="text-[#D4AF37]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Your Portfolio ({events.length})</span>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-none snap-x">
                {events.map((event: any) => (
                  <button 
                    key={event.id}
                    onClick={() => setSelectedEventId(event.id)}
                    className={`flex-shrink-0 w-64 md:w-80 group snap-start transition-all duration-500 ${selectedEventId === event.id ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                  >
                    <div className={`relative h-28 md:h-32 rounded-[2rem] overflow-hidden border-2 transition-all duration-500 ${selectedEventId === event.id ? 'border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.2)]' : 'border-white/5'}`}>
                      <img src={event.photo_url} className="w-full h-full object-cover grayscale" alt="" />
                      <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
                      <div className="absolute inset-0 p-6 flex flex-col justify-center">
                        <h3 className="text-lg font-serif italic text-white line-clamp-1 mb-1">{event.event_name}</h3>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-[#D4AF37]">{new Date(event.event_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ACTIVE EVENT BENTO VIEW */}
            <AnimatePresence mode="wait">
              {activeEvent && (
                <motion.div 
                  key={activeEvent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8"
                >
                  {/* Registry: Wide Tile */}
                  <BentoTile 
                    className="md:col-span-8" 
                    title="Guest Registry" 
                    icon={<Users size={16} />}
                    infoText="Your live guest list. See verified arrivals, plus-ones, and song requests in real-time."
                  >
                    <GuestList 
                      rsvps={activeEvent.rsvps} 
                      searchQuery={searchQuery} 
                      onSearchChange={setSearchQuery} 
                      onOpenScanner={() => setIsScannerOpen(true)} 
                      onUpdate={() => queryClient.invalidateQueries({ queryKey: ['host-dashboard-data'] })}
                    />
                  </BentoTile>

                  {/* Quick Actions: Right Column */}
                  <div className="md:col-span-4 space-y-6 md:space-y-8">
                    <BentoTile 
                      title="Financial Suite" 
                      icon={<Wallet size={16} />}
                      infoText="Verify bank alerts and approve digital gifts to trigger animations on the big screen."
                    >
                      <div className="h-full flex flex-col justify-between gap-6">
                        <div className="space-y-1">
                          <p className="text-3xl font-serif italic">₦{activeEvent.rsvps.reduce((acc: any, r: any) => acc + (r.amount || 0), 0).toLocaleString()}</p>
                          <p className="text-[8px] font-bold uppercase tracking-widest text-gray-500">Digital Spray Total</p>
                        </div>
                        <Button 
                          onClick={() => navigate(`/budget/${activeEvent.id}`)}
                          className="w-full bg-[#D4AF37] text-black rounded-2xl py-8 text-[9px] font-black uppercase tracking-[0.2em]"
                        >
                          Open Ledger
                        </Button>
                      </div>
                    </BentoTile>

                    <BentoTile 
                      title="Event Portal" 
                      icon={<Edit3 size={16} />}
                      infoText="Modify details, change themes, or copy your unique RSVP link to share manually."
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => navigate(`/edit-event/${activeEvent.id}`)} className="p-5 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all">
                          <Edit3 size={14} className="text-[#D4AF37]" />
                          <span className="text-[8px] font-bold uppercase tracking-widest">Edit</span>
                        </button>
                        <button onClick={() => {
                          const url = `${window.location.origin}/event/${activeEvent.slug}`;
                          navigator.clipboard.writeText(url);
                          showSuccess("Link Copied.");
                        }} className="p-5 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all">
                          <Copy size={14} className="text-[#D4AF37]" />
                          <span className="text-[8px] font-bold uppercase tracking-widest">Copy Link</span>
                        </button>
                      </div>
                    </BentoTile>
                  </div>

                  {/* The Experience: Three Tiles */}
                  <BentoTile 
                    className="md:col-span-4" 
                    title="Vibe Screen" 
                    icon={<Monitor size={16} />}
                    infoText="Project this onto a ballroom TV. It automatically updates with gift box explosions and arrival alerts."
                  >
                    <div className="space-y-6">
                      <div className="aspect-video rounded-2xl bg-black/40 flex items-center justify-center border border-white/5 overflow-hidden relative">
                         <img src={activeEvent.photo_url} className="absolute inset-0 w-full h-full object-cover blur-sm opacity-30" alt="" />
                         <Monitor className="relative z-10 text-[#D4AF37] opacity-20" size={40} />
                      </div>
                      <Button 
                        onClick={() => window.open(`/vibe/${activeEvent.slug}`, '_blank')}
                        className="w-full bg-white/5 hover:bg-[#D4AF37]/10 border border-white/10 text-white rounded-2xl py-6 text-[9px] font-black uppercase tracking-[0.2em]"
                      >
                        Launch Stage
                      </Button>
                    </div>
                  </BentoTile>

                  <BentoTile 
                    className="md:col-span-4" 
                    title="Red Carpet" 
                    icon={<Ticket size={16} />}
                    infoText="Professional access control. Scan guest QR passes at the entrance for instant check-in."
                  >
                    <div className="flex flex-col justify-between h-full gap-8">
                       <div className="p-6 bg-[#D4AF37]/5 rounded-2xl border border-[#D4AF37]/10 text-center">
                          <Ticket className="text-[#D4AF37] mx-auto mb-3" size={24} />
                          <p className="text-[10px] font-medium text-gray-400">Scan at the door</p>
                       </div>
                       <Button 
                        onClick={() => setIsScannerOpen(true)}
                        className="w-full bg-[#D4AF37] text-black rounded-2xl py-6 text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#D4AF37]/10"
                      >
                        Open Camera
                      </Button>
                    </div>
                  </BentoTile>

                  <BentoTile 
                    className="md:col-span-4" 
                    title="The Herald" 
                    icon={<Send size={16} />}
                    infoText="Broadcast updates to your guest list pages or send mass reminders via WhatsApp."
                  >
                    <div className="space-y-4">
                      <Button 
                        onClick={() => setIsBlastOpen(true)}
                        className="w-full bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] rounded-2xl py-4 text-[9px] font-black uppercase tracking-widest"
                      >
                        WhatsApp Blast
                      </Button>
                      <BroadcastBox eventId={activeEvent.id} currentMessage={activeEvent.message} />
                    </div>
                  </BentoTile>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-48 border border-dashed border-white/10 rounded-[4rem]">
            <LayoutDashboard className="text-gray-600 w-16 h-16 mx-auto mb-8" />
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.5em]">No celebrations in your hangar.</p>
          </div>
        )}
      </div>

      <QRScannerOverlay isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onScan={handleQRScan} />
      {activeEvent && <WhatsAppBlast isOpen={isBlastOpen} onClose={() => setIsBlastOpen(false)} event={activeEvent} rsvps={activeEvent.rsvps} />}
    </div>
  );
};

export default Dashboard;