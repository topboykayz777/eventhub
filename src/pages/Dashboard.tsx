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
  Calendar, TrendingUp, Search, CheckCircle2, Circle 
} from 'lucide-react';
import DigitalInvite from '@/components/DigitalInvite';
import GlassCard from '@/components/ui/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  const promoteEvent = async (eventId: string) => {
    const { error } = await supabase
      .from('events')
      .update({ is_featured: true })
      .eq('id', eventId);
    
    if (error) showError("Promotion failed");
    else {
      showSuccess("Event promoted to spotlight!");
      fetchEvents();
    }
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

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#0a0a1a] text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      <Navbar />
      
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
            <p className="text-gray-400 text-lg">Manage your celebrations with precision.</p>
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

        {events.map((event, index) => {
          const filteredRSVPs = event.rsvps.filter((r: any) => 
            r.guest_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.guest_phone.includes(searchQuery)
          );
          const checkedInCount = event.rsvps.filter((r: any) => r.checked_in).length;

          return (
            <GlassCard key={event.id} delay={index * 0.1} className="border-white/5 mb-12">
              <div className="md:flex">
                <div className="md:w-1/3 h-64 md:h-auto relative group overflow-hidden">
                  <img 
                    src={event.photo_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80'} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={event.event_name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                
                <div className="md:w-2/3 p-8 md:p-12">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">{event.event_name}</h2>
                      <p className="text-gray-400 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#e94560]" />
                        {new Date(event.event_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => copyLink(event.slug)} className="rounded-xl border-white/10 bg-white/5">
                        <Copy className="w-4 h-4 mr-2" /> Link
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/edit-event/${event.id}`)} className="rounded-xl border-white/10 bg-white/5">
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                      { icon: Users, label: 'Total RSVPs', value: event.rsvps.length },
                      { icon: CheckCircle2, label: 'Checked In', value: `${checkedInCount}/${event.rsvps.length}` },
                      { icon: Eye, label: 'Page Views', value: event.view_count },
                      { icon: TrendingUp, label: 'Growth', value: 'Active' }
                    ].map((stat, i) => (
                      <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                        <stat.icon className="w-5 h-5 mx-auto mb-2 text-[#e94560]" />
                        <div className="text-xl font-black">{stat.value}</div>
                        <div className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <Tabs defaultValue="analytics" className="w-full">
                    <TabsList className="bg-white/5 p-1 rounded-2xl border border-white/10 mb-8">
                      <TabsTrigger value="analytics" className="rounded-xl data-[state=active]:bg-[#e94560]">Analytics</TabsTrigger>
                      <TabsTrigger value="guests" className="rounded-xl data-[state=active]:bg-[#e94560]">Guest List</TabsTrigger>
                      <TabsTrigger value="tools" className="rounded-xl data-[state=active]:bg-[#e94560]">Tools</TabsTrigger>
                    </TabsList>

                    <TabsContent value="analytics">
                      <div className="h-64 w-full bg-white/5 rounded-3xl p-6 border border-white/5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">RSVP Velocity</p>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={getChartData(event.rsvps)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="date" stroke="#666" fontSize={10} />
                            <YAxis stroke="#666" fontSize={10} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#1a1a2e', border: 'none', borderRadius: '12px' }}
                              itemStyle={{ color: '#e94560' }}
                            />
                            <Line type="monotone" dataKey="count" stroke="#e94560" strokeWidth={3} dot={{ fill: '#e94560' }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </TabsContent>

                    <TabsContent value="guests">
                      <div className="space-y-4">
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                          <Input 
                            placeholder="Search guests by name or phone..." 
                            className="pl-12 bg-white/5 border-white/10 h-12 rounded-xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <div className="max-h-80 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                          {filteredRSVPs.map((rsvp: any) => (
                            <div key={rsvp.id} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 group">
                              <div>
                                <p className="font-bold">{rsvp.guest_name}</p>
                                <p className="text-xs text-gray-500">{rsvp.guest_phone}</p>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => toggleCheckIn(rsvp.id, rsvp.checked_in)}
                                className={`rounded-xl transition-all ${rsvp.checked_in ? 'text-[#4ecca3] bg-[#4ecca3]/10' : 'text-gray-500 hover:text-white'}`}
                              >
                                {rsvp.checked_in ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                <span className="ml-2 text-[10px] font-bold uppercase tracking-widest">
                                  {rsvp.checked_in ? 'Checked In' : 'Check In'}
                                </span>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="tools">
                      <div className="grid grid-cols-2 gap-4">
                        <Button onClick={() => promoteEvent(event.id)} className="bg-[#D4AF37] text-black h-24 rounded-3xl flex flex-col gap-1">
                          <TrendingUp className="w-6 h-6" />
                          <span className="font-black">Promote Event</span>
                        </Button>
                        <Button onClick={() => navigate(`/budget/${event.id}`)} className="bg-white/5 border border-white/10 h-24 rounded-3xl flex flex-col gap-1">
                          <Wallet className="w-6 h-6 text-[#e94560]" />
                          <span className="font-black">Budget Suite</span>
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;