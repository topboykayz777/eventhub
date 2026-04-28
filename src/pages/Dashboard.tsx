"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { showSuccess, showError } from '@/utils/toast';
import { RefreshCw, Plus, Loader2, Coins, CheckCircle2, Clock, LayoutDashboard, Users, Sparkles, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import confetti from 'canvas-confetti';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isBlastOpen, setIsBlastOpen] = useState(false);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [activeEvent, setActiveEvent] = useState<any>(null);
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['host-dashboard-data'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/login'); return []; }

      const { data: eventsData, error } = await supabase
        .from('events')
        .select('*')
        .eq('host_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const enriched = await Promise.all((eventsData || []).map(async (event) => {
        const { data: rsvps } = await supabase.from('rsvps').select('*').eq('event_id', event.id);
        const isCompleted = new Date(event.event_date).getTime() + (24 * 60 * 60 * 1000) < Date.now();
        return { ...event, rsvps: rsvps || [], isCompleted };
      }));

      return enriched;
    },
    refetchInterval: 30000,
  });

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['host-dashboard-data'] });
    setTimeout(() => setIsRefreshing(false), 1000);
    showSuccess("Dashboard Synchronized.");
  };

  const handleQRScan = async (scannedText: string) => {
    let rsvpId = scannedText;
    if (scannedText.includes('/')) {
      const parts = scannedText.split('/');
      rsvpId = parts[parts.length - 1];
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(rsvpId)) {
      showError("Invalid pass format.");
      return;
    }

    const { data, error } = await supabase
      .from('rsvps')
      .update({ checked_in: true })
      .eq('id', rsvpId)
      .select('guest_name')
      .maybeSingle();

    if (error || !data) {
      showError("Pass not found or invalid.");
    } else { 
      showSuccess(`${data.guest_name} verified and checked in.`); 
      queryClient.invalidateQueries({ queryKey: ['host-dashboard-data'] });
    }
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-screen bg-[#050505]"><Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" /></div>;

  const activeEventIds = events.map((e: any) => e.id);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-black">
      <Navbar />
      
      <DigitalSpray eventIds={activeEventIds} />

      <div className="max-w-7xl mx-auto py-12 md:py-24 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">Planner Command Center</span>
            <h1 className="text-4xl md:text-7xl font-serif italic">The <span className="text-[#D4AF37]">Orchestration</span></h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-4 w-full md:w-auto"
          >
            <Button 
              variant="outline" 
              onClick={handleManualRefresh}
              className="flex-1 md:flex-none border-white/10 bg-white/5 text-white rounded-none px-8 py-6 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} /> Sync
            </Button>
            <Link to="/create-event" className="flex-1 md:flex-none">
              <Button className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-none px-10 py-6 text-[10px] font-bold uppercase tracking-widest transition-all duration-500">
                <Plus className="w-4 h-4 mr-2" /> New Event
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="space-y-12">
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
                className="p-10 flex flex-col md:flex-row justify-between items-center gap-8 cursor-pointer hover:bg-white/[0.05] transition-colors"
              >
                <div className="flex items-center gap-8 w-full md:w-auto">
                  <div className="relative shrink-0">
                    <img src={event.photo_url} className={`w-24 h-32 object-cover border border-white/10 rounded-2xl ${event.isCompleted ? 'grayscale' : ''}`} alt="" />
                    {event.isCompleted && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl">
                        <CheckCircle2 className="text-white w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-4 mb-3">
                      <h2 className={`text-3xl md:text-4xl font-serif italic ${event.isCompleted ? 'text-gray-500' : 'text-white'}`}>{event.event_name}</h2>
                      {event.isCompleted ? (
                        <span className="text-[8px] font-black uppercase tracking-widest bg-gray-800 text-gray-400 px-3 py-1.5 rounded-full">Completed</span>
                      ) : (
                        <span className="text-[8px] font-black uppercase tracking-widest bg-green-500/20 text-green-500 px-3 py-1.5 rounded-full flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600">
                      {new Date(event.event_date).toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right hidden sm:block">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-gray-600 mb-1">Engagement</p>
                    <p className="text-xl font-serif italic text-[#D4AF37]">{event.rsvps.length} RSVPs</p>
                  </div>
                  <Button variant="ghost" className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-[#D4AF37]/10">
                    {expandedEvents.has(event.id) ? 'Close Suite' : 'Manage Event'}
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
                    <div className="p-8 md:p-16 border-t border-white/5 bg-black/40">
                      <div className="grid lg:grid-cols-12 gap-16">
                        <EventCard event={event} onCopyLink={() => {}} />
                        
                        <div className="lg:col-span-8 space-y-12">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="glass-premium p-10 rounded-[2.5rem] border border-white/5">
                              <div className="flex items-center gap-4 mb-6">
                                <Users className="text-[#D4AF37] w-5 h-5" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Guest List</span>
                              </div>
                              <div className="text-4xl font-serif italic">{event.rsvps.length} Confirmed</div>
                            </div>
                            <div className="glass-premium p-10 rounded-[2.5rem] border border-white/5">
                              <div className="flex items-center gap-4 mb-6">
                                <Sparkles className="text-[#D4AF37] w-5 h-5" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Service Tier</span>
                              </div>
                              <div className="text-4xl font-serif italic">{event.plan} Suite</div>
                            </div>
                          </div>
                          
                          <BroadcastBox eventId={event.id} currentMessage={event.broadcast_message} />
                          
                          <Tabs defaultValue="tools" className="w-full">
                            <TabsList className="bg-transparent border-b border-white/5 w-full justify-start gap-12 mb-12 rounded-none h-auto p-0">
                              <TabsTrigger value="tools" className="text-[10px] font-bold uppercase tracking-[0.4em] pb-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] data-[state=active]:text-[#D4AF37] bg-transparent">Concierge Tools</TabsTrigger>
                              <TabsTrigger value="guests" className="text-[10px] font-bold uppercase tracking-[0.4em] pb-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] data-[state=active]:text-[#D4AF37] bg-transparent">Guest Management</TabsTrigger>
                            </TabsList>
                            <TabsContent value="tools" className="mt-0">
                              <ConciergeTools event={event} onSendWhatsAppBlast={() => { setActiveEvent(event); setIsBlastOpen(true); }} />
                            </TabsContent>
                            <TabsContent value="guests" className="mt-0">
                              <GuestList 
                                rsvps={event.rsvps} 
                                searchQuery={searchQuery} 
                                onSearchChange={setSearchQuery} 
                                onOpenScanner={() => { setActiveEventId(event.id); setIsScannerOpen(true); }} 
                                onExportCSV={() => {}} 
                                onToggleCheckIn={() => queryClient.invalidateQueries({ queryKey: ['host-dashboard-data'] })} 
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
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8">
                <LayoutDashboard className="text-gray-600 w-10 h-10" />
              </div>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.5em]">No celebrations found in your archive.</p>
              <Link to="/create-event" className="mt-10 inline-block">
                <Button variant="link" className="text-[#D4AF37] uppercase tracking-widest text-[10px] font-black">Create Your First Event</Button>
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