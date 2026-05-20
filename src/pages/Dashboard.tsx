"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { showSuccess, showError } from '@/utils/toast';
import { 
  RefreshCw, Plus, Loader2, LayoutDashboard, Monitor, 
  Ticket, Send, Edit3, Copy, Wallet, Users, MessageSquare, 
  ImageIcon, BarChart3, ChevronRight 
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/components/SessionProvider';
import { motion, AnimatePresence } from 'framer-motion';

import CommandTile from '@/components/dashboard/CommandTile';
import QRScannerOverlay from '@/components/dashboard/QRScannerOverlay';
import BroadcastBox from '@/components/dashboard/BroadcastBox';
import WhatsAppBlast from '@/components/dashboard/WhatsAppBlast';
import DigitalSpray from '@/components/dashboard/DigitalSpray';

const DRAFT_KEY = 'eventhub_creation_draft';

const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, loading: sessionLoading } = useSession();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isBlastOpen, setIsBlastOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!sessionLoading && !user) navigate('/login');
  }, [user, sessionLoading, navigate]);
  
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['host-dashboard-data', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase.from('events').select('*').eq('host_id', user.id).order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0].id);
    }
  }, [events, selectedEventId]);

  const activeEvent = events.find(e => e.id === selectedEventId);

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
    const updateData = isPlusOne ? { plus_one_checked_in: true } : { checked_in: true };
    try {
      const { data, error } = await supabase.from('rsvps').update(updateData).eq('id', rsvpId).select('guest_name').maybeSingle();
      if (error || !data) showError("Pass invalid.");
      else { showSuccess(`${data.guest_name} verified.`); }
    } catch (err) { showError("Error."); }
  };

  if (sessionLoading || (isLoading && events.length === 0)) {
    return <div className="flex items-center justify-center min-h-screen bg-[#050505]"><Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37]">
      <Navbar />
      {events.length > 0 && <DigitalSpray eventIds={events.map((e: any) => e.id)} />}

      <div className="max-w-7xl mx-auto py-12 md:py-24 px-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div>
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-2 block">Command Center</span>
            <h1 className="text-4xl md:text-6xl font-serif italic leading-tight">The <span className="text-[#D4AF37]">Atelier</span></h1>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button variant="ghost" onClick={handleManualRefresh} className="flex-1 h-14 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold uppercase tracking-widest px-6">
              <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} /> Sync
            </Button>
            <Button onClick={() => navigate('/create-event')} className="flex-[2] h-14 rounded-full bg-[#D4AF37] hover:bg-[#B8860B] text-black text-[9px] font-black uppercase tracking-[0.2em] px-8">
              <Plus className="w-4 h-4 mr-2" /> New Event
            </Button>
          </div>
        </div>

        {events.length > 0 ? (
          <div className="space-y-20">
            
            {/* EVENT SELECTOR REEL */}
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <LayoutDashboard size={14} className="text-[#D4AF37]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Your Portfolio ({events.length})</span>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-none snap-x">
                {events.map((event: any) => (
                  <button 
                    key={event.id}
                    onClick={() => setSelectedEventId(event.id)}
                    className={`flex-shrink-0 w-64 md:w-80 snap-start transition-all duration-500 ${selectedEventId === event.id ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
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

            <AnimatePresence mode="wait">
              {activeEvent && (
                <motion.div 
                  key={activeEvent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-20"
                >
                  {/* CATEGORY 1: THE SPECTACLE */}
                  <section>
                    <div className="flex items-center gap-4 mb-10">
                      <div className="h-px flex-1 bg-white/5" />
                      <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#D4AF37]">The Spectacle</h2>
                      <div className="h-px flex-1 bg-white/5" />
                    </div>
                    
                    <div className="mb-10">
                      <BroadcastBox eventId={activeEvent.id} currentMessage={activeEvent.message} />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
                      <CommandTile 
                        variant="gold"
                        icon={<Monitor size={24} />}
                        label="Vibe Screen"
                        description="Project this to a ballroom TV. It shows live gift explosions and guest arrival alerts."
                        onClick={() => window.open(`/vibe/${activeEvent.slug}`, '_blank')}
                      />
                      <CommandTile 
                        variant="gold"
                        icon={<Ticket size={24} />}
                        label="Red Carpet"
                        description="Professional access control. Scan guest QR codes at the entrance for instant check-in."
                        onClick={() => setIsScannerOpen(true)}
                      />
                      <CommandTile 
                        variant="green"
                        icon={<Send size={24} />}
                        label="Herald Blast"
                        description="The mass-dispatcher. Send personalized WhatsApp invites and reminders to your entire guest list in one click."
                        onClick={() => setIsBlastOpen(true)}
                      />
                      <CommandTile 
                        variant="silver"
                        icon={<ImageIcon size={24} />}
                        label="Digital IV"
                        description="View and download the high-fidelity digital invitation generated for this event."
                        onClick={() => navigate(`/event/${activeEvent.slug}`)}
                      />
                      <CommandTile 
                        variant="silver"
                        icon={<Copy size={24} />}
                        label="Copy Link"
                        description="Copy your unique event URL to manually share on social media or chats."
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/event/${activeEvent.slug}`);
                          showSuccess("Link Copied.");
                        }}
                      />
                    </div>
                  </section>

                  {/* CATEGORY 2: THE SECRETARIAT */}
                  <section>
                    <div className="flex items-center gap-4 mb-10">
                      <div className="h-px flex-1 bg-white/5" />
                      <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-500">The Secretariat</h2>
                      <div className="h-px flex-1 bg-white/5" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                      <CommandTile 
                        icon={<Wallet size={24} />}
                        label="Financial Ledger"
                        description="Your secure vault. Verify bank alerts and approve Digital Sprays to trigger ballroom animations."
                        onClick={() => navigate(`/budget/${activeEvent.id}`)}
                      />
                      <CommandTile 
                        icon={<Users size={24} />}
                        label="Guest Registry"
                        description="Deep-dive into your database. Manage table seating, check-ins, and guest song requests."
                        onClick={() => navigate(`/budget/${activeEvent.id}`)} // Registry logic merged with Ledger/Budget for now, can be split if needed
                      />
                      <CommandTile 
                        icon={<Edit3 size={24} />}
                        label="Architect"
                        description="The refinement suite. Modify event details, change themes, or update your memory wall."
                        onClick={() => navigate(`/edit-event/${activeEvent.id}`)}
                      />
                      <CommandTile 
                        icon={<BarChart3 size={24} />}
                        label="Analytics"
                        description="Track registration speed and guest engagement metrics over time."
                        onClick={() => navigate(`/budget/${activeEvent.id}`)}
                      />
                    </div>
                  </section>
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
      {activeEvent && <WhatsAppBlast isOpen={isBlastOpen} onClose={() => setIsBlastOpen(false)} event={activeEvent} rsvps={[]} />}
    </div>
  );
};

export default Dashboard;