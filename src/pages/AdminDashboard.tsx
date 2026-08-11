"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showSuccess, showError } from '@/utils/toast';
import { 
  ShieldCheck, Lock, Users, Calendar, Coins, TrendingUp, Sparkles, 
  Search, Eye, CheckCircle2, Clock, ArrowUpRight, Activity, FileText, 
  Building2, KeyRound, Loader2, LogOut, RefreshCw, BarChart3, AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts';

const DEFAULT_PASSCODE = "2003";

const AdminDashboard = () => {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Platform metrics
  const [metrics, setMetrics] = useState({
    totalEvents: 0,
    activeEvents: 0,
    paidEvents: 0,
    totalHosts: 0,
    totalRSVPs: 0,
    totalSprayed: 0,
    totalVendors: 0,
  });

  const [eventsList, setEventsData] = useState<any[]>([]);
  const [recentSprays, setRecentSprays] = useState<any[]>([]);
  const [recentRSVPs, setRecentRSVPs] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

  useEffect(() => {
    // Check local storage session for existing admin session
    const savedAuth = sessionStorage.getItem('eventhub_admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      fetchPlatformData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === DEFAULT_PASSCODE || passcode.trim() === `eventhub${DEFAULT_PASSCODE}`) {
      setIsAuthenticated(true);
      sessionStorage.setItem('eventhub_admin_auth', 'true');
      showSuccess("Welcome to the Command Center.");
      fetchPlatformData();
    } else {
      showError("Invalid Passcode.");
      setPasscode('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('eventhub_admin_auth');
    showSuccess("Admin session closed.");
  };

  const fetchPlatformData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Events
      const { data: events, error: eventsErr } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (eventsErr) throw eventsErr;

      // 2. Fetch Profiles / Hosts
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email, created_at');

      // 3. Fetch RSVPs
      const { data: rsvps } = await supabase
        .from('rsvps')
        .select('id, event_id, guest_name, guest_phone, checked_in, created_at')
        .order('created_at', { ascending: false });

      // 4. Fetch Budget / Spray Items
      const { data: budgetItems } = await supabase
        .from('budget_items')
        .select('id, event_id, description, amount, type, status, alert_name, created_at')
        .order('created_at', { ascending: false });

      // 5. Fetch Vendors
      const { data: vendors } = await supabase
        .from('vendors')
        .select('id, name, category, created_at');

      const allEvents = events || [];
      const allRsvps = rsvps || [];
      const allBudget = budgetItems || [];
      const allProfiles = profiles || [];
      const allVendors = vendors || [];

      // Calculate spray totals
      const approvedSprays = allBudget.filter(b => b.type === 'income' && b.status === 'approved');
      const spraySum = approvedSprays.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

      // Active vs Paid Events
      const activeCount = allEvents.filter(e => !e.is_finished).length;
      const paidCount = allEvents.filter(e => e.is_paid).length;

      setMetrics({
        totalEvents: allEvents.length,
        activeEvents: activeCount,
        paidEvents: paidCount,
        totalHosts: allProfiles.length,
        totalRSVPs: allRsvps.length,
        totalSprayed: spraySum,
        totalVendors: allVendors.length,
      });

      // Attach RSVP & Spray counts to events
      const enrichedEvents = allEvents.map(ev => {
        const evRsvps = allRsvps.filter(r => r.event_id === ev.id);
        const evSprays = approvedSprays.filter(s => s.event_id === ev.id);
        const evSprayTotal = evSprays.reduce((s, i) => s + (Number(i.amount) || 0), 0);
        const hostProfile = allProfiles.find(p => p.id === ev.host_id);

        return {
          ...ev,
          rsvpCount: evRsvps.length,
          sprayTotal: evSprayTotal,
          hostName: hostProfile?.full_name || 'Host',
          hostEmail: hostProfile?.email || 'N/A'
        };
      });

      setEventsData(enrichedEvents);
      setRecentSprays(allBudget.slice(0, 8));
      setRecentRSVPs(allRsvps.slice(0, 8));

      // Build Monthly Chart Data
      const monthlyDataMap: Record<string, { month: string, events: number, sprays: number }> = {};
      allEvents.forEach(ev => {
        const date = new Date(ev.created_at || Date.now());
        const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
        if (!monthlyDataMap[monthKey]) {
          monthlyDataMap[monthKey] = { month: monthKey, events: 0, sprays: 0 };
        }
        monthlyDataMap[monthKey].events += 1;
      });

      approvedSprays.forEach(sp => {
        const date = new Date(sp.created_at || Date.now());
        const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
        if (!monthlyDataMap[monthKey]) {
          monthlyDataMap[monthKey] = { month: monthKey, events: 0, sprays: 0 };
        }
        monthlyDataMap[monthKey].sprays += Number(sp.amount) || 0;
      });

      setChartData(Object.values(monthlyDataMap));

      // Fetch currently online users (active in last 5 minutes)
      const { data: onlineData, error: onlineErr } = await supabase
        .from('profiles')
        .select('id, full_name, email, last_seen_at')
        .gt('last_seen_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Last 5 minutes
        .order('last_seen_at', { ascending: false });

      if (onlineErr) throw onlineErr;
      setOnlineCount(onlineData.length);
      setOnlineUsers(onlineData);
      
    } catch (err: any) {
      showError(err.message || "Failed to load platform analytics");
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = eventsList.filter(e => 
    e.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // PASSCODE LOCK SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-500 flex flex-col justify-between">
        <Navbar />
        <div className="max-w-md mx-auto w-full px-6 py-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border p-10 md:p-12 rounded-[3rem] shadow-2xl text-center space-y-8"
          >
            <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto border border-[#D4AF37]/20">
              <KeyRound className="text-[#D4AF37] w-10 h-10" />
            </div>

            <div>
              <span className="text-[#D4AF37] text-[8px] font-black uppercase tracking-[0.4em] block mb-2">Restricted Access</span>
              <h1 className="text-3xl font-serif italic text-foreground">Admin Portal</h1>
              <p className="text-muted-foreground text-xs font-light mt-2">Enter master passcode to view live system analytics.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] w-4 h-4" />
                <Input 
                  type="password"
                  required
                  placeholder="Enter Passcode..."
                  className="h-16 pl-12 bg-secondary border-border text-center text-xl tracking-[0.5em] font-mono rounded-2xl focus:border-[#D4AF37]"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black h-16 rounded-2xl text-[10px] font-black tracking-[0.3em] uppercase transition-all shadow-lg"
              >
                Authenticate
              </Button>
            </form>

            <p className="text-[8px] text-muted-foreground font-mono uppercase tracking-widest">
              Default passcode: <span className="text-[#D4AF37]">{DEFAULT_PASSCODE}</span>
            </p>
          </motion.div>
        </div>
        <div className="py-6 text-center text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
          EventHub Platform Intelligence • Confidential
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 pb-32">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-24 md:py-32 px-6 space-y-16">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 border-b border-border pb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full mb-3">
              <ShieldCheck className="text-[#D4AF37] w-3.5 h-3.5" />
              <span className="text-[#D4AF37] text-[8px] font-black uppercase tracking-[0.3em]">Master Intelligence</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif italic text-foreground">Platform <span className="text-[#D4AF37]">Analytics</span></h1>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              onClick={fetchPlatformData} 
              disabled={loading}
              variant="outline" 
              className="border-border bg-card h-12 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-muted"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
            <Button 
              onClick={handleLogout} 
              variant="ghost" 
              className="text-red-500 hover:bg-red-500/10 h-12 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest"
            >
              <LogOut className="w-4 h-4 mr-2" /> Exit Session
            </Button>
          </div>
        </div>

        {/* 1. Global Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-8 bg-card border border-border rounded-[2.5rem] shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center mb-4">
              <Calendar className="text-[#D4AF37] w-5 h-5" />
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Total Events</p>
            <p className="text-3xl md:text-4xl font-serif italic text-foreground">{metrics.totalEvents}</p>
            <span className="text-[8px] font-bold uppercase text-green-500 tracking-wider">{metrics.activeEvents} Active • {metrics.paidEvents} Activated</span>
          </div>

          <div className="p-8 bg-card border border-border rounded-[2.5rem] shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center mb-4">
              <Users className="text-[#D4AF37] w-5 h-5" />
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Confirmed RSVPs</p>
            <p className="text-3xl md:text-4xl font-serif italic text-foreground">{metrics.totalRSVPs}</p>
            <span className="text-[8px] font-bold uppercase text-muted-foreground tracking-wider">Across all celebrations</span>
          </div>

          <div className="p-8 bg-card border border-border rounded-[2.5rem] shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center mb-4">
              <Coins className="text-[#D4AF37] w-5 h-5" />
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Total Digital Sprayed</p>
            <p className="text-2xl md:text-3xl font-serif italic text-[#D4AF37]">₦{metrics.totalSprayed.toLocaleString()}</p>
            <span className="text-[8px] font-bold uppercase text-muted-foreground tracking-wider">Verified P2P transfers</span>
          </div>

          <div className="p-8 bg-card border border-border rounded-[2.5rem] shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center mb-4">
              <Building2 className="text-[#D4AF37] w-5 h-5" />
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Registered Hosts</p>
            <p className="text-3xl md:text-4xl font-serif italic text-foreground">{metrics.totalHosts}</p>
            <span className="text-[8px] font-bold uppercase text-muted-foreground tracking-wider">{metrics.totalVendors} Vendor Partners</span>
          </div>
        </div>

        {/* Currently Online Tracker */}
        <div className="p-8 bg-card border border-border rounded-[2.5rem] shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Currently Online</span>
            <Users className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
            Guests active in last 5 minutes
          </p>
          <p className="text-3xl md:text-4xl font-serif italic text-foreground">
            {onlineCount}
          </p>
          {onlineUsers.length > 0 && (
            <div className="mt-2 space-y-1 text-sm">
              {onlineUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-2">
                  <User className="w-3 h-3 text-[#D4AF37]/50" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground truncate max-w-[100px]">
                    {user.full_name || user.email?.split('@')[0] || 'Guest'}
                  </span>
                  <span className="text-[7px] text-muted-foreground">
                    {(Date.now() - new Date(user.last_seen_at).getTime()) / 60000 < 1 
                      ? 'just now' 
                      : `${Math.floor((Date.now() - new Date(user.last_seen_at).getTime()) / 60000)}m ago`
                    }
                  </span>
                }
              ))}
            </div>
          )}
        </div>

        {/* 2. Platform Charts Section */}
        {chartData.length > 0 && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card border border-border p-8 rounded-[3rem] shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Event Creation Pace</span>
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                    <XAxis dataKey="month" stroke="#888888" fontSize={10} tickLine={false} />
                    <YAxis stroke="#888888" fontSize={10} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                      itemStyle={{ color: '#D4AF37', fontSize: '12px' }}
                    />
                    <Bar dataKey="events" fill="#D4AF37" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-card border border-border p-8 rounded-[3rem] shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Digital Spraying Volume</span>
                <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                    <XAxis dataKey="month" stroke="#888888" fontSize={10} tickLine={false} />
                    <YAxis stroke="#888888" fontSize={10} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                      itemStyle={{ color: '#D4AF37', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="sprays" stroke="#D4AF37" fill="#D4AF3720" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* 3. Master Directory Table */}
        <div className="bg-card border border-border rounded-[3rem] overflow-hidden shadow-sm p-8 md:p-12 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-2xl font-serif italic">Master Event Directory</h2>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Live monitoring of all user orchestrations</p>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search events, hosts or venues..." 
                className="pl-12 bg-secondary border-border h-12 rounded-xl text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                  <th className="pb-4">Event & Slug</th>
                  <th className="pb-4">Host</th>
                  <th className="pb-4">Date & Venue</th>
                  <th className="pb-4">Plan & Status</th>
                  <th className="pb-4">RSVPs</th>
                  <th className="pb-4">Sprayed</th>
                  <th className="pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-light">
                {filteredEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-5 pr-4">
                      <p className="font-serif italic text-base text-foreground font-medium">{ev.event_name}</p>
                      <p className="text-[10px] text-[#D4AF37] font-mono">/event/{ev.slug}</p>
                    </td>
                    <td className="py-5 pr-4">
                      <p className="text-xs font-medium text-foreground">{ev.hostName}</p>
                      <p className="text-[9px] text-muted-foreground">{ev.hostEmail}</p>
                    </td>
                    <td className="py-5 pr-4">
                      <p className="text-xs">{new Date(ev.event_date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[150px]">{ev.venue}</p>
                    </td>
                    <td className="py-5 pr-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] font-black uppercase px-2.5 py-1 rounded-full ${
                          ev.is_paid ? 'bg-green-500/10 text-green-500' : 'bg-[#D4AF37]/10 text-[#D4AF37]'
                        }`}>
                          {ev.plan || 'beta'}
                        </span>
                        {ev.is_finished && (
                          <span className="text-[8px] font-bold text-muted-foreground uppercase">Concluded</span>
                        )}
                      </div>
                    </td>
                    <td className="py-5 pr-4 font-serif italic text-base">{ev.rsvpCount}</td>
                    <td className="py-5 pr-4 font-serif italic text-base text-[#D4AF37]">₦{ev.sprayTotal.toLocaleString()}</td>
                    <td className="py-5 text-right">
                      <Button 
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(`/event/${ev.slug}`, '_blank')}
                        className="text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-xl text-[9px] font-black uppercase tracking-wider"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> View
                      </Button>
                    </td>
                  </tr>
                ))}

                {filteredEvents.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-muted-foreground italic font-light">
                      No matching events found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Live Stream Feeds (Recent Activity) */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Digital Sprays */}
          <div className="bg-card border border-border rounded-[3rem] p-8 space-y-6">
            <div className="flex items-center gap-3">
              <Coins className="text-[#D4AF37] w-5 h-5" />
              <h3 className="text-xl font-serif italic">Recent Digital Sprays</h3>
            </div>

            <div className="space-y-3">
              {recentSprays.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-secondary/50 border border-border flex justify-between items-center text-xs">
                  <div>
                    <p className="font-serif italic text-sm text-foreground">{item.description}</p>
                    <p className="text-[9px] text-muted-foreground uppercase">{new Date(item.created_at).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif italic text-base text-[#D4AF37]">₦{item.amount?.toLocaleString()}</p>
                    <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full ${
                      item.status === 'approved' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}

              {recentSprays.length === 0 && (
                <p className="text-center text-xs text-muted-foreground italic py-8">No spray transfers recorded yet.</p>
              )}
            </div>
          </div>

          {/* Recent RSVPs */}
          <div className="bg-card border border-border rounded-[3rem] p-8 space-y-6">
            <div className="flex items-center gap-3">
              <Users className="text-[#D4AF37] w-5 h-5" />
              <h3 className="text-xl font-serif italic">Recent Guest RSVPs</h3>
            </div>

            <div className="space-y-3">
              {recentRSVPs.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-secondary/50 border border-border flex justify-between items-center text-xs">
                  <div>
                    <p className="font-serif italic text-sm text-foreground">{item.guest_name}</p>
                    <p className="text-[9px] text-muted-foreground">{item.guest_phone}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[7px] font-black uppercase px-2.5 py-1 rounded-full ${
                      item.checked_in ? 'bg-green-500/10 text-green-500' : 'bg-secondary text-muted-foreground'
                    }`}>
                      {item.checked_in ? 'Checked In' : 'RSVP Confirmed'}
                    </span>
                  </div>
                </div>
              ))}

              {recentRSVPs.length === 0 && (
                <p className="text-center text-xs text-muted-foreground italic py-8">No guest RSVPs registered yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;