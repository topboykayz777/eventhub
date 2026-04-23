"use client";

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { showSuccess, showError } from '@/utils/toast';
import { User, Sparkles, Users, CheckCircle2, Eye, TrendingUp, Loader2, RefreshCw, Plus, ChevronDown, ChevronUp, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Modular Components
import EventCard from '@/components/dashboard/EventCard';
import GuestList from '@/components/dashboard/GuestList';
import Analytics from '@/components/dashboard/Analytics';
import ConciergeTools from '@/components/dashboard/ConciergeTools';
import QRScannerOverlay from '@/components/dashboard/QRScannerOverlay';
import BroadcastBox from '@/components/dashboard/BroadcastBox';
import WhatsAppBlast from '@/components/dashboard/WhatsAppBlast';

const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isBlastOpen, setIsBlastOpen] = useState(false);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [activeEvent, setActiveEvent] = useState<any>(null);
  
  // State to track which events are expanded
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  const { data: events = [], isLoading, refetch } = useQuery({
    queryKey: ['host-events'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('events')
        .select('*, rsvps(*)')
        .eq('host_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  // Expand the first event by default when data loads
  useEffect(() => {
    if (events.length > 0 && expandedEvents.size === 0) {
      setExpandedEvents(new Set([events[0].id]));
    }
  }, [events]);

  useEffect(() => {
    const channel = supabase
      .channel('dashboard-realtime')
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'rsvps' }, 
        () => refetch()
      )
      .on(
        'postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'events' }, 
        () => refetch()
      )
      .subscribe();

    return () => { 
      supabase.removeChannel(channel); 
    };
  }, [refetch]);

  const toggleEventExpansion = (eventId: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const handleQRScan = async (scannedText: string) => {
    const trimmedText = scannedText.trim();
    
    if (trimmedText.startsWith('http')) {
      showError("This is the general Invite Link. Please scan a Guest's unique Elite Pass.");
      return;
    }

    const { data: rsvp, error: fetchError } = await supabase
      .from('rsvps')
      .select('*, events(id, event_name)')
      .eq('id', trimmedText)
      .maybeSingle();

    if (fetchError || !rsvp) {
      showError("Ticket not recognized. Please ensure the guest has RSVP'd.");
      return;
    }

    if (rsvp.event_id !== activeEventId) {
      showError(`Wrong Event: This ticket is for "${rsvp.events?.event_name}"`);
      return;
    }

    if (rsvp.checked_in) {
      showSuccess(`${rsvp.guest_name} is already checked in.`);
      return;
    }

    const { error: updateError } = await supabase
      .from('rsvps')
      .update({ checked_in: true })
      .eq('id', trimmedText);

    if (updateError) {
      showError("Check-in failed. Please try again.");
    } else {
      showSuccess(`Welcome, ${rsvp.guest_name}!`);
      refetch();
    }
  };

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/event/${slug.trim()}`;
    navigator.clipboard.writeText(url);
    showSuccess('Link copied to clipboard!');
  };

  const downloadGuestList = (event: any) => {
    const headers = ['Name', 'Phone', 'Status', 'RSVP Date'];
    const rows = event.rsvps.map((r: any) => [
      r.guest_name,
      r.guest_phone,
      r.checked_in ? 'Checked In' : 'Pending',
      new Date(r.created_at).toLocaleDateString()
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${event.event_name}_GuestList.csv`);
    link.click();
    showSuccess('Guest list downloaded!');
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f0f] text-white">
      <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37] mb-4" />
      <p className="text-[10px] font-bold tracking-[0.5em] uppercase animate-pulse">Syncing Atelier...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white overflow-x-hidden">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 md:py-24 px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12 md:mb-24">
          <div>
            <span className="text-[#D4AF37] text-[8px] md:text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">The Host's Atelier</span>
            <h1 className="text-4xl md:text-7xl font-serif italic text-white leading-tight">Your <span className="text-[#D4AF37]">Celebrations</span></h1>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              className="flex-1 md:flex-none border-white/10 bg-white/5 text-white rounded-none px-6 py-6"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Link to="/create-event" className="flex-[3] md:flex-none">
              <Button className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-none px-8 md:px-10 py-6 text-[8px] md:text-[10px] font-bold tracking-[0.2em] uppercase shadow-xl shadow-[#D4AF37]/10">
                <Plus className="w-4 h-4 mr-2" /> New Event
              </Button>
            </Link>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-24 md:py-40 border border-dashed border-white/10 bg-white/5 px-6">
            <Sparkles className="w-12 h-12 text-[#D4AF37] mx-auto mb-8 opacity-20" />
            <h3 className="text-2xl font-serif italic mb-4">The stage is set...</h3>
            <Link to="/create-event"><Button className="bg-[#D4AF37] text-black rounded-none px-12 py-8">Create Your First Event</Button></Link>
          </div>
        ) : (
          <div className="space-y-8 md:space-y-12">
            {events.map((event: any) => {
              const isExpanded = expandedEvents.has(event.id);
              
              return (
                <motion.div 
                  key={event.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-white/5 bg-white/[0.02] overflow-hidden"
                >
                  {/* Event Header / Toggle */}
                  <div 
                    onClick={() => toggleEventExpansion(event.id)}
                    className="p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6 cursor-pointer hover:bg-white/[0.04] transition-colors group"
                  >
                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className="w-16 h-20 md:w-20 md:h-24 border border-white/10 overflow-hidden shrink-0">
                        <img src={event.photo_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-serif italic text-white mb-2">{event.event_name}</h2>
                        <div className="flex items-center gap-4">
                          <span className={`text-[8px] font-black px-2 py-0.5 uppercase tracking-widest ${event.is_paid ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
                            {event.is_paid ? 'Live' : 'Pending'}
                          </span>
                          <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500">
                            {event.rsvps?.length || 0} RSVPs
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                      <div className="hidden md:flex flex-col items-end">
                        <p className="text-[8px] font-bold uppercase tracking-widest text-gray-500 mb-1">Event Date</p>
                        <p className="text-[10px] font-bold text-white uppercase tracking-widest">
                          {new Date(event.event_date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        className="text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-none px-6 py-6 text-[10px] font-bold uppercase tracking-widest"
                      >
                        {isExpanded ? <><ChevronUp className="w-4 h-4 mr-2" /> Close</> : <><Settings2 className="w-4 h-4 mr-2" /> Manage Event</>}
                      </Button>
                    </div>
                  </div>

                  {/* Collapsible Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                      >
                        <div className="p-6 md:p-12 border-t border-white/5 bg-black/40">
                          <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
                            <EventCard event={event} onCopyLink={copyLink} />
                            
                            <div className="lg:col-span-8">
                              <div className="mb-8 md:mb-12">
                                <BroadcastBox eventId={event.id} currentMessage={event.broadcast_message} />
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
                                {[
                                  { icon: Users, label: 'Total RSVPs', value: event.rsvps?.length || 0 },
                                  { icon: CheckCircle2, label: 'Checked In', value: event.rsvps?.filter((r: any) => r.checked_in).length || 0 },
                                  { icon: Eye, label: 'Page Views', value: event.view_count || 0 },
                                  { icon: TrendingUp, label: 'Status', value: event.is_paid ? 'Active' : 'Pending' }
                                ].map((stat, i) => (
                                  <div key={i} className="bg-white/5 p-6 md:p-8 border border-white/5 text-center">
                                    <stat.icon className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-3 md:mb-4 text-[#D4AF37]" />
                                    <div className="text-xl md:text-2xl font-serif italic text-white mb-1">{stat.value}</div>
                                    <div className="text-[7px] md:text-[8px] text-gray-500 uppercase tracking-[0.3em] font-bold">{stat.label}</div>
                                  </div>
                                ))}
                              </div>

                              <Tabs defaultValue="guests" className="w-full">
                                <TabsList className="bg-transparent p-0 h-auto border-b border-white/5 w-full justify-start gap-8 md:gap-12 mb-8 md:mb-12 rounded-none overflow-x-auto">
                                  <TabsTrigger value="guests" className="bg-transparent border-none p-0 pb-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 data-[state=active]:text-white whitespace-nowrap">Guest List</TabsTrigger>
                                  <TabsTrigger value="tools" className="bg-transparent border-none p-0 pb-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 data-[state=active]:text-white whitespace-nowrap">Concierge Tools</TabsTrigger>
                                </TabsList>
                                <TabsContent value="guests">
                                  <GuestList 
                                    rsvps={event.rsvps || []} 
                                    searchQuery={searchQuery} 
                                    onSearchChange={setSearchQuery} 
                                    onOpenScanner={() => { setActiveEventId(event.id); setIsScannerOpen(true); }} 
                                    onExportCSV={() => downloadGuestList(event)} 
                                    onToggleCheckIn={() => refetch()} 
                                  />
                                </TabsContent>
                                <TabsContent value="tools">
                                  <ConciergeTools 
                                    event={event} 
                                    onSendWhatsAppBlast={() => {
                                      setActiveEvent(event);
                                      setIsBlastOpen(true);
                                    }} 
                                  />
                                </TabsContent>
                              </Tabs>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      <QRScannerOverlay isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onScan={handleQRScan} />
      {activeEvent && (
        <WhatsAppBlast 
          isOpen={isBlastOpen} 
          onClose={() => setIsBlastOpen(false)} 
          event={activeEvent} 
          rsvps={activeEvent.rsvps || []} 
        />
      )}
    </div>
  );
};

export default Dashboard;