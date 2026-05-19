"use client";

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { showSuccess, showError } from '@/utils/toast';
import { RefreshCw, Plus, Loader2, CheckCircle2, LayoutDashboard, Sparkles, Users, Wallet, Monitor, Ticket, Send, FileDown, Music, Edit3, Copy, ExternalLink, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/components/SessionProvider';

import BentoTile from '@/components/dashboard/BentoTile';
import GuestList from '@/components/dashboard/GuestList';
import QRScannerOverlay from '@/components/dashboard/QRScannerOverlay';
import BroadcastBox from '@/components/dashboard/BroadcastBox';
import WhatsAppBlast from '@/components/dashboard/WhatsAppBlast';
import DigitalSpray from '@/components/dashboard/DigitalSpray';

const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, loading: sessionLoading } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isBlastOpen, setIsBlastOpen] = useState(false);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [activeEvent, setActiveEvent] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!sessionLoading && !user) navigate('/login');
  }, [user, sessionLoading, navigate]);
  
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
        isCompleted: new Date(event.event_date).getTime() + (24 * 60 * 60 * 1000) < Date.now()
      }));
    },
    enabled: !!user,
  });

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
    rsvpId = rsvpId.split('?')[0].split('#')[0];
    const updateData = isPlusOne ? { plus_one_checked_in: true } : { checked_in: true };
    try {
      const { data, error } = await supabase.from('rsvps').update(updateData).eq('id', rsvpId).select('guest_name').maybeSingle();
      if (error || !data) showError("Pass not found or invalid.");
      else { showSuccess(`${data.guest_name} verified.`); queryClient.invalidateQueries({ queryKey: ['host-dashboard-data'] }); }
    } catch (err) { showError("Invalid pass format."); }
  };

  if (sessionLoading || (isLoading && events.length === 0)) {
    return <div className="flex items-center justify-center min-h-screen bg-[#050505]"><Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" /></div>;
  }

  const firstEvent = events[0]; // Focusing on the most recent event for the bento layout

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <DigitalSpray eventIds={events.map((e: any) => e.id)} />

      <div className="max-w-7xl mx-auto py-12 md:py-24 px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 md:mb-24">
          <div>
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">Command Center</span>
            <h1 className="text-4xl md:text-7xl font-serif italic">The <span className="text-[#D4AF37]">Atelier</span></h1>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Button variant="outline" onClick={handleManualRefresh} className="flex-1 border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-widest px-8 py-6 h-auto">
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} /> Sync
            </Button>
            <Link to="/create-event" className="flex-1">
              <Button className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black text-[10px] font-bold uppercase tracking-widest px-10 py-6 h-auto">
                <Plus className="w-4 h-4 mr-2" /> New Event
              </Button>
            </Link>
          </div>
        </div>

        {firstEvent ? (
          <div className="space-y-24">
            {/* EVENT HEADER */}
            <div className="relative h-64 md:h-96 rounded-[3rem] overflow-hidden border border-white/10">
              <img src={firstEvent.photo_url} className="w-full h-full object-cover grayscale opacity-40" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
              <div className="absolute bottom-12 left-12">
                <h2 className="text-3xl md:text-6xl font-serif italic mb-2">{firstEvent.event_name}</h2>
                <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                  <span className="flex items-center gap-2"><Sparkles size={14} /> {firstEvent.plan} Tier</span>
                  <span className="flex items-center gap-2"><Users size={14} /> {firstEvent.rsvps.length} RSVPs</span>
                </div>
              </div>
            </div>

            {/* THE BENTO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
              
              {/* CATEGORY A: THE CONTROL ROOM */}
              <div className="md:col-span-12">
                <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#D4AF37] mb-8 px-4 flex items-center gap-4">
                  <div className="h-px w-8 bg-[#D4AF37]/30" /> The Control Room
                </h2>
              </div>

              <BentoTile 
                className="md:col-span-8" 
                title="Guest Registry" 
                icon={<Users size={16} />}
                infoText="See exactly who is coming and how to contact them."
              >
                <GuestList 
                  rsvps={firstEvent.rsvps} 
                  searchQuery={searchQuery} 
                  onSearchChange={setSearchQuery} 
                  onOpenScanner={() => { setActiveEventId(firstEvent.id); setIsScannerOpen(true); }} 
                  onUpdate={() => queryClient.invalidateQueries({ queryKey: ['host-dashboard-data'] })}
                />
              </BentoTile>

              <div className="md:col-span-4 space-y-6 md:space-y-8">
                <BentoTile 
                  title="The Ledger" 
                  icon={<Wallet size={16} />}
                  infoText="Check your bank app for transfers, then click here to approve gifts for the big screen."
                >
                  <Button 
                    onClick={() => navigate(`/budget/${firstEvent.id}`)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl h-24 text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all"
                  >
                    Open Financial Suite
                  </Button>
                </BentoTile>

                <BentoTile 
                  title="Data Dispatch" 
                  icon={<FileDown size={16} />}
                  infoText="Download your guest list for the door-men or send the song requests to your DJ."
                >
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => navigate(`/edit-event/${firstEvent.id}`)} className="p-6 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center gap-3 hover:bg-white/10 transition-all">
                      <Edit3 size={16} className="text-[#D4AF37]" />
                      <span className="text-[8px] font-bold uppercase tracking-widest">Edit</span>
                    </button>
                    <button onClick={() => {
                      const url = `${window.location.origin}/event/${firstEvent.slug}`;
                      navigator.clipboard.writeText(url);
                      showSuccess("Link Copied.");
                    }} className="p-6 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center gap-3 hover:bg-white/10 transition-all">
                      <Copy size={16} className="text-[#D4AF37]" />
                      <span className="text-[8px] font-bold uppercase tracking-widest">Link</span>
                    </button>
                  </div>
                </BentoTile>
              </div>

              {/* CATEGORY B: THE STAGE */}
              <div className="md:col-span-12 mt-12">
                <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#D4AF37] mb-8 px-4 flex items-center gap-4">
                  <div className="h-px w-8 bg-[#D4AF37]/30" /> The Stage
                </h2>
              </div>

              <BentoTile 
                className="md:col-span-4" 
                title="The Vibe Screen" 
                icon={<Monitor size={16} />}
                infoText="Connect your laptop to a TV at the party to show live gifts and arrivals to everyone."
              >
                <Button 
                  onClick={() => window.open(`/vibe/${firstEvent.slug}`, '_blank')}
                  className="w-full bg-[#D4AF37] text-black rounded-2xl h-32 text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-[#D4AF37]/20"
                >
                  Launch Ballroom Screen
                </Button>
              </BentoTile>

              <BentoTile 
                className="md:col-span-4" 
                title="Red Carpet" 
                icon={<Ticket size={16} />}
                infoText="Use your phone camera at the door to scan guest passes for instant check-in."
              >
                <Button 
                  onClick={() => setIsScannerOpen(true)}
                  variant="outline"
                  className="w-full border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] rounded-2xl h-32 text-[10px] font-black uppercase tracking-[0.3em]"
                >
                  Open Scanner
                </Button>
              </BentoTile>

              <BentoTile 
                className="md:col-span-4" 
                title="The Herald" 
                icon={<Send size={16} />}
                infoText="Send mass WhatsApp reminders, or post live updates on guest event pages."
              >
                <div className="space-y-4">
                  <Button 
                    onClick={() => { setActiveEvent(firstEvent); setIsBlastOpen(true); }}
                    className="w-full bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] rounded-xl py-4 text-[9px] font-black uppercase tracking-widest"
                  >
                    WhatsApp Blast
                  </Button>
                  <BroadcastBox eventId={firstEvent.id} currentMessage={firstEvent.message} />
                </div>
              </BentoTile>

            </div>
          </div>
        ) : (
          <div className="text-center py-48 border border-dashed border-white/10 rounded-[4rem]">
            <LayoutDashboard className="text-gray-600 w-16 h-16 mx-auto mb-8" />
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.5em]">No celebrations found.</p>
          </div>
        )}
      </div>

      <QRScannerOverlay isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onScan={handleQRScan} />
      {activeEvent && <WhatsAppBlast isOpen={isBlastOpen} onClose={() => setIsBlastOpen(false)} event={activeEvent} rsvps={activeEvent.rsvps} />}
    </div>
  );
};

export default Dashboard;