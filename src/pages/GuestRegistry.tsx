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
      <div className="max-w-5xl mx-auto py-24 px-6">
        {/* Navigation & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div className="space-y-2">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-[#D4AF37] p-0 flex items-center gap-2 group mb-4">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </Button>
            <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.5em] block">Guest Archive</span>
            <h1 className="text-4xl md:text-6xl font-serif italic leading-tight">The Registry</h1>
          </div>
          <Button onClick={exportGuestList} variant="outline" className="h-14 border-border bg-card text-foreground rounded-2xl px-8 text-[11px] font-black uppercase tracking-widest hover:bg-muted transition-all">
            <FileDown className="w-4 h-4 mr-3" /> Export Manifest
          </Button>
        </div>

        {/* Search Bar - Free standing */}
        <div className="mb-12 space-y-6">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              placeholder="Search by name or mobile number..." 
              className="pl-16 bg-card border-border h-16 rounded-2xl text-lg font-light focus:ring-[#D4AF37]/30 shadow-sm" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
          </div>
          <div className="flex items-center justify-between px-2">
            <button onClick={selectAll} className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] hover:opacity-70 transition-all">
              {selectedIds.length === filteredRSVPs.length ? 'Deselect All' : 'Select All In View'}
            </button>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{filteredRSVPs.length} Verified Records</span>
          </div>
        </div>

        {/* Guest List - No Outer Card, No Scroll */}
        <div className="space-y-2">
          {filteredRSVPs.map((rsvp: any) => (
            <div 
              key={rsvp.id} 
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 md:p-8 border-b border-border/50 hover:bg-muted/10 transition-colors gap-6 ${selectedIds.includes(rsvp.id) ? 'bg-[#D4AF37]/5' : ''}`}
            >
              <div className="flex items-center gap-6 w-full sm:w-auto">
                <button onClick={() => toggleSelect(rsvp.id)} className="text-[#D4AF37] shrink-0 transition-transform hover:scale-110">
                  {selectedIds.includes(rsvp.id) ? <CheckSquare size={24} /> : <Square size={24} className="opacity-10" />}
                </button>
                <div className="min-w-0">
                  <p className="text-xl md:text-2xl font-serif italic text-foreground mb-1 truncate">{rsvp.guest_name}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-[10px] font-bold text-muted-foreground tracking-widest">{rsvp.guest_phone}</p>
                    {rsvp.has_plus_one && (
                      <div className="flex items-center gap-1.5 text-blue-500/80">
                        <UserPlus size={10} />
                        <span className="text-[9px] font-black uppercase tracking-widest">+1 {rsvp.plus_one_name ? `(${rsvp.plus_one_name})` : ''}</span>
                      </div>
                    )}
                    {rsvp.song_request && (
                      <div className="flex items-center gap-1.5 text-purple-500/80">
                        <Music size={10} />
                        <span className="text-[9px] font-black uppercase tracking-widest truncate max-w-[120px]">{rsvp.song_request}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-border/30 pt-4 sm:pt-0">
                {rsvp.table_number ? (
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/5 px-4 py-2 rounded-full border border-[#D4AF37]/10">
                    Table {rsvp.table_number}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-muted-foreground/20 uppercase tracking-widest italic">Unassigned</span>
                )}
                
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                  rsvp.checked_in 
                    ? 'bg-green-500/5 border-green-500/10 text-green-500' 
                    : 'bg-muted/20 border-border/50 text-muted-foreground/40'
                }`}>
                  {rsvp.checked_in ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                    {rsvp.checked_in ? 'In' : 'Out'}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filteredRSVPs.length === 0 && (
            <div className="text-center py-40">
              <Users className="w-12 h-12 text-muted-foreground/20 mx-auto mb-6" />
              <p className="text-muted-foreground font-light italic">No matching records found in the registry.</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] w-[95vw] max-w-2xl">
            <div className="bg-[#D4AF37] p-6 md:p-8 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-black/5">
              <div className="text-black text-center md:text-left">
                <span className="text-[10px] font-black uppercase tracking-widest block">{selectedIds.length} Guests Selected</span>
                <p className="text-[8px] font-bold opacity-70 uppercase tracking-[0.2em]">Bulk Seating Protocol</p>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <Input placeholder="Table #" className="w-24 bg-black/10 border-black/10 text-black placeholder:text-black/30 h-14 rounded-xl text-lg font-bold text-center" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} />
                <Button onClick={handleBulkSeating} disabled={isAssigning} className="flex-1 md:flex-none bg-black text-white hover:bg-black/80 h-14 px-10 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  {isAssigning ? <Loader2 className="animate-spin" /> : 'Assign'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GuestRegistry;