"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { showSuccess, showError } from '@/utils/toast';
import { RefreshCw, Loader2 } from 'lucide-react';
import PasscodeLock from '@/components/admin/PasscodeLock';
import MetricsCard from '@/components/admin/MetricsCard';
import CurrentlyOnline from '@/components/admin/CurrentlyOnline';
import PlatformCharts from '@/components/admin/PlatformCharts';
import MasterDirectoryTable from '@/components/admin/MasterDirectoryTable';
import RecentActivity from '@/components/admin/RecentActivity';
import { Calendar, Users, Coins, Building2 } from 'lucide-react';

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

  const handleLogin = () => {
    if (passcode.trim() === "2003" || passcode.trim() === `eventhub2003`) {
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-500 flex flex-col justify-between">
        <Navbar />
        <PasscodeLock onAuthenticate={() => setIsAuthenticated(true)} />
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
              <span className="text-[#D4AF37] text-[8px] font-bold uppercase tracking-[0.3em]">Master Intelligence</span>
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
          <MetricsCard 
            title="Total Events" 
            value={metrics.totalEvents} 
            icon={Calendar} 
            subtext={`${metrics.activeEvents} Active • ${metrics.paidEvents} Activated`}
            color="text-green-500"
          />
          <MetricsCard 
            title="Confirmed RSVPs" 
            value={metrics.totalRSVPs} 
            icon={Users} 
            subtext="Across all celebrations"
          />
          <MetricsCard 
            title="Total Digital Sprayed" 
            value={`₦${metrics.totalSprayed.toLocaleString()}`} 
            icon={Coins} 
            subtext="Verified P2P transfers"
            color="text-[#D4AF37]"
          />
          <MetricsCard 
            title="Registered Hosts" 
            value={metrics.totalHosts} 
            icon={Building2} 
            subtext={`${metrics.totalVendors} Vendor Partners`}
          />
        </div>

        {/* Currently Online Tracker */}
        <CurrentlyOnline count={onlineCount} users={onlineUsers} />

        {/* 2. Platform Charts Section */}
        {chartData.length > 0 && <PlatformCharts chartData={chartData} />}

        {/* 3. Master Directory Table */}
        <MasterDirectoryTable 
          events={eventsList} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />

        {/* 4. Live Stream Feeds (Recent Activity) */}
        <RecentActivity 
          recentSprays={recentSprays} 
          recentRSVPs={recentRSVPs} 
        />
      </div>
    </div>
  );
};

export default AdminDashboard;