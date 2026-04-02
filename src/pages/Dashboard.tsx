"use client";

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { showSuccess, showError } from '@/utils/toast';
import { User, Sparkles, Users, CheckCircle2, Eye, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

// Modular Components
import EventCard from '@/components/dashboard/EventCard';
import GuestList from '@/components/dashboard/GuestList';
import Analytics from '@/components/dashboard/Analytics';
import ConciergeTools from '@/components/dashboard/ConciergeTools';
import QRScannerOverlay from '@/components/dashboard/QRScannerOverlay';

const Dashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();

    const channel = supabase
      .channel('dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rsvps' }, () => fetchEvents())
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'events' }, () => fetchEvents())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchEvents = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const { data, error } = await supabase
      .from('events')
      .select('*, rsvps(*)')
      .eq('host_id', user.id)
      .order('created_at', { ascending: false });

    if (error) showError(error.message);
    else setEvents(data || []);
    setLoading(false);
  };

  const toggleCheckIn = async (rsvpId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('rsvps')
      .update({ checked_in: !currentStatus })
      .eq('id', rsvpId);
    
    if (error) showError("Update failed");
    else showSuccess(!currentStatus ? "Guest checked in!" : "Check-in reversed");
  };

  const handleQRScan = async (scannedText: string) => {
    const trimmedText = scannedText.trim();
    const { data: rsvp, error: fetchError } = await supabase
      .from('rsvps')
      .select('*, events(id, event_name)')
      .eq('id', trimmedText)
      .single();

    if (fetchError || !rsvp) {
      showError("Ticket not found in the registry.");
      return;
    }

    if (rsvp.event_id !== activeEventId) {
      showError(`This ticket belongs to another event: ${rsvp.events?.event_name}`);
      return;
    }

    const { error: updateError } = await supabase
      .from('rsvps')
      .update({ checked_in: true })
      .eq('id', trimmedText);

    if (updateError) showError("Check-in failed.");
    else {
      showSuccess(`Welcome, ${rsvp.guest_name}!`);
      fetchEvents();
    }
  };

  const copyLink = (slug: string) => {
    // We ensure the slug is trimmed and exactly as it appears in the DB
    const cleanSlug = slug.trim();
    const url = `${window.location.origin}/event/${cleanSlug}`;
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

  const sendWhatsAppBlast = (event: any) => {
    const url = `${window.location.origin}/event/${event.slug.trim()}`;
    const message = `✨ You are cordially invited to ${event.event_name} ✨\n\nPlease view the official invitation and RSVP here: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f] text-white"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white overflow-x-hidden">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 md:py-24 px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 md:mb-24">
          <div>
            <span className="text-[#D4AF37] text-[8px] md:text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">The Host's Atelier</span>
            <h1 className="text-4xl md:text-7xl font-serif italic text-white leading-tight">Your <span className="text-[#D4AF37]">Celebrations</span></h1>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Link to="/create-event" className="flex-1 md:flex-none">
              <Button className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-none px-8 md:px-10 py-6 text-[8px] md:text-[10px] font-bold tracking-[0.2em] uppercase shadow-xl shadow-[#D4AF37]/10">
                + New Event
              </Button>
            </Link>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-40 border border-dashed border-white/10 bg-white/5">
            <Sparkles className="w-12 h-12 text-[#D4AF37] mx-auto mb-8 opacity-20" />
            <h3 className="text-2xl font-serif italic mb-4">The stage is set...</h3>
            <Link to="/create-event"><Button className="bg-[#D4AF37] text-black rounded-none px-12 py-8">Create Your First Event</Button></Link>
          </div>
        ) : (
          <div className="space-y-24">
            {events.map((event, index) => (
              <motion.div key={event.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="grid lg:grid-cols-12 gap-12">
                  <EventCard event={event} onCopyLink={copyLink} />
                  <div className="lg:col-span-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                      {[
                        { icon: Users, label: 'Total RSVPs', value: event.rsvps.length },
                        { icon: CheckCircle2, label: 'Checked In', value: event.rsvps.filter((r: any) => r.checked_in).length },
                        { icon: Eye, label: 'Page Views', value: event.view_count },
                        { icon: TrendingUp, label: 'Status', value: event.is_paid ? 'Active' : 'Pending' }
                      ].map((stat, i) => (
                        <div key={i} className="bg-white/5 p-8 border border-white/5 text-center">
                          <stat.icon className="w-5 h-5 mx-auto mb-4 text-[#D4AF37]" />
                          <div className="text-2xl font-serif italic text-white mb-1">{stat.value}</div>
                          <div className="text-[8px] text-gray-500 uppercase tracking-[0.3em] font-bold">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    <Tabs defaultValue="guests" className="w-full">
                      <TabsList className="bg-transparent p-0 h-auto border-b border-white/5 w-full justify-start gap-12 mb-12 rounded-none">
                        <TabsTrigger value="guests" className="bg-transparent border-none p-0 pb-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 data-[state=active]:text-white">Guest List</TabsTrigger>
                        <TabsTrigger value="tools" className="bg-transparent border-none p-0 pb-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 data-[state=active]:text-white">Concierge Tools</TabsTrigger>
                      </TabsList>
                      <TabsContent value="guests">
                        <GuestList rsvps={event.rsvps} searchQuery={searchQuery} onSearchChange={setSearchQuery} onOpenScanner={() => { setActiveEventId(event.id); setIsScannerOpen(true); }} onExportCSV={() => downloadGuestList(event)} onToggleCheckIn={toggleCheckIn} />
                      </TabsContent>
                      <TabsContent value="tools">
                        <ConciergeTools event={event} onSendWhatsAppBlast={() => sendWhatsAppBlast(event)} />
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <QRScannerOverlay isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onScan={handleQRScan} />
    </div>
  );
};

export default Dashboard;