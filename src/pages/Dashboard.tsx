"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { showSuccess, showError } from '@/utils/toast';
import { RefreshCw, Plus, ChevronUp, Settings2, Calendar, AlertTriangle, Loader2, Eye, EyeOff, Coins, CheckCircle2, Clock } from 'lucide-react';
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const eventsRef = useRef<any[]>([]);

  const { data: events = [], isLoading, isError, refetch } = useQuery({
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
        const { data: toasts } = await supabase.from('toasts').select('*').eq('event_id', event.id);
        const isCompleted = new Date(event.event_date).getTime() + (24 * 60 * 60 * 1000) < Date.now();
        return { ...event, rsvps: rsvps || [], toasts: toasts || [], isCompleted };
      }));

      eventsRef.current = enriched;
      return enriched;
    },
    refetchInterval: 10000, // Fallback polling every 10s
  });

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
    showSuccess("Dashboard Synchronized.");
  };

  useEffect(() => {
    // Listen for new budget items (Digital Sprays)
    const channel = supabase
      .channel('dashboard-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'budget_items' },
        (payload) => {
          const newItem = payload.new;
          const isMyEvent = eventsRef.current.some(e => e.id === newItem.event_id);
          
          if (isMyEvent && newItem.type === 'income' && newItem.description.includes('Digital Spray')) {
            confetti({ 
              particleCount: 150, 
              spread: 70, 
              origin: { y: 0.6 }, 
              colors: ['#D4AF37', '#ffffff', '#F9E4B7'] 
            });
            setLastSpray(newItem);
            setTimeout(() => setLastSpray(null), 8000);
            queryClient.invalidateQueries({ queryKey: ['host-dashboard-data'] });
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'rsvps' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['host-dashboard-data'] });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  const handleQRScan = async (id: string) => {
    const { error } = await supabase.from('rsvps').update({ checked_in: true }).eq('id', id);
    if (error) showError("Invalid pass.");
    else { showSuccess("Guest checked in."); refetch(); }
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f]"><Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" /></div>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      
      <AnimatePresence>
        {lastSpray && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] w-full max-w-md px-6">
            <div className="bg-[#D4AF37] text-black p-8 rounded-[2rem] shadow-2xl flex items-center gap-6 border-4 border-white/20">
              <div className="w-16 h-16 rounded-full bg-black/10 flex items-center justify-center shrink-0">
                <Coins className="w-8 h-8 animate-bounce" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-1">New Digital Spray!</p>
                <h4 className="text-2xl font-serif italic">₦{lastSpray.amount.toLocaleString()}</h4>
                <p className="text-[8px] font-bold opacity-60">{lastSpray.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto py-12 md:py-24 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-24">
          <div>
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">Host Command Center</span>
            <h1 className="text-4xl md:text-7xl font-serif italic">Your <span className="text-[#D4AF37]">Celebrations</span></h1>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Button 
              variant="outline" 
              onClick={handleManualRefresh}
              className="flex-1 md:flex-none border-white/10 bg-white/5 text-white rounded-none px-8 py-6 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} /> Sync
            </Button>
            <Link to="/create-event" className="flex-1 md:flex-none">
              <Button className="w-full bg-[#D4AF37] text-black rounded-none px-10 py-6 text-[10px] font-bold uppercase tracking-widest">
                <Plus className="w-4 h-4 mr-2" /> New Event
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-12">
          {events.map((event: any) => (
            <div key={event.id} className={`border ${event.isCompleted ? 'border-white/5 bg-white/[0.01]' : 'border-white/10 bg-white/[0.03]'} rounded-[2rem] overflow-hidden transition-all`}>
              <div onClick={() => {
                const newExpanded = new Set(expandedEvents);
                if (newExpanded.has(event.id)) newExpanded.delete(event.id);
                else newExpanded.add(event.id);
                setExpandedEvents(newExpanded);
              }} className="p-10 flex justify-between items-center cursor-pointer hover:bg-white/[0.05]">
                <div className="flex items-center gap-8">
                  <div className="relative">
                    <img src={event.photo_url} className={`w-20 h-24 object-cover border border-white/10 ${event.isCompleted ? 'grayscale' : ''}`} alt="" />
                    {event.isCompleted && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <CheckCircle2 className="text-white w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <h2 className={`text-3xl font-serif italic ${event.isCompleted ? 'text-gray-500' : 'text-white'}`}>{event.event_name}</h2>
                      {event.isCompleted ? (
                        <span className="text-[8px] font-black uppercase tracking-widest bg-gray-800 text-gray-400 px-2 py-1 rounded">Completed</span>
                      ) : (
                        <span className="text-[8px] font-black uppercase tracking-widest bg-green-500/20 text-green-500 px-2 py-1 rounded flex items-center gap-1">
                          <Clock size={10} /> Active
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
                      {new Date(event.event_date).toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest">
                  {expandedEvents.has(event.id) ? 'Close' : 'Manage'}
                </Button>
              </div>

              <AnimatePresence>
                {expandedEvents.has(event.id) && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="p-12 border-t border-white/5 bg-black/40">
                      <div className="grid lg:grid-cols-12 gap-12">
                        <EventCard event={event} onCopyLink={() => {}} />
                        <div className="lg:col-span-8">
                          <BroadcastBox eventId={event.id} currentMessage={event.broadcast_message} />
                          <Tabs defaultValue="guests" className="mt-12">
                            <TabsList className="bg-transparent border-b border-white/5 w-full justify-start gap-12 mb-12 rounded-none">
                              <TabsTrigger value="guests" className="text-[10px] font-bold uppercase tracking-widest">Guest List</TabsTrigger>
                              <TabsTrigger value="tools" className="text-[10px] font-bold uppercase tracking-widest">Concierge Tools</TabsTrigger>
                            </TabsList>
                            <TabsContent value="guests">
                              <GuestList rsvps={event.rsvps} searchQuery={searchQuery} onSearchChange={setSearchQuery} onOpenScanner={() => { setActiveEventId(event.id); setIsScannerOpen(true); }} onExportCSV={() => {}} onToggleCheckIn={() => refetch()} />
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
            </div>
          ))}
          
          {events.length === 0 && (
            <div className="text-center py-40 border border-dashed border-white/10 rounded-[3rem]">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.5em]">No celebrations found in your archive.</p>
            </div>
          )}
        </div>
      </div>
      <QRScannerOverlay isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onScan={handleQRScan} />
      {activeEvent && <WhatsAppBlast isOpen={isBlastOpen} onClose={() => setIsBlastOpen(false)} event={activeEvent} rsvps={activeEvent.rsvps} />}
    </div>
  );
};

export default Dashboard;