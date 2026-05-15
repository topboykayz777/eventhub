"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Settings, 
  Layout, 
  Plus, 
  Search, 
  Filter,
  ArrowUpRight,
  DollarSign,
  Calendar,
  MapPin,
  Loader2,
  Share2,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GuestList from '@/components/dashboard/GuestList';
import BroadcastBox from '@/components/dashboard/BroadcastBox';
import { showSuccess, showError } from '@/utils/toast';

const Dashboard = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGuests: 0,
    checkedIn: 0,
    pendingSprays: 0
  });

  useEffect(() => {
    // Handle session manually to avoid dependency issues
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSessionLoading(false);
      if (!session) navigate('/login');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate('/login');
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (session && eventId) {
      fetchEventData();
    }
  }, [eventId, session]);

  const fetchEventData = async () => {
    try {
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (eventError) throw eventError;
      setEvent(eventData);

      // Fetch stats
      const { data: rsvps } = await supabase
        .from('rsvps')
        .select('checked_in')
        .eq('event_id', eventId);

      const { count: sprays } = await supabase
        .from('budget_items')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('status', 'pending');

      setStats({
        totalGuests: rsvps?.length || 0,
        checkedIn: rsvps?.filter(r => r.checked_in).length || 0,
        pendingSprays: sprays || 0
      });

    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading || sessionLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#D4AF37] selection:text-black">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-xl font-black tracking-tighter italic">
              VIBE<span className="text-[#D4AF37]">SYNC</span>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div>
              <h1 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-1">Event Dashboard</h1>
              <p className="text-xs font-bold uppercase tracking-[0.1em]">{event?.event_name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="border-white/10 bg-white/5 hover:bg-white/10 rounded-none text-[10px] font-bold uppercase tracking-[0.2em] h-10"
              onClick={() => window.open(`/vibe/${event?.slug}`, '_blank')}
            >
              <ExternalLink className="w-3 h-3 mr-2" /> Vibe Screen
            </Button>
            <Button 
              className="bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-none text-[10px] font-bold uppercase tracking-[0.2em] h-10 px-6"
            >
              <Share2 className="w-3 h-3 mr-2" /> Share Event
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Total Guests', value: stats.totalGuests, icon: Users, color: 'text-blue-400' },
            { label: 'Checked In', value: stats.checkedIn, icon: Layout, color: 'text-green-400' },
            { label: 'Pending Sprays', value: stats.pendingSprays, icon: DollarSign, color: 'text-[#D4AF37]' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-8 relative overflow-hidden group">
              <div className="relative z-10">
                <stat.icon className={`w-5 h-5 ${stat.color} mb-4`} />
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-2">{stat.label}</div>
                <div className="text-4xl font-black tracking-tighter">{stat.value}</div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                <stat.icon size={120} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Guest Management */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="text-[#D4AF37] w-5 h-5" />
                <h2 className="text-sm font-black uppercase tracking-[0.3em]">Guest Management</h2>
              </div>
              <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-white">
                View All <ArrowUpRight className="w-3 h-3 ml-1" />
              </Button>
            </div>

            <div className="bg-white/5 border border-white/10 overflow-hidden">
              {/* Integrated Broadcast Box */}
              <BroadcastBox eventId={event?.id} currentMessage={event?.message} />
              
              <div className="p-6 border-b border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between bg-white/[0.02]">
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input 
                    placeholder="Search guests..." 
                    className="pl-10 bg-black/40 border-white/10 h-12 rounded-none text-[10px] font-bold uppercase tracking-[0.2em]"
                  />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button variant="outline" className="flex-1 md:flex-none border-white/10 bg-white/5 rounded-none h-12 text-[10px] font-bold uppercase tracking-[0.2em]">
                    <Filter className="w-3 h-3 mr-2" /> Filter
                  </Button>
                  <Button className="flex-1 md:flex-none bg-white text-black hover:bg-gray-200 rounded-none h-12 px-6 text-[10px] font-bold uppercase tracking-[0.2em]">
                    <Plus className="w-3 h-3 mr-2" /> Add Guest
                  </Button>
                </div>
              </div>
              <GuestList eventId={event?.id} />
            </div>
          </div>

          {/* Right Column: Quick Actions & Info */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <Settings className="text-[#D4AF37] w-5 h-5" />
              <h2 className="text-sm font-black uppercase tracking-[0.3em]">Event Details</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Calendar className="w-4 h-4 text-[#D4AF37] mt-1" />
                    <div>
                      <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">Date & Time</div>
                      <div className="text-xs font-bold uppercase tracking-[0.1em]">
                        {event?.event_date ? new Date(event.event_date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) : 'Not set'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-4 h-4 text-[#D4AF37] mt-1" />
                    <div>
                      <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">Venue</div>
                      <div className="text-xs font-bold uppercase tracking-[0.1em]">{event?.venue || 'Not set'}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <Button 
                    variant="outline" 
                    className="w-full border-white/10 bg-white/5 hover:bg-white/10 rounded-none h-12 text-[10px] font-bold uppercase tracking-[0.2em]"
                    onClick={() => navigate(`/dashboard/events/${eventId}/settings`)}
                  >
                    Edit Event Settings
                  </Button>
                </div>
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-white/5 border border-white/10 p-6 text-left hover:bg-white/10 transition-colors group">
                  <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2 group-hover:text-[#D4AF37]">Budget</div>
                  <div className="text-xs font-bold uppercase tracking-[0.1em]">Manage Sprays</div>
                </button>
                <button className="bg-white/5 border border-white/10 p-6 text-left hover:bg-white/10 transition-colors group">
                  <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2 group-hover:text-[#D4AF37]">Gallery</div>
                  <div className="text-xs font-bold uppercase tracking-[0.1em]">Event Photos</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;