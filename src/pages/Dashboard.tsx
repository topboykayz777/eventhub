"use client";

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { showSuccess, showError } from '@/utils/toast';
import { RefreshCw, Plus, Loader2, CheckCircle2, LayoutDashboard, Sparkles, Users, Power } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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
  
  // Performance: Select only necessary fields for the list
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['host-events-list'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/login'); return []; }

      const { data, error } = await supabase
        .from('events')
        .select('id, event_name, event_date, photo_url, is_paid, plan, slug, is_concluded, broadcast_message')
        .eq('host_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    staleTime: 30000, // Cache for 30 seconds
  });

  const [eventDetails, setEventDetails] = useState<Record<string, any>>({});
  
  const toggleExpand = async (eventId: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
      if (!eventDetails[eventId]) {
        const { data: rsvps } = await supabase.from('rsvps').select('id, guest_name, guest_phone, checked_in, table_number, has_plus_one, song_request').eq('event_id', eventId);
        setEventDetails(prev => ({ ...prev, [eventId]: rsvps || [] }));
      }
    }
    setExpandedEvents(newExpanded);
  };

  const handleConcludeEvent = async (eventId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('events')
      .update({ is_concluded: !currentStatus })
      .eq('id', eventId);

    if (error) showError(error.message);
    else {
      showSuccess(currentStatus ? "Event re-opened." : "Event marked as concluded.");
      queryClient.invalidateQueries({ queryKey: ['host-events-list'] });
    }
  };

  const handleQRScan = async (scannedText: string) => {
    let rsvpId = scannedText;
    if (scannedText.includes('/')) {
      const parts = scannedText.split('/');
      rsvpId = parts[parts.length - 1];
    }

    const { data, error } = await supabase
      .from('rsvps')
      .update({ checked_in: true })
      .eq('id', rsvpId)
      .select('guest_name, event_id')
      .maybeSingle();

    if (error || !data) {
      showError("Pass not found or invalid.");
    } else { 
      showSuccess(`${data.guest_name} verified.`); 
      const { data: updatedRsvps } = await supabase.from('rsvps').select('*').eq('event_id', data.event_id);
      setEventDetails(prev => ({ ...prev, [data.event_id]: updatedRsvps || [] }));
    }
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-screen bg-[#050505]"><Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" /></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
      <Navbar />
      
      <DigitalSpray eventIds={events.map(e => e.id)} />

      <div className="max-w-7xl mx-auto py-12 md:py-24 px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12 md:mb-20">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">Planner Command Center</span>
            <h1 className="text-4xl md:text-7xl font-serif italic">The <span className="text-[#D4AF37]">Orchestration</span></h1>
          </motion.div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['host-events-list'] })} className="flex-1 md:flex-none border-white/10 bg-white/5 text-white rounded-none px-8 py-6 text-[10px] font-bold uppercase tracking-widest">
              <RefreshCw className="w-4 h-4 mr-2" /> Sync
            </Button>
            <Link to="/create-event" className="flex-1 md:flex-none">
              <Button className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-none px-10 py-6 text-[10px] font-bold uppercase tracking-widest">
                <Plus className="w-4 h-4 mr-2" /> New Event
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-8">
          {events.map((event: any, index: number) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border ${event.is_concluded ? 'border-white/5 bg-white/[0.01]' : 'border-white/10 bg-white/[0.03]'} rounded-[2rem] md:rounded-[3rem] overflow-hidden transition-all hover:border-[#D4AF37]/20`}
            >
              <div 
                onClick={() => toggleExpand(event.id)} 
                className="p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-8 cursor-pointer hover:bg-white/[0.05] transition-colors"
              >
                <div className="flex items-center gap-6 md:gap-10 w-full md:w-auto">
                  <img src={event.photo_url} loading="lazy" className={`w-20 h-24 md:w-28 md:h-36 object-cover border border-white/10 rounded-2xl ${event.is_concluded ? 'grayscale' : ''}`} alt="" />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h2 className={`text-2xl md:text-4xl font-serif italic ${event.is_concluded ? 'text-gray-500' : 'text-white'}`}>{event.event_name}</h2>
                      {event.is_concluded ? (
                        <span className="text-[8px] font-black uppercase tracking-widest bg-white/10 text-gray-400 px-2 py-1 rounded-full">Concluded</span>
                      ) : (
                        <span className="text-[8px] font-black uppercase tracking-widest bg-green-500/20 text-green-500 px-2 py-1 rounded-full flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" /> Live</span>
                      )}
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600">
                      {new Date(event.event_date).toLocaleDateString('en-NG', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-8 md:gap-16 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-6 md:pt-0">
                  <Button 
                    variant="ghost" 
                    onClick={(e) => { e.stopPropagation(); handleConcludeEvent(event.id, event.is_concluded); }}
                    className={`text-[8px] font-black uppercase tracking-widest px-4 py-2 rounded-full border ${event.is_concluded ? 'border-green-500/30 text-green-500 hover:bg-green-500/10' : 'border-red-500/30 text-red-500 hover:bg-red-500/10'}`}
                  >
                    <Power className="w-3 h-3 mr-2" /> {event.is_concluded ? 'Re-open Event' : 'Conclude Event'}
                  </Button>
                  <Button variant="ghost" className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-[#D4AF37]/10">
                    {expandedEvents.has(event.id) ? 'Close' : 'Manage'}
                  </Button>
                </div>
              </div>

              <AnimatePresence>
                {expandedEvents.has(event.id) && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="p-6 md:p-16 border-t border-white/5 bg-black/40">
                      <div className="grid lg:grid-cols-12 gap-12 md:gap-20">
                        <EventCard event={event} onCopyLink={() => {}} />
                        
                        <div className="lg:col-span-8 space-y-12">
                          <BroadcastBox eventId={event.id} currentMessage={event.broadcast_message} />
                          
                          <Tabs defaultValue="tools" className="w-full">
                            <div className="overflow-x-auto custom-scrollbar pb-2">
                              <TabsList className="bg-transparent border-b border-white/5 w-full justify-start gap-8 md:gap-12 mb-8 md:mb-12 rounded-none h-auto p-0 min-w-max">
                                <TabsTrigger value="tools" className="text-[10px] font-bold uppercase tracking-[0.4em] pb-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] data-[state=active]:text-[#D4AF37] bg-transparent">Concierge Tools</TabsTrigger>
                                <TabsTrigger value="guests" className="text-[10px] font-bold uppercase tracking-[0.4em] pb-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] data-[state=active]:text-[#D4AF37] bg-transparent">Guest Management</TabsTrigger>
                              </TabsList>
                            </div>
                            <TabsContent value="tools" className="mt-0">
                              <ConciergeTools event={event} onSendWhatsAppBlast={() => { setActiveEvent(event); setIsBlastOpen(true); }} />
                            </TabsContent>
                            <TabsContent value="guests" className="mt-0">
                              {eventDetails[event.id] ? (
                                <GuestList 
                                  rsvps={eventDetails[event.id]} 
                                  searchQuery={searchQuery} 
                                  onSearchChange={setSearchQuery} 
                                  onOpenScanner={() => { setActiveEventId(event.id); setIsScannerOpen(true); }} 
                                  onExportCSV={() => {}} 
                                  onToggleCheckIn={() => {}} 
                                  onUpdate={async () => {
                                    const { data } = await supabase.from('rsvps').select('*').eq('event_id', event.id);
                                    setEventDetails(prev => ({ ...prev, [event.id]: data || [] }));
                                  }}
                                />
                              ) : (
                                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#D4AF37]" /></div>
                              )}
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
      {activeEvent && <WhatsAppBlast isOpen={isBlastOpen} onClose={() => setIsBlastOpen(false)} event={activeEvent} rsvps={eventDetails[activeEvent.id] || []} />}
    </div>
  );
};

export default Dashboard;