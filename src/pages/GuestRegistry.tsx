"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Music, FileDown, CheckCircle2, Circle, Users, CheckSquare, Square, UserPlus, ArrowLeft, Loader2 } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { motion, AnimatePresence } from 'framer-motion';

const GuestRegistry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<any>(null);
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [tableNumber, setTableNumber] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    const { data: eventData } = await supabase.from('events').select('*').eq('id', id).single();
    if (!eventData) { navigate('/dashboard'); return; }
    setEvent(eventData);

    const { data: rsvpData } = await supabase.from('rsvps').select('*').eq('event_id', id).order('created_at', { ascending: false });
    setRsvps(rsvpData || []);
    setLoading(false);
  };

  const filteredRSVPs = rsvps.filter((r: any) => 
    r.guest_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.guest_phone.includes(searchQuery)
  );

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (selectedIds.length === filteredRSVPs.length) setSelectedIds([]);
    else setSelectedIds(filteredRSVPs.map(r => r.id));
  };

  const handleBulkSeating = async () => {
    if (!tableNumber || selectedIds.length === 0) return;
    setIsAssigning(true);
    try {
      const { error } = await supabase.from('rsvps').update({ table_number: tableNumber }).in('id', selectedIds);
      if (error) throw error;
      showSuccess("Seating assigned.");
      setSelectedIds([]);
      setTableNumber('');
      fetchData();
    } catch (err: any) { showError(err.message); } finally { setIsAssigning(false); }
  };

  const exportGuestList = () => {
    if (rsvps.length === 0) { showError("Guest list is empty."); return; }
    const rows = rsvps.map(r => [r.guest_name, r.guest_phone, r.table_number || "N/A"]);
    const csvContent = ["Guest Name,Phone,Table", ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${event.event_name.replace(/\s+/g, '_')}_GuestList.csv`);
    link.click();
    showSuccess("Guest List Exported.");
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-background"><Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" /></div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="max-w-7xl mx-auto py-24 px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div className="space-y-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-[#D4AF37] p-0 flex items-center gap-2 group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </Button>
            <div>
              <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.5em] block mb-2">Guest Archive</span>
              <h1 className="text-4xl md:text-6xl font-serif italic leading-tight">The <span className="text-[#D4AF37]">Registry</span></h1>
            </div>
          </div>
          <Button onClick={exportGuestList} className="h-16 bg-[#D4AF37] text-black rounded-2xl px-8 text-[11px] font-black uppercase tracking-widest hover:bg-[#B8860B] transition-all shadow-lg">
            <FileDown className="w-4 h-4 mr-3" /> Download Manifest
          </Button>
        </div>

        <div className="bg-card border border-border rounded-[3rem] overflow-hidden shadow-xl">
          <div className="p-8 border-b border-border bg-muted/30">
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
              <div className="relative flex-1 w-full max-w-2xl">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input placeholder="Search guest name or mobile..." className="pl-16 bg-background border-border h-16 rounded-[1.5rem] text-lg font-light focus:ring-[#D4AF37]/30" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <div className="flex items-center gap-6 w-full lg:w-auto">
                <button onClick={selectAll} className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] hover:opacity-70 transition-all">
                  {selectedIds.length === filteredRSVPs.length ? 'Deselect All' : 'Select All In View'}
                </button>
                <div className="h-4 w-px bg-border hidden lg:block" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{filteredRSVPs.length} Found</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/10">
                  <th className="px-8 py-6 text-left w-16"></th>
                  <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Guest Identity</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hidden md:table-cell">RSVP Details</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Seating</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Entry Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRSVPs.map((rsvp: any) => (
                  <tr key={rsvp.id} className={`group hover:bg-muted/20 transition-colors ${selectedIds.includes(rsvp.id) ? 'bg-[#D4AF37]/5' : ''}`}>
                    <td className="px-8 py-8">
                      <button onClick={() => toggleSelect(rsvp.id)} className="text-[#D4AF37] transition-transform hover:scale-110">
                        {selectedIds.includes(rsvp.id) ? <CheckSquare size={24} /> : <Square size={24} className="opacity-20" />}
                      </button>
                    </td>
                    <td className="px-8 py-8">
                      <p className="text-xl font-serif italic mb-1">{rsvp.guest_name}</p>
                      <p className="text-xs font-medium text-muted-foreground tracking-widest">{rsvp.guest_phone}</p>
                    </td>
                    <td className="px-8 py-8 hidden md:table-cell">
                      <div className="flex flex-col gap-2">
                        {rsvp.has_plus_one && (
                          <div className="flex items-center gap-2 text-blue-500">
                            <UserPlus size={12} />
                            <span className="text-[10px] font-black uppercase tracking-widest">+1 {rsvp.plus_one_name ? `(${rsvp.plus_one_name})` : ''}</span>
                          </div>
                        )}
                        {rsvp.song_request && (
                          <div className="flex items-center gap-2 text-purple-500">
                            <Music size={12} />
                            <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[150px]">{rsvp.song_request}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      {rsvp.table_number ? (
                        <span className="bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-[#D4AF37]/20">
                          Table {rsvp.table_number}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-8 py-8 text-right">
                      <div className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-full border transition-all ${
                        rsvp.checked_in 
                          ? 'bg-green-500/10 border-green-500/20 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.1)]' 
                          : 'bg-muted/40 border-border text-muted-foreground'
                      }`}>
                        {rsvp.checked_in ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">
                          {rsvp.checked_in ? 'Verified Entry' : 'Pending'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] w-[90vw] max-w-3xl">
                <div className="bg-[#D4AF37] p-8 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-black/10">
                  <div className="text-black space-y-1">
                    <span className="text-xs font-black uppercase tracking-widest block">{selectedIds.length} Guests Selected</span>
                    <p className="text-[10px] font-bold opacity-70 uppercase tracking-[0.2em]">Bulk Seating Protocol</p>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <Input placeholder="Table #" className="w-40 bg-black/10 border-black/10 text-black placeholder:text-black/40 h-16 rounded-2xl text-xl font-bold text-center" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} />
                    <Button onClick={handleBulkSeating} disabled={isAssigning} className="flex-1 md:flex-none bg-black text-white hover:bg-black/80 h-16 px-12 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl">
                      {isAssigning ? <Loader2 className="animate-spin" /> : 'Assign Table'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default GuestRegistry;