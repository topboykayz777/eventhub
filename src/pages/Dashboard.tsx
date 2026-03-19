"use client";

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { showSuccess, showError } from '@/utils/toast';
import { 
  Copy, MessageCircle, Eye, Users, ExternalLink, Edit, 
  Download, User, Wallet, Store, CreditCard, Sparkles, 
  Calendar, TrendingUp, Search, CheckCircle2, Circle, FileDown, Image as ImageIcon,
  Send, ScanLine, X, ArrowRight, LayoutDashboard
} from 'lucide-react';
import DigitalInvite from '@/components/DigitalInvite';
import GlassCard from '@/components/ui/GlassCard';
import QRScanner from '@/components/QRScanner';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
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
      fetchEvents();
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
      fetchEvents();
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

  const getChartData = (rsvps: any[]) => {
    const groups = rsvps.reduce((acc: any, r: any) => {
      const date = new Date(r.created_at).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(groups).map(([date, count]) => ({ date, count }));
  };

  const sendWhatsAppBlast = (event: any) => {
    const message = `Hello! Just a reminder about ${event.event_name}. You can view the details and RSVP here: ${window.location.origin}/event/${event.slug}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f] text-white">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">Accessing Vault...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#D4AF37]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#e94560]/5 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto py-24 px-6 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-24">
          <div>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block"
            >
              The Host's Atelier
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-serif italic text-white leading-tight"
            >
              Your <span className="text-[#D4AF37]">Celebrations</span>
            </motion.h1>
          </div>
          <div className="flex gap-6">
            <Link to="/profile">
              <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-none px-8 py-6 text-[10px] font-bold tracking-[0.2em] uppercase">
                <User className="w-4 h-4 mr-2" /> Profile
              </Button>
            </Link>
            <Link to="/create-event">
              <Button className="bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-none px-10 py-6 text-[10px] font-bold tracking-[0.2em] uppercase shadow-xl shadow-[#D4AF37]/10">
                + New Event
              </Button>
            </Link>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-40 border border-dashed border-white/10 rounded-none bg-white/5">
            <Sparkles className="w-12 h-12 text-[#D4AF37] mx-auto mb-8 opacity-20" />
            <h3 className="text-2xl font-serif italic mb-4">The stage is set...</h3>
            <p className="text-gray-500 mb-12 max-w-md mx-auto font-light tracking-wide">You haven't curated any events yet. Begin your legacy by creating your first masterpiece.</p>
            <Link to="/create-event">
              <Button className="bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-none px-12 py-8 text-[10px] font-bold tracking-[0.3em] uppercase">
                Create Your First Event
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-24">
            {events.map((event, index) => {
              const filteredRSVPs = event.rsvps.filter((r: any) => 
                r.guest_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.guest_phone.includes(searchQuery)
              );
              const checkedInCount = event.rsvps.filter((r: any) => r.checked_in).length;

              return (
                <motion.div 
                  key={event.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="grid lg:grid-cols-12 gap-12">
                    {/* Event Visual Card */}
                    <div className="lg:col-span-4">
                      <div className="relative aspect-[4/5] overflow-hidden border border-white/10 group">
                        <img 
                          src={event.photo_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80'} 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                          alt={event.event_name}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                        
                        <div className="absolute top-6 right-6 flex flex-col gap-2 items-end">
                          {event.is_paid ? (
                            <span className="bg-green-500 text-black text-[8px] font-black px-3 py-1 uppercase tracking-widest">Live</span>
                          ) : (
                            <Link to={`/payment/${event.id}`}>
                              <Button size="sm" className="bg-[#e94560] hover:bg-[#d43d56] text-white text-[8px] font-black px-3 py-1 rounded-none uppercase tracking-widest">
                                Activate Page
                              </Button>
                            </Link>
                          )}
                          <span className="bg-white/10 backdrop-blur-md text-white text-[8px] font-black px-3 py-1 uppercase tracking-widest border border-white/10">
                            {event.plan} Plan
                          </span>
                        </div>

                        <div className="absolute bottom-8 left-8 right-8">
                          <h2 className="text-3xl font-serif italic text-white mb-4">{event.event_name}</h2>
                          <div className="flex flex-col gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                            <div className="flex items-center gap-2"><Calendar className="w-3 h-3 text-[#D4AF37]" /> {new Date(event.event_date).toLocaleDateString()}</div>
                            <div className="flex items-center gap-2"><MapPin className="w-3 h-3 text-[#D4AF37]" /> {event.venue}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <Button variant="outline" onClick={() => copyLink(event.slug)} className="rounded-none border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-[0.2em] py-6">
                          <Copy className="w-3 h-3 mr-2" /> Copy Link
                        </Button>
                        <Button variant="outline" onClick={() => navigate(`/edit-event/${event.id}`)} className="rounded-none border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-[0.2em] py-6">
                          <Edit className="w-3 h-3 mr-2" /> Edit Details
                        </Button>
                      </div>
                    </div>

                    {/* Management Suite */}
                    <div className="lg:col-span-8">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                        {[
                          { icon: Users, label: 'Total RSVPs', value: event.rsvps.length },
                          { icon: CheckCircle2, label: 'Checked In', value: `${checkedInCount}/${event.rsvps.length}` },
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
                          <TabsTrigger value="guests" className="bg-transparent border-none p-0 pb-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 data-[state=active]:text-white">
                            Guest List
                          </TabsTrigger>
                          <TabsTrigger value="analytics" className="bg-transparent border-none p-0 pb-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 data-[state=active]:text-white">
                            Analytics
                          </TabsTrigger>
                          <TabsTrigger value="tools" className="bg-transparent border-none p-0 pb-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 data-[state=active]:text-white">
                            Concierge Tools
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="guests" className="mt-0">
                          <div className="space-y-8">
                            <div className="flex flex-col md:flex-row gap-6">
                              <div className="relative flex-1">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4AF37] w-4 h-4" />
                                <Input 
                                  placeholder="Search the guest list..." 
                                  className="pl-16 bg-white/5 border-white/10 h-16 rounded-none text-[10px] font-bold uppercase tracking-[0.2em]"
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                />
                              </div>
                              <div className="flex gap-4">
                                <Button 
                                  variant="outline" 
                                  onClick={() => {
                                    setActiveEventId(event.id);
                                    setIsScannerOpen(true);
                                  }}
                                  className="h-16 rounded-none border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em] px-8"
                                >
                                  <ScanLine className="w-4 h-4 mr-2" /> Scan QR
                                </Button>
                                <Button 
                                  variant="outline" 
                                  onClick={() => downloadGuestList(event)}
                                  className="h-16 rounded-none border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-[0.2em] px-8"
                                >
                                  <FileDown className="w-4 h-4 mr-2" /> Export CSV
                                </Button>
                              </div>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto space-y-4 pr-4 custom-scrollbar">
                              {filteredRSVPs.length === 0 ? (
                                <div className="text-center py-20 border border-dashed border-white/5">
                                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">No guests found in the registry.</p>
                                </div>
                              ) : (
                                filteredRSVPs.map((rsvp: any) => (
                                  <div key={rsvp.id} className="flex justify-between items-center p-8 bg-white/5 border border-white/5 group hover:border-[#D4AF37]/30 transition-all">
                                    <div>
                                      <p className="text-lg font-serif italic text-white mb-1">{rsvp.guest_name}</p>
                                      <p className="text-[8px] text-gray-500 font-bold uppercase tracking-[0.2em]">{rsvp.guest_phone}</p>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => toggleCheckIn(rsvp.id, rsvp.checked_in)}
                                      className={`rounded-none transition-all ${rsvp.checked_in ? 'text-green-500 bg-green-500/5' : 'text-gray-500 hover:text-white'}`}
                                    >
                                      {rsvp.checked_in ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                      <span className="ml-3 text-[8px] font-black uppercase tracking-[0.3em]">
                                        {rsvp.checked_in ? 'Checked In' : 'Check In'}
                                      </span>
                                    </Button>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="analytics" className="mt-0">
                          <div className="h-[400px] w-full bg-white/5 p-10 border border-white/5">
                            <div className="flex justify-between items-center mb-10">
                              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">RSVP Velocity</span>
                              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">Real-time Data</span>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={getChartData(event.rsvps)}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis 
                                  dataKey="date" 
                                  stroke="#333" 
                                  fontSize={8} 
                                  tickLine={false} 
                                  axisLine={false}
                                  tick={{ fill: '#666', fontWeight: 'bold' }}
                                />
                                <YAxis 
                                  stroke="#333" 
                                  fontSize={8} 
                                  tickLine={false} 
                                  axisLine={false}
                                  tick={{ fill: '#666', fontWeight: 'bold' }}
                                />
                                <Tooltip 
                                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '0px' }}
                                  itemStyle={{ color: '#D4AF37', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="count" 
                                  stroke="#D4AF37" 
                                  strokeWidth={2} 
                                  dot={{ fill: '#D4AF37', r: 4 }} 
                                  activeDot={{ r: 6, stroke: '#000', strokeWidth: 2 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </TabsContent>

                        <TabsContent value="tools" className="mt-0">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Dialog>
                              <DialogTrigger asChild>
                                <button className="bg-white/5 border border-white/5 p-10 flex flex-col items-center justify-center gap-6 hover:bg-white/10 transition-all group">
                                  <ImageIcon className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Digital Invite</span>
                                </button>
                              </DialogTrigger>
                              <DialogContent className="bg-[#0f0f0f] border-white/10 text-white max-w-md rounded-none">
                                <DialogHeader>
                                  <DialogTitle className="text-2xl font-serif italic text-center mb-8">The Digital Invitation</DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                  <DigitalInvite event={event} />
                                </div>
                              </DialogContent>
                            </Dialog>

                            <button 
                              onClick={() => navigate(`/budget/${event.id}`)} 
                              className="bg-white/5 border border-white/5 p-10 flex flex-col items-center justify-center gap-6 hover:bg-white/10 transition-all group"
                            >
                              <Wallet className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Financial Suite</span>
                            </button>

                            {event.plan === 'Pro' ? (
                              <button 
                                onClick={() => sendWhatsAppBlast(event)} 
                                className="bg-[#25D366]/10 border border-[#25D366]/20 p-10 flex flex-col items-center justify-center gap-6 hover:bg-[#25D366]/20 transition-all group"
                              >
                                <Send className="w-8 h-8 text-[#25D366] group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#25D366]">WhatsApp Blast</span>
                              </button>
                            ) : (
                              <button 
                                onClick={() => navigate(`/payment/${event.id}`)} 
                                className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 p-10 flex flex-col items-center justify-center gap-6 hover:bg-[#D4AF37]/20 transition-all group"
                              >
                                <Sparkles className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">Upgrade to Pro</span>
                              </button>
                            )}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* QR Scanner Overlay */}
      <AnimatePresence>
        {isScannerOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <div className="max-w-md w-full">
              <div className="flex justify-between items-center mb-12">
                <h3 className="text-2xl font-serif italic text-white">Guest Check-in</h3>
                <button 
                  onClick={() => setIsScannerOpen(false)}
                  className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              
              <QRScanner 
                onScanSuccess={(id) => {
                  handleQRScan(id);
                  setIsScannerOpen(false);
                }} 
              />
              
              <div className="mt-12 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-4">Manual Entry</p>
                <div className="flex gap-4">
                  <Input 
                    placeholder="Enter RSVP ID" 
                    className="bg-white/5 border-white/10 rounded-none h-14 text-[10px] font-bold uppercase tracking-[0.2em]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleQRScan(e.currentTarget.value);
                        setIsScannerOpen(false);
                      }
                    }}
                  />
                  <Button className="bg-[#D4AF37] text-black rounded-none h-14 px-8 text-[10px] font-bold uppercase tracking-[0.2em]">
                    Verify
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;