"use client";

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { showSuccess, showError } from '@/utils/toast';
import { RefreshCw, Plus, Loader2, CheckCircle2, LayoutDashboard, Sparkles, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/components/SessionProvider';

import EventCard from '@/components/dashboard/EventCard';
import GuestList from '@/components/dashboard/GuestList';
import ConciergeTools from '@/components/dashboard/ConciergeTools';
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
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!sessionLoading && !user) {
      navigate('/login');
    }
  }, [user, sessionLoading, navigate]);
  
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['host-dashboard-data', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: eventsData, error } = await supabase
        .from('events')
        .select('*')
        .eq('host_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!eventsData || eventsData.length === 0) return [];

      const eventIds = eventsData.map(e => e.id);

      const { data: allRSVPs, error: rsvpError } = await supabase
        .from('rsvps')
        .select('*')
        .in('event_id', eventIds);

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
    staleTime: 1000 * 30,
  });

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['host-dashboard-data'] });
    setTimeout(() => setIsRefreshing(false), 1000);
    showSuccess("Dashboard Synchronized.");
  };

  const isVideo = (url: string) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.quicktime'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  const handleQRScan = async (scannedText: string) => {
    if (!scannedText) return;
    
    let rsvpId = scannedText.trim();
    let isPlusOne = false;

    if (rsvpId.includes(':plus-one')) {
      rsvpId = rsvpId.split(':plus-one')[0];
      isPlusOne = true;
    }

    if (rsvpId.includes('/')) {
      const parts = rsvpId.split('/');
      rsvpId = parts[parts.length - 1];
    }

    rsvpId = rsvpId.split('?')[0].split('#')[0];

    const updateData = isPlusOne ? { plus_one_checked_in: true } : { checked_in: true };

    try {
      const { data, error } = await supabase
        .from('rsvps')
        .update(updateData)
        .eq('id', rsvpId)
        .select('guest_name')
        .maybeSingle();

      if (error || !data) {
        showError("Pass not found or invalid.");
      } else { 
        showSuccess(`${data.guest_name}${isPlusOne ? "'s Plus One" : ""} verified and checked in.`); 
        queryClient.invalidateQueries({ queryKey: ['host-dashboard-data'] });
      }
    } catch (err) {
      showError("Invalid pass format.");
    }
  };

  if (sessionLoading || (isLoading && events.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505]">
        <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  const activeEventIds = events.map((e: any) => e.id);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-black">
      <Navbar />
      
      <DigitalSpray eventIds={activeEventIds} />

      <div className="max-w-7xl mx-auto py-8 md:py-24 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 mb-12 md:mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">Planner Command Center</span>
            <h1 className="text-4xl md:text-8xl font-serif italic">The <span className="text-[#D4AF37]">Orchestration</span></h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-4 w-full md:w-auto"
          >
            <Button 
              variant="outline" 
              onClick={handleManualRefresh}
              className="flex-1 md:flex-none border-white/10 bg-white/5 text-white rounded-2xl px-8 py-7 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              <RefreshCw className={`w-4 h-4 mr-3 ${isRefreshing ? 'animate-spin' : ''}`} /> Sync Dashboard
            </Button>
            <Link to="/create-event" className="flex-1 md:flex-none">
              <Button className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-2xl px-12 py-7 text-[10px] font-black uppercase tracking-widest transition-all duration-500 shadow-2xl">
                <Plus className="w-4 h-4 mr-3" /> New Event
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="space-y-8 md:space-y-12">
          {events.map((event: any, index: number) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border ${event.isCompleted ? 'border-white/5 bg-white/[0.01]' : 'border-white/10 bg-white/[0.03]'} rounded-[3rem] overflow-hidden transition-all hover:border-[#D4AF37]/20`}
            >
              <div 
                onClick={() => {
                  const newExpanded = new Set(expandedEvents);
                  if (newExpanded.has(event.id)) newExpanded.delete(event.id);
                  else newExpanded.add(event.id);
                  setExpandedEvents(newExpanded);
                }} 
                className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 cursor-pointer hover:bg-white/[0.05] transition-colors"
              >
                <div className="flex items-center gap-6 md:gap-10 w-full md:w-auto">
                  <div className="relative shrink-0">
                    {isVideo(event.photo_url) ? (
                      <video 
                        src={event.photo_url} 
                        className={`w-20 h-24 md:w-28 md:h-36 object-cover border border-white/10 rounded-2xl ${event.isCompleted ? 'grayscale' : ''}`}
                        muted
                        loop
                        autoPlay
                        playsInline
                      />
                    ) : (
                      <img 
                        src={event.photo_url} 
                        className={`w-20 h-24 md:w-28 md:h-36 object-cover border border-white/10 rounded-2xl ${event.isCompleted ? 'grayscale' : ''}`} 
                        alt="" 
                      />
                    )}
                    {event.isCompleted && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl">
                        <CheckCircle2 className="text-white w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-4 mb-3">
                      <h2 className={`text-2xl md:text-5xl font-serif italic ${event.isCompleted ? 'text-gray-500' : 'text-white'}`}>{event.event_name}</h2>
                      {event.isCompleted ? (
                        <span className="text-[8px] font-black uppercase tracking-widest bg-gray-800 text-gray-400 px-3 py-1.5 rounded-full">Completed</span>
                      ) : (
                        <span className="text-[8px] font-black uppercase tracking-widest bg-green-500/20 text-green-500 px-3 py-1.5 rounded-full flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-50 animate-pulse" /> Live
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] md:text-[12px] font-bold uppercase tracking-[0.3em] text-gray-600">
                      {new Date(event.event_date).toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-6 md:pt-0">
                  <div className="text-left md:text-right">
                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-600 mb-1">Live Engagement</p>
                    <p className="text-xl md:text-3xl font-serif italic text-[#D4AF37]">{event.rsvps.length} Verified Guests</p>
                  </div>
                  <Button variant="ghost" className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#D4AF37]/10 px-6 py-4 rounded-full border border-[#D4AF37]/20">
                    {expandedEvents.has(event.id) ? 'Close' : 'Manage'}
                  </Button>
                </div>
              </div>

              <AnimatePresence>
                {expandedEvents.has(event.id) && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }} 
                    className="overflow-hidden"
                  >
                    <div className="p-8 md:p-20 border-t border-white/5 bg-black/40">
                      <div className="grid lg:grid-cols-12 gap-12 md:gap-20">
                        <EventCard event={event} />
                        
                        <div className="lg:col-span-8">
                          <Tabs defaultValue="tools" className="w-full">
                            <TabsList className="bg-transparent border-b border-white/5 w-full justify-start gap-12 mb-12 rounded-none h-auto p-0 overflow-x-auto no-scrollbar">
                              <TabsTrigger value="tools" className="text-[10px] font-black uppercase tracking-[0.4em] pb-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] data-[state=active]:text-[#D4AF37] bg-transparent whitespace-nowrap">Concierge Tools</TabsTrigger>
                              <TabsTrigger value="guests" className="text-[10px] font-black uppercase tracking-[0.4em] pb-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] data-[state=active]:text-[#D4AF37] bg-transparent whitespace-nowrap">Guest Management</TabsTrigger>
                            </TabsList>
                            <TabsContent value="tools" className="mt-0 outline-none">
                              <ConciergeTools event={event} onSendWhatsAppBlast={() => { setActiveEvent(event); setIsBlastOpen(true); }} />
                            </TabsContent>
                            <TabsContent value="guests" className="mt-0 outline-none">
                              <BroadcastBox eventId={event.id} currentMessage={event.message} />
                              <GuestList 
                                event={event}
                                rsvps={event.rsvps} 
                                searchQuery={searchQuery} 
                                onSearchChange={setSearchQuery} 
                                onOpenScanner={() => { setActiveEventId(event.id); setIsScannerOpen(true); }} 
                                onUpdate={() => queryClient.invalidateQueries({ queryKey: ['host-dashboard-data'] })}
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
          ))}
          
          {events.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-48 border border-dashed border-white/10 rounded-[4rem]"
            >
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-10">
                <LayoutDashboard className="text-gray-600 w-10 h-10" />
              </div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.5em] px-6">No celebrations found in your archive.</p>
              <Link to="/create-event" className="mt-12 inline-block">
                <Button variant="link" className="text-[#D4AF37] uppercase tracking-widest text-[11px] font-black underline decoration-1 underline-offset-8">Create Your First Event</Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      <QRScannerOverlay isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onScan={handleQRScan} />
      {activeEvent && <WhatsAppBlast isOpen={isBlastOpen} onClose={() => setIsBlastOpen(false)} event={activeEvent} rsvps={activeEvent.rsvps} />}
    </div>
  );
};

export default Dashboard;