"use client";

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { showSuccess, showError } from '@/utils/toast';
import { Copy, MessageCircle, Eye, Users, ExternalLink, Edit, Download, User, Wallet, Store, CreditCard, Sparkles } from 'lucide-react';
import DigitalInvite from '@/components/DigitalInvite';
import GlassCard from '@/components/ui/GlassCard';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/event/${slug}`;
    navigator.clipboard.writeText(url);
    showSuccess('Link copied to clipboard!');
  };

  const exportToCSV = (event: any) => {
    if (event.rsvps.length === 0) {
      showError('No RSVPs to export');
      return;
    }
    const headers = ['Guest Name', 'Phone Number', 'Date'];
    const rows = event.rsvps.map((r: any) => [
      r.guest_name,
      r.guest_phone,
      new Date(r.created_at).toLocaleDateString()
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${event.event_name}_guests.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sendWhatsAppBlast = (event: any) => {
    const guestList = event.rsvps.map((r: any) => r.guest_name).join(', ');
    const message = `Hello everyone! Here is the guest list for ${event.event_name}: ${guestList}. See you all soon!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#0a0a1a] text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      <Navbar />
      
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#e94560]/10 blur-[120px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#4ecca3]/10 blur-[120px] animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto py-12 px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-black tracking-tighter mb-2"
            >
              HOST <span className="text-[#e94560]">DASHBOARD</span>
            </motion.h1>
            <p className="text-gray-400 text-lg">Welcome back! Your events are looking great.</p>
          </div>
          <div className="flex gap-4">
            <Link to="/profile">
              <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white h-14 px-6">
                <User className="w-5 h-5 mr-2" /> Profile
              </Button>
            </Link>
            <Link to="/create-event">
              <Button className="bg-[#e94560] hover:bg-[#d43d56] text-white rounded-2xl h-14 px-8 font-black shadow-lg shadow-[#e94560]/20">
                + NEW EVENT
              </Button>
            </Link>
          </div>
        </div>

        {events.length === 0 ? (
          <GlassCard className="p-20 text-center border-dashed border-white/10">
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-[#e94560] opacity-50" />
            <p className="text-2xl text-gray-400 mb-8">You haven't created any events yet.</p>
            <Link to="/create-event">
              <Button size="lg" className="bg-[#e94560] rounded-2xl px-12 py-8 text-xl font-black">Create Your First Event</Button>
            </Link>
          </GlassCard>
        ) : (
          <div className="grid gap-12">
            {events.map((event, index) => (
              <GlassCard key={event.id} delay={index * 0.1} className="border-white/5">
                <div className="md:flex">
                  <div className="md:w-1/3 h-64 md:h-auto relative group overflow-hidden">
                    <img 
                      src={event.photo_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80'} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={event.event_name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    {!event.is_paid && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 text-center">
                        <div>
                          <p className="text-white font-bold mb-4">Payment Required to Activate</p>
                          <Button onClick={() => navigate(`/payment/${event.id}`)} className="bg-[#e94560] rounded-xl">Activate Now</Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="md:w-2/3 p-8 md:p-12">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-3xl md:text-4xl font-black tracking-tight">{event.event_name}</h2>
                          <span className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-black ${event.is_paid ? 'bg-[#4ecca3]/20 text-[#4ecca3]' : 'bg-yellow-500/20 text-yellow-500'}`}>
                            {event.is_paid ? 'Active' : 'Pending'}
                          </span>
                        </div>
                        <p className="text-gray-400 text-lg flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-[#e94560]" />
                          {new Date(event.event_date).toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button variant="outline" size="sm" onClick={() => copyLink(event.slug)} className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10">
                          <Copy className="w-4 h-4 mr-2" /> Link
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/edit-event/${event.id}`)} className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10">
                          <Edit className="w-4 h-4 mr-2" /> Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => window.open(`/event/${event.slug}`, '_blank')} className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10">
                          <ExternalLink className="w-4 h-4 mr-2" /> View
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 mb-10">
                      {[
                        { icon: Eye, label: 'Views', value: event.view_count },
                        { icon: Users, label: 'RSVPs', value: event.rsvps.length },
                        { icon: Sparkles, label: 'Plan', value: event.plan }
                      ].map((stat, i) => (
                        <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center group hover:bg-white/10 transition-colors">
                          <stat.icon className="w-6 h-6 mx-auto mb-2 text-[#e94560] group-hover:scale-110 transition-transform" />
                          <div className="text-2xl font-black">{stat.value}</div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    <Tabs defaultValue="rsvps" className="w-full">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                        <TabsList className="bg-white/5 p-1 rounded-2xl border border-white/10">
                          <TabsTrigger value="rsvps" className="rounded-xl data-[state=active]:bg-[#e94560] data-[state=active]:text-white">Guest List</TabsTrigger>
                          <TabsTrigger value="tools" className="rounded-xl data-[state=active]:bg-[#e94560] data-[state=active]:text-white">Tools</TabsTrigger>
                          <TabsTrigger value="invite" className="rounded-xl data-[state=active]:bg-[#e94560] data-[state=active]:text-white">Invite Card</TabsTrigger>
                        </TabsList>
                        <Button variant="ghost" size="sm" onClick={() => exportToCSV(event)} className="text-gray-400 hover:text-white">
                          <Download className="w-4 h-4 mr-2" /> Export CSV
                        </Button>
                      </div>
                      
                      <TabsContent value="rsvps" className="mt-0">
                        <div className="max-h-64 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                          {event.rsvps.length > 0 ? (
                            event.rsvps.map((rsvp: any) => (
                              <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={rsvp.id} 
                                className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
                              >
                                <span className="font-bold text-lg">{rsvp.guest_name}</span>
                                <span className="text-gray-400 font-medium">{rsvp.guest_phone}</span>
                              </motion.div>
                            ))
                          ) : (
                            <div className="text-center py-12 text-gray-500 italic bg-white/5 rounded-3xl border border-dashed border-white/10">
                              No RSVPs yet. Share your link to get started!
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="tools" className="mt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Button 
                            onClick={() => sendWhatsAppBlast(event)}
                            className="bg-[#25D366] hover:bg-[#128C7E] text-white py-12 rounded-3xl flex flex-col items-center gap-2 shadow-lg shadow-[#25D366]/10 group"
                          >
                            <MessageCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                            <span className="font-black text-lg">WhatsApp Blast</span>
                          </Button>
                          
                          {(event.plan === 'Pro') && (
                            <>
                              <Button 
                                onClick={() => navigate(`/budget/${event.id}`)}
                                className="bg-white/10 hover:bg-white/20 text-white py-12 rounded-3xl flex flex-col items-center gap-2 border border-white/10 group"
                              >
                                <Wallet className="w-8 h-8 group-hover:scale-110 transition-transform text-[#e94560]" />
                                <span className="font-black text-lg">Budget Tracker</span>
                              </Button>
                              <Button 
                                onClick={() => navigate('/vendors')}
                                className="bg-white/10 hover:bg-white/20 text-white py-12 rounded-3xl flex flex-col items-center gap-2 border border-white/10 group"
                              >
                                <Store className="w-8 h-8 group-hover:scale-110 transition-transform text-[#4ecca3]" />
                                <span className="font-black text-lg">Vendor Directory</span>
                              </Button>
                            </>
                          )}

                          {(event.plan === 'Standard') && (
                            <Button 
                              onClick={() => navigate(`/budget/${event.id}`)}
                              disabled
                              className="bg-white/5 text-gray-500 py-12 rounded-3xl flex flex-col items-center gap-2 border border-white/5 cursor-not-allowed opacity-50"
                            >
                              <Wallet className="w-8 h-8" />
                              <span className="font-black text-lg">Budget (Pro Only)</span>
                            </Button>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="invite" className="mt-0">
                        {(event.plan === 'Standard' || event.plan === 'Pro') ? (
                          <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                            <DigitalInvite event={event} />
                          </div>
                        ) : (
                          <div className="text-center py-16 bg-white/5 rounded-3xl border border-dashed border-white/10">
                            <CreditCard className="w-16 h-16 mx-auto mb-6 text-gray-600" />
                            <h3 className="text-2xl font-black mb-2">Upgrade Required</h3>
                            <p className="text-gray-400 mb-8 max-w-xs mx-auto">Digital Invite Cards are available on Standard and Pro plans.</p>
                            <Button onClick={() => navigate(`/payment/${event.id}`)} className="bg-[#e94560] rounded-xl px-8 py-6 font-black">Upgrade Plan</Button>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;