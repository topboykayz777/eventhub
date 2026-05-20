"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Music, FileDown, CheckCircle2, Circle, Users, CheckSquare, Square, UserPlus, Info, ArrowLeft, Loader2, Sparkles, X } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const InfoButton = ({ text }: { text: string }) => (
  <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="inline-flex items-center justify-center ml-2 text-gray-500 hover:text-[#D4AF37] transition-all">
          <Info size={12} className="opacity-60" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="bg-[#1a1a1a] border-[#D4AF37]/20 text-white text-[10px] font-medium p-3 max-w-[200px] shadow-2xl rounded-xl z-[200]">
        {text}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

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

  const exportSongRequests = () => {
    const requests = rsvps.filter(r => r.song_request).map(r => [r.guest_name, r.song_request]);
    if (requests.length === 0) { showError("No song requests found."); return; }
    const csvContent = ["Guest,Song", ...requests.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${event.event_name.replace(/\s+/g, '_')}_VibeList.csv`);
    link.click();
    showSuccess("DJ Playlist Exported.");
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

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#050505]"><Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" /></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto py-24 px-6">
        <div className="flex justify-between items-center mb-16">
          <div className="flex flex-col gap-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="w-fit text-gray-500 hover:text-[#D4AF37] p-0 flex items-center gap-2"><ArrowLeft size={16} /> Dashboard</Button>
            <div>
              <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.4em] block mb-2">Guest Archive</span>
              <h1 className="text-4xl font-serif italic">The Registry</h1>
            </div>
          </div>
          <div className="flex gap-4">
            <Button onClick={exportSongRequests} className="h-14 bg-white/5 border border-white/10 text-white rounded-xl px-8 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"><Music className="w-4 h-4 mr-3" /> Vibe List</Button>
            <Button onClick={exportGuestList} className="h-14 bg-white/5 border border-white/10 text-white rounded-xl px-8 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"><FileDown className="w-4 h-4 mr-3" /> Export CSV</Button>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 bg-black/40">
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                <Input placeholder="Find a guest by name or phone..." className="pl-12 bg-white/5 border-white/10 h-14 rounded-xl text-lg font-light" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <button onClick={selectAll} className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/20 px-6 py-4 rounded-xl hover:bg-[#D4AF37]/10 transition-all shrink-0">
                {selectedIds.length === filteredRSVPs.length ? 'Deselect All' : 'Select All Guests'}
              </button>
            </div>
          </div>

          <div className="p-10 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {filteredRSVPs.map((rsvp: any) => (
              <div key={rsvp.id} className={`flex flex-col md:flex-row justify-between items-center p-8 rounded-[2rem] border transition-all ${selectedIds.includes(rsvp.id) ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30' : 'bg-white/5 border-white/5 hover:border-[#D4AF37]/20'}`}>
                <div className="flex items-center gap-8 w-full md:w-auto">
                  <button onClick={() => toggleSelect(rsvp.id)} className="text-[#D4AF37]">{selectedIds.includes(rsvp.id) ? <CheckSquare size={24} /> : <Square size={24} className="opacity-20" />}</button>
                  <div>
                    <p className="text-2xl font-serif italic mb-1">{rsvp.guest_name}</p>
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{rsvp.guest_phone}</span>
                      {rsvp.has_plus_one && <span className="text-[8px] font-black uppercase tracking-widest text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full flex items-center gap-2"><UserPlus size={10} /> +1 {rsvp.plus_one_name ? `(${rsvp.plus_one_name})` : ''}</span>}
                      {rsvp.song_request && <span className="text-[8px] font-black uppercase tracking-widest text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full flex items-center gap-2"><Music size={10} /> {rsvp.song_request}</span>}
                      {rsvp.table_number && <span className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full">Table {rsvp.table_number}</span>}
                    </div>
                  </div>
                </div>
                <div className={`mt-6 md:mt-0 flex items-center gap-3 px-6 py-3 rounded-full ${rsvp.checked_in ? 'text-green-500 bg-green-500/10' : 'text-gray-600 bg-white/5'}`}>
                  {rsvp.checked_in ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                  <span className="text-[9px] font-black uppercase tracking-[0.3em]">Checked-In: {rsvp.checked_in ? 'Yes' : 'No'}</span>
                </div>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.div initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 50 }} className="p-8 border-t border-white/5 bg-[#D4AF37] flex flex-col md:flex-row items-center justify-between shadow-2xl">
                <span className="text-black font-black uppercase text-xs tracking-widest mb-4 md:mb-0">{selectedIds.length} Guests Selected for Seating</span>
                <div className="flex gap-4 w-full md:w-auto">
                  <Input placeholder="Assign Table #" className="w-40 bg-black/10 border-black/10 text-black placeholder:text-black/40 h-14 rounded-xl text-lg font-bold" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} />
                  <Button onClick={handleBulkSeating} disabled={isAssigning} className="flex-1 md:flex-none bg-black text-white hover:bg-black/80 h-14 px-12 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    {isAssigning ? <Loader2 className="animate-spin" /> : 'Update Table'}
                  </Button>
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