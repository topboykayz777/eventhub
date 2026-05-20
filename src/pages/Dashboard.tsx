"use client";

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { showSuccess, showError } from '@/utils/toast';
import { RefreshCw, Plus, Loader2, CheckCircle2, LayoutDashboard, Sparkles, Users, ScanLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/components/SessionProvider';

import EventCard from '@/components/dashboard/EventCard';
import ConciergeTools from '@/components/dashboard/ConciergeTools';
import QRScannerOverlay from '@/components/dashboard/QRScannerOverlay';
import BroadcastBox from '@/components/dashboard/BroadcastBox';
import WhatsAppBlast from '@/components/dashboard/WhatsAppBlast';
import DigitalSpray from '@/components/dashboard/DigitalSpray';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const InfoButton = ({ text }: { text: string }) => (
  <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="inline-flex items-center justify-center ml-2 text-gray-500 hover:text-[#D4AF37] transition-all">
          <Info size={12} className="opacity-60" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="bg-[#1a1a1a] border-[#D4AF37]/20 text-white text-[11px] font-medium p-3 max-w-[200px] shadow-2xl rounded-xl z-[200]">
        {text}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

import { Info } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, loading: sessionLoading } = useSession();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isBlastOpen, setIsBlastOpen] = useState(false);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [activeEvent, setActiveEvent] = useState<any>(null);
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!sessionLoading && !user) { navigate('/login'); }
  }, [user, sessionLoading, navigate]);
  
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['host-dashboard-data', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data: eventsData, error } = await supabase.from('events').select('*').eq('host_id', user.id).order('created_at', { ascending: false });
      if (error) throw error;
      if (!eventsData || eventsData.length === 0) return [];
      const { data: allRSVPs } = await supabase.from('rsvps').select('*').in('event_id', eventsData.map(e => e.id));
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
    staleTime: 1000 * 30,
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
    let isPlusOne = rsvpId.includes(':plus-one');
    if (isPlusOne) rsvpId = rsvpId.split(':plus-one')[0];
    if (rsvpId.includes('/')) { const parts = rsvpId.split('/'); rsvpId = parts[parts.length - 1]; }
    rsvpId = rsvpId.split('?')[0].split('#')[0];

    try {
      const { data, error } = await supabase.from('rsvps').update(isPlusOne ? { plus_one_checked_in: true } : { checked_in: true }).eq('id', rsvpId).select('guest_name').maybeSingle();
      if (error || !data) { showError("Pass invalid."); } 
      else { showSuccess(`${data.guest_name} verified.`); queryClient.invalidateQueries({ queryKey: ['host-dashboard-data'] }); }
    } catch (err) { showError("Invalid pass."); }
  };

  if (sessionLoading || (isLoading && events.length === 0)) {
    return <div className="flex items-center justify-center min-h-screen bg-[#050505]"><Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <DigitalSpray eventIds={events.map((e: any) => e.id)} />
      <div className="max-w-7xl mx-auto py-24 px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-24">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">Command Center</span>
            <h1 className="text-4xl md:text-8xl font-serif italic">The <span className="text-[#D4AF37]">Orchestration</span></h1>
          </motion.div>
          <div className="flex gap-4 w-full md:w-auto">
            <Button variant="outline" onClick={handleManualRefresh} className="flex-1 md:flex-none border-white/10 bg-white/5 rounded-2xl px-8 py-7 text-[10px] font-black uppercase tracking-widest"><RefreshCw className={`w-4 h-4 mr-3 ${isRefreshing ? 'animate-spin' : ''}`} /> Sync</Button>
            <Link to="/create-event" className="flex-1 md:flex-none"><Button className="w-full bg-[#D4AF37] text-black rounded-2xl px-12 py-7 text-[10px] font-black uppercase tracking-widest"><Plus className="w-4 h-4 mr-3" /> New Event</Button></Link>
          </div>
        </div>

        <div className="space-y-12">
          {events.map((event: any, index: number) => (
            <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className={`border ${event.isCompleted ? 'border-white/5 bg-white/[0.01]' : 'border-white/10 bg-white/[0.03]'} rounded-[3rem] overflow-hidden`}>
              <div onClick={() => { const s = new Set(expandedEvents); s.has(event.id) ? s.delete(event.id) : s.add(event.id); setExpandedEvents(s); }} className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 cursor-pointer hover:bg-white/[0.05]">
                <div className="flex items-center gap-10 w-full md:w-auto">
                  <div className="relative shrink-0">
                    <img src={event.photo_url} className={`w-28 h-36 object-cover border border-white/10 rounded-2xl ${event.isCompleted ? 'grayscale' : ''}`} alt="" />
                    {event.isCompleted && <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl"><CheckCircle2 className="text-white w-8 h-8" /></div>}
                  </div>
                  <div>
                    <h2 className={`text-3xl md:text-5xl font-serif italic mb-3 ${event.isCompleted ? 'text-gray-500' : 'text-white'}`}>{event.event_name}</h2>
                    <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-gray-600">{new Date(event.event_date).toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-12 w-full md:w-auto justify-between border-t md:border-t-0 border-white/5 pt-6 md:pt-0">
                  <div className="text-right">
                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-600 mb-1">Confirmed Guests</p>
                    <p className="text-3xl font-serif italic text-[#D4AF37]">{event.rsvps.length}</p>
                  </div>
                  <Button variant="ghost" className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#D4AF37]/10 px-8 py-5 rounded-full border border-[#D4AF37]/20">{expandedEvents.has(event.id) ? 'Close' : 'Manage'}</Button>
                </div>
              </div>

              <AnimatePresence>
                {expandedEvents.has(event.id) && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="p-8 md:p-20 border-t border-white/5 bg-black/40">
                      <div className="grid lg:grid-cols-12 gap-20">
                        <EventCard event={event} />
                        <div className="lg:col-span-8">
                          <Tabs defaultValue="tools" className="w-full">
                            <TabsList className="bg-transparent border-b border-white/5 w-full justify-start gap-12 mb-12 h-auto p-0">
                              <TabsTrigger value="tools" className="text-[10px] font-black uppercase tracking-[0.4em] pb-6 data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] data-[state=active]:text-[#D4AF37]">Concierge Tools</TabsTrigger>
                              <TabsTrigger value="guests" className="text-[10px] font-black uppercase tracking-[0.4em] pb-6 data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] data-[state=active]:text-[#D4AF37]">Guest Management</TabsTrigger>
                            </TabsList>
                            <TabsContent value="tools" className="outline-none">
                              <ConciergeTools event={event} onSendWhatsAppBlast={() => { setActiveEvent(event); setIsBlastOpen(true); }} />
                            </TabsContent>
                            <TabsContent value="guests" className="outline-none space-y-12">
                              {/* Stats Strip */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-white/5 border border-white/10 p-10 rounded-[2rem] shadow-lg flex flex-col justify-center">
                                  <div className="flex items-center mb-4">
                                    <Users className="text-[#D4AF37] w-5 h-5 mr-3" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Confirmed Guests</span>
                                    <InfoButton text="The total number of people who have registered for your event and received a digital pass." />
                                  </div>
                                  <div className="text-3xl font-serif italic">{event.rsvps.length} Unique Entries</div>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-10 rounded-[2rem] shadow-lg flex flex-col justify-center">
                                  <div className="flex items-center mb-4">
                                    <Sparkles className="text-[#D4AF37] w-5 h-5 mr-3" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Active Suite</span>
                                    <InfoButton text="Your currently active professional tier. This determines your features and media storage limits." />
                                  </div>
                                  <div className="text-3xl font-serif italic uppercase tracking-widest text-[#D4AF37]">{event.plan} Plan</div>
                                </div>
                              </div>

                              {/* Tool Grid */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <TooltipWrapper text="Open the full guest vault. Here you can search through names, see seating arrangements, and export your DJ's vibe list or security files.">
                                  <button onClick={() => navigate(`/guests/${event.id}`)} className="bg-white/5 border border-white/5 h-40 flex flex-col items-center justify-center gap-6 hover:bg-white/10 transition-all group rounded-[2rem]">
                                    <Users className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Rsvp'd Guests</span>
                                  </button>
                                </TooltipWrapper>

                                <TooltipWrapper text="Launch the check-in scanner. Use your camera to instantly verify guest QR passes at the entrance for lightning-fast entry.">
                                  <button onClick={() => { setActiveEventId(event.id); setIsScannerOpen(true); }} className="bg-white/5 border border-white/5 h-40 flex flex-col items-center justify-center gap-6 hover:bg-white/10 transition-all group rounded-[2rem]">
                                    <ScanLine className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Scan QR Pass</span>
                                  </button>
                                </TooltipWrapper>

                                <BroadcastBox eventId={event.id} currentMessage={event.message} />
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      <QRScannerOverlay isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onScan={handleQRScan} />
      {activeEvent && <WhatsAppBlast isOpen={isBlastOpen} onClose={() => setIsBlastOpen(false)} event={activeEvent} rsvps={activeEvent.rsvps} />}
    </div>
  );
};

// Helper internal component for tooltips
const TooltipWrapper = ({ children, text }: { children: React.ReactNode, text: string }) => (
  <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent className="bg-[#1a1a1a] border-[#D4AF37]/20 text-white text-[11px] font-medium p-4 max-w-[240px] shadow-2xl rounded-2xl z-[200]">
        {text}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default Dashboard;