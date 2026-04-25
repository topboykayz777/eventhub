"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { showSuccess, showError } from '@/utils/toast';
import { RefreshCw, Plus, ChevronUp, Settings2, Calendar, AlertTriangle, Loader2, Eye, EyeOff, Coins, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import confetti from 'canvas-confetti';

import EventCard from '@/components/dashboard/EventCard';
import GuestList from '@/components/dashboard/GuestList';
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
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [lastSpray, setLastSpray] = useState<any>(null);
  
  const eventsRef = useRef<any[]>([]);
  const hasCheckedMissedSprays = useRef(false);

  const { data: events = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['host-dashboard-data'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return [];
      }

      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('host_id', user.id)
        .order('created_at', { ascending: false });

      if (eventsError) throw eventsError;

      const enriched = await Promise.all((eventsData || []).map(async (event) => {
        const { data: rsvps } = await supabase.from('rsvps').select('*').eq('event_id', event.id);
        const { data: toasts } = await supabase.from('toasts').select('*').eq('event_id', event.id);
        
        // Check for missed sprays (sprays that happened in the last 30 minutes)
        if (!hasCheckedMissedSprays.current) {
          const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
          const { data: recentSprays } = await supabase
            .from('budget_items')
            .select('*')
            .eq('event_id', event.id)
            .eq('type', 'income')
            .ilike('description', '%Digital Spray%')
            .gt('created_at', thirtyMinsAgo)
            .order('created_at', { ascending: false })
            .limit(1);

          if (recentSprays && recentSprays.length > 0) {
            setTimeout(() => triggerSprayAnimation(recentSprays[0]), 2000);
            hasCheckedMissedSprays.current = true;
          }
        }

        return { ...event, rsvps: rsvps || [], toasts: toasts || [] };
      }));

      eventsRef.current = enriched;
      return enriched;
    }
  });

  useEffect(() => {
    const channel = supabase
      .channel('dashboard-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'budget_items' },
        (payload) => {
          const newItem = payload.new;
          const isMyEvent = eventsRef.current.some(e => e.id === newItem.event_id);
          
          if (isMyEvent && newItem.type === 'income' && newItem.description.includes('Digital Spray')) {
            triggerSprayAnimation(newItem);
            queryClient.invalidateQueries({ queryKey: ['host-dashboard-data'] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const triggerSprayAnimation = (spray: any) => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#ffffff', '#F9E4B7']
    });
    
    setLastSpray(spray);
    setTimeout(() => setLastSpray(null), 8000);
  };

  useEffect(() => {
    if (events.length > 0 && expandedEvents.size === 0) {
      setExpandedEvents(new Set([events[0].id]));
    }
  }, [events]);

  const toggleEventExpansion = (eventId: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) newExpanded.delete(eventId);
    else newExpanded.add(eventId);
    setExpandedEvents(newExpanded);
  };

  const toggleToastLive = async (toastId: string, currentStatus: boolean) => {
    const { error } = await supabase.from('toasts').update({ is_live: !currentStatus }).eq('id', toastId);
    if (error) showError(error.message);
    else {
      showSuccess(!currentStatus ? "Toast is now live!" : "Toast hidden.");
      refetch();
    }
  };

  const handleQRScan = async (scannedText: string) => {
    const trimmedText = scannedText.trim();
    const { data: rsvp } = await supabase.from('rsvps').select('*, events(id, event_name)').eq('id', trimmedText).maybeSingle();
    if (!rsvp) { showError("Ticket not recognized."); return; }
    if (rsvp.event_id !== activeEventId) { showError("Wrong Event Ticket."); return; }
    if (rsvp.checked_in) { showSuccess(`${rsvp.guest_name} is already checked in.`); return; }
    
    const { error } = await supabase.from('rsvps').update({ checked_in: true }).eq('id', trimmedText);
    if (error) showError("Check-in failed.");
    else { showSuccess(`Welcome, ${rsvp.guest_name}!`); refetch(); }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f] text-white">
      <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      
      <AnimatePresence>
        {lastSpray && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] w-full max-w-md px-6"
          >
            <div className="bg-[#D4AF37] text-black p-8 rounded-[2rem] shadow-2xl flex items-center gap-6 border-4 border-white/20">
              <div className="w-16 h-16 rounded-full bg-black/10 flex items-center justify-center shrink-0">
                <Coins className="w-8 h-8 animate-bounce" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1">New Digital Spray!</p>
                <h4 className="text-2xl font-serif italic mb-1">₦{lastSpray.amount.toLocaleString()}</h4>
                <p className="text-[8px] font-bold uppercase tracking-widest opacity-60 truncate">{lastSpray.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto py-12 md:py-24 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12 md:mb-24">
          <div>
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">The Host's Atelier</span>
            <h1 className="text-4xl md:text-7xl font-serif italic text-white">Your <span className="text-[#D4AF37]">Celebrations</span></h1>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => refetch()} className="border-white/10 bg-white/5 text-white rounded-none px-6 py-6"><RefreshCw className="w-4 h-4" /></Button>
            <Link to="/create-event"><Button className="bg-[#D4AF37] text-black rounded-none px-10 py-6 text-[10px] font-bold tracking-[0.2em] uppercase shadow-xl shadow-[#D4AF37]/10"><Plus className="w-4 h-4 mr-2" /> New Event</Button></Link>
          </div>
        </div>

        {isError && (
          <div className="p-12 border border-red-500/20 bg-red-500/5 text-center mb-12 rounded-[2rem]">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-6" />
            <h3 className="text-xl font-serif italic text-white mb-2">Vault Connection Error</h3>
            <Button onClick={() => refetch()} variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-none px-12 py-6 text-[10px] font-bold uppercase tracking-widest">Retry Connection</Button>
          </div>
        )}

        <div className="space-y-12">
          {events.length === 0 && !isLoading && !isError && (
            <div className="text-center py-32 border border-dashed border-white/10 rounded-[3rem]">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8">
                <Calendar className="text-gray-600 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif italic text-white mb-4">No Masterpieces Yet</h3>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-10">Your event portfolio is currently empty.</p>
              <Link to="/create-event">
                <Button className="bg-[#D4AF37] text-black rounded-none px-12 py-8 text-[10px] font-bold tracking-[0.2em] uppercase">Create Your First Event</Button>
              </Link>
            </div>
          )}

          {events.map((event: any) => {
            const isExpanded = expandedEvents.has(event.id);
            return (
              <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border border-white/5 bg-white/[0.02] overflow-hidden rounded-[2rem]">
                <div onClick={() => toggleEventExpansion(event.id)} className="p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6 cursor-pointer hover:bg-white/[0.04] transition-colors group">
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="w-16 h-20 md:w-20 md:h-24 border border-white/10 overflow-hidden shrink-0">
                      <img src={event.photo_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-serif italic text-white mb-2">{event.event_name}</h2>
                      <div className="flex items-center gap-4">
                        <span className={`text-[8px] font-black px-2 py-0.5 uppercase tracking-widest ${event.is_paid ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>{event.is_paid ? 'Live' : 'Pending'}</span>
                        <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500">{event.rsvps?.length || 0} RSVPs</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" className="text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-none px-6 py-6 text-[10px] font-bold uppercase tracking-widest">
                    {isExpanded ? <><ChevronUp className="w-4 h-4 mr-2" /> Close</> : <><Settings2 className="w-4 h-4 mr-2" /> Manage Event</>}
                  </Button>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}>
                      <div className="p-6 md:p-12 border-t border-white/5 bg-black/40">
                        <div className="grid lg:grid-cols-12 gap-12">
                          <EventCard event={event} onCopyLink={() => {}} />
                          <div className="lg:col-span-8">
                            <BroadcastBox eventId={event.id} currentMessage={event.broadcast_message} />
                            
                            <Tabs defaultValue="guests" className="w-full mt-12">
                              <TabsList className="bg-transparent p-0 h-auto border-b border-white/5 w-full justify-start gap-12 mb-12 rounded-none">
                                <TabsTrigger value="guests" className="bg-transparent border-none p-0 pb-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 data-[state=active]:text-white">Guest List</TabsTrigger>
                                <TabsTrigger value="toasts" className="bg-transparent border-none p-0 pb-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 data-[state=active]:text-white">Digital Toasts</TabsTrigger>
                                <TabsTrigger value="tools" className="bg-transparent border-none p-0 pb-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 data-[state=active]:text-white">Concierge Tools</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="guests">
                                <GuestList rsvps={event.rsvps || []} searchQuery={searchQuery} onSearchChange={setSearchQuery} onOpenScanner={() => { setActiveEventId(event.id); setIsScannerOpen(true); }} onExportCSV={() => {}} onToggleCheckIn={() => refetch()} />
                              </TabsContent>

                              <TabsContent value="toasts">
                                <div className="space-y-6">
                                  {!event.toasts || event.toasts.length === 0 ? (
                                    <div className="text-center py-20 border border-dashed border-white/5 text-gray-500 text-[10px] font-bold uppercase tracking-widest rounded-[2rem]">No toasts recorded yet.</div>
                                  ) : (
                                    <div className="grid gap-4">
                                      {event.toasts.map((toast: any) => (
                                        <div key={toast.id} className="p-6 bg-white/5 border border-white/5 flex justify-between items-center group rounded-xl">
                                          <div>
                                            <p className="text-sm font-light italic mb-2">"{toast.content}"</p>
                                            <p className="text-[8px] font-bold uppercase tracking-widest text-[#D4AF37]">— {toast.guest_name}</p>
                                          </div>
                                          <Button onClick={() => toggleToastLive(toast.id, toast.is_live)} variant="ghost" className={`rounded-none text-[8px] font-black uppercase tracking-widest ${toast.is_live ? 'text-green-500' : 'text-gray-500'}`}>
                                            {toast.is_live ? <><Eye className="w-3 h-3 mr-2" /> Live</> : <><EyeOff className="w-3 h-3 mr-2" /> Hidden</>}
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </TabsContent>

                              <TabsContent value="tools">
                                <ConciergeTools event={event} onSendWhatsAppBlast={() => { setActiveEvent(event); setIsBlastOpen(true); }} />
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
      </div>
      <QRScannerOverlay isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onScan={handleQRScan} />
      {activeEvent && <WhatsAppBlast isOpen={isBlastOpen} onClose={() => setIsBlastOpen(false)} event={activeEvent} rsvps={activeEvent.rsvps || []} />}
    </div>
  );
};

export default Dashboard;