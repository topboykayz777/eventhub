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

    // Enable Realtime Subscription for RSVPs
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rsvps'
        },
        (payload) => {
          console.log('Realtime update received:', payload);
          fetchEvents(); // Refetch to update UI instantly
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
    else {
      showSuccess(!currentStatus ? "Guest checked in!" : "Check-in reversed");
      // fetchEvents() is handled by realtime subscription
    }
  };

  const handleQRScan = async (rsvpId: string) => {
    const { data: rsvp, error: fetchError } = await supabase
      .from('rsvps')
      .select('*, events(id)')
      .eq('id', rsvpId)
      .single();

    if (fetchError || !rsvp) {
      showError("Invalid QR Code");
      return;
    }

    if (rsvp.events.id !== activeEventId) {
      showError("This guest belongs to a different event");
      return;
    }

    if (rsvp.checked_in) {
      showSuccess(`${rsvp.guest_name} is already checked in`);
      return;
    }

    const { error: updateError } = await supabase
      .from('rsvps')
      .update({ checked_in: true })
      .eq('id', rsvpId);

    if (updateError) {
      showError("Check-in failed");
    } else {
      showSuccess(`Welcome, ${rsvp.guest_name}!`);
      // fetchEvents() is handled by realtime subscription
    }
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
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess('Guest list downloaded!');
  };

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/event/${slug}`;
    navigator.clipboard.writeText(url);
    showSuccess('Link copied!');
  };

  const sendWhatsAppBlast = (event: any) => {
    const message = `Hello! Just a reminder about ${event.event_name}. You can view the details and RSVP here: ${window.location.origin}/event/${event.slug}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f] text-white">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-gray-500">Accessing Vault...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white overflow-x-hidden">
      <Navbar />
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#D4AF37]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#e94560]/5 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto py-12 md:py-24 px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 md:mb-24">
          <div>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[#D4AF37] text-[8px] md:text-[10px] font-bold tracking-[0.3em] md:tracking-[0.5em] uppercase mb-4 block"
            >
              The Host's Atelier
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-7xl font-serif italic text-white leading-tight"
            >
              Your <span className="text-[#D4AF37]">Celebrations</span>
            </motion.h1>
          </div>
          <div className="flex flex-wrap gap-4 md:gap-6 w-full md:w-auto">
            <Link to="/profile" className="flex-1 md:flex-none">
              <Button variant="outline" className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-none px-6 md:px-8 py-6 text-[8px] md:text-[10px] font-bold tracking-[0.2em] uppercase">
                <User className="w-4 h-4 mr-2" /> Profile
              </Button>
            </Link>
            <Link to="/create-event" className="flex-1 md:flex-none">
              <Button className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-none px-8 md:px-10 py-6 text-[8px] md:text-[10px] font-bold tracking-[0.2em] uppercase shadow-xl shadow-[#D4AF37]/10">
                + New Event
              </Button>
            </Link>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-24 md:py-40 border border-dashed border-white/10 rounded-none bg-white/5 px-6">
            <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-[#D4AF37] mx-auto mb-8 opacity-20" />
            <h3 className="text-xl md:text-2xl font-serif italic mb-4">The stage is set...</h3>
            <p className="text-gray-500 mb-10 md:mb-12 max-w-md mx-auto font-light tracking-wide text-sm md:text-base">You haven't curated any events yet. Begin your legacy by creating your first masterpiece.</p>
            <Link to="/create-event">
              <Button className="bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-none px-10 md:px-12 py-6 md:py-8 text-[8px] md:text-[10px] font-bold tracking-[0.3em] uppercase">
                Create Your First Event
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-16 md:space-y-24">
            {events.map((event, index) => {
              const checkedInCount = event.rsvps.filter((r: any) => r.checked_in).length;

              return (
                <motion.div 
                  key={event.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
                    <EventCard event={event} onCopyLink={copyLink} />

                    <div className="lg:col-span-8">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
                        {[
                          { icon: Users, label: 'Total RSVPs', value: event.rsvps.length },
                          { icon: CheckCircle2, label: 'Checked In', value: `${checkedInCount}/${event.rsvps.length}` },
                          { icon: Eye, label: 'Page Views', value: event.view_count },
                          { icon: TrendingUp, label: 'Status', value: event.is_paid ? 'Active' : 'Pending' }
                        ].map((stat, i) => (
                          <div key={i} className="bg-white/5 p-6 md:p-8 border border-white/5 text-center">
                            <stat.icon className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-3 md:mb-4 text-[#D4AF37]" />
                            <div className="text-xl md:text-2xl font-serif italic text-white mb-1">{stat.value}</div>
                            <div className="text-[7px] md:text-[8px] text-gray-500 uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold">{stat.label}</div>
                          </div>
                        ))}
                      </div>

                      <Tabs defaultValue="guests" className="w-full">
                        <TabsList className="bg-transparent p-0 h-auto border-b border-white/5 w-full justify-start gap-6 md:gap-12 mb-8 md:mb-12 rounded-none overflow-x-auto no-scrollbar">
                          <TabsTrigger value="guests" className="bg-transparent border-none p-0 pb-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-500 data-[state=active]:text-white whitespace-nowrap">
                            Guest List
                          </TabsTrigger>
                          <TabsTrigger value="analytics" className="bg-transparent border-none p-0 pb-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-500 data-[state=active]:text-white whitespace-nowrap">
                            Analytics
                          </TabsTrigger>
                          <TabsTrigger value="tools" className="bg-transparent border-none p-0 pb-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-500 data-[state=active]:text-white whitespace-nowrap">
                            Concierge Tools
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="guests" className="mt-0">
                          <GuestList 
                            rsvps={event.rsvps}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            onOpenScanner={() => {
                              setActiveEventId(event.id);
                              setIsScannerOpen(true);
                            }}
                            onExportCSV={() => downloadGuestList(event)}
                            onToggleCheckIn={toggleCheckIn}
                          />
                        </TabsContent>

                        <TabsContent value="analytics" className="mt-0">
                          <Analytics rsvps={event.rsvps} />
                        </TabsContent>

                        <TabsContent value="tools" className="mt-0">
                          <ConciergeTools 
                            event={event} 
                            onSendWhatsAppBlast={() => sendWhatsAppBlast(event)} 
                          />
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <QRScannerOverlay 
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleQRScan}
      />
    </div>
  );
};

export default Dashboard;