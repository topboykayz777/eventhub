"use client";

import React, { useState } from 'react';
import { Search, ScanLine, FileDown, CheckCircle2, Circle, Users, CheckSquare, Square, Music, UserPlus, Info, Loader2, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GuestListProps {
  event: any;
  rsvps: any[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenScanner: () => void;
  onUpdate?: () => void;
}

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

const GuestList = ({ 
  event,
  rsvps, 
  searchQuery, 
  onSearchChange, 
  onOpenScanner, 
  onUpdate
}: GuestListProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [tableNumber, setTableNumber] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  const filteredRSVPs = rsvps.filter((r: any) => 
    r.guest_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.guest_phone.includes(searchQuery) ||
    (r.plus_one_name && r.plus_one_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredRSVPs.length) setSelectedIds([]);
    else setSelectedIds(filteredRSVPs.map(r => r.id));
  };

  const handleBulkSeating = async () => {
    if (!tableNumber || selectedIds.length === 0) {
      showError("Please enter a table number and select guests.");
      return;
    }
    setIsAssigning(true);

    try {
      const { error } = await supabase
        .from('rsvps')
        .update({ table_number: tableNumber })
        .in('id', selectedIds);

      if (error) throw error;

      showSuccess(`Assigned ${selectedIds.length} guests to Table ${tableNumber}`);
      setSelectedIds([]);
      setTableNumber('');
      if (onUpdate) onUpdate();
    } catch (err: any) {
      showError(err.message);
    } finally {
      setIsAssigning(false);
    }
  };

  const getTableMates = (tableNum: string) => {
    return rsvps.filter(r => r.table_number === tableNum);
  };

  const exportSongRequests = () => {
    const requests = rsvps.filter(r => r.song_request).map(r => [r.guest_name, r.song_request]);
    if (requests.length === 0) {
      showError("No song requests found.");
      return;
    }
    const csvContent = ["Guest,Song Request", ...requests.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "VibeList_SongRequests.csv");
    link.click();
    showSuccess("Vibe List exported for the DJ.");
  };

  const exportGuestList = () => {
    if (rsvps.length === 0) {
      showError("Guest list is empty.");
      return;
    }
    const headers = ["Guest Name", "Phone", "Plus One", "Plus One Name", "Song Request", "Table Number", "Checked In"];
    const rows = rsvps.map(r => [
      `"${r.guest_name}"`,
      `"${r.guest_phone}"`,
      r.has_plus_one ? "Yes" : "No",
      `"${r.plus_one_name || ""}"`,
      `"${r.song_request || ""}"`,
      r.table_number || "N/A",
      r.checked_in ? "Yes" : "No"
    ]);
    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "GuestList_Export.csv");
    link.click();
    showSuccess("Guest list exported successfully.");
  };

  return (
    <div className="space-y-12">
      {/* Management Stats - Relocated */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="glass-premium p-10 rounded-[2.5rem] border border-white/5 shadow-lg">
          <div className="flex items-center mb-6">
            <Users className="text-[#D4AF37] w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">Engagement Pool</span>
            <InfoButton text="The total number of unique RSVPs recorded for this event. Each entry represents a verified digital pass." />
          </div>
          <div className="text-4xl font-serif italic">{rsvps.length} Confirmed Guests</div>
        </div>
        <div className="glass-premium p-10 rounded-[2.5rem] border border-white/5 shadow-lg">
          <div className="flex items-center mb-6">
            <Sparkles className="text-[#D4AF37] w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">Service Tier</span>
            <InfoButton text="Your active orchestration plan. This determines your gallery limits and access to industrial tools like the WhatsApp Dispatcher." />
          </div>
          <div className="text-4xl font-serif italic uppercase tracking-tighter">{event.plan} Suite</div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="space-y-6">
        <div className="flex flex-col xl:flex-row gap-6">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4AF37] w-5 h-5" />
            <Input 
              placeholder="Search names or numbers..." 
              className="pl-16 bg-white/5 border-white/10 h-16 rounded-2xl text-sm font-light"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full xl:w-auto">
            <Button variant="outline" onClick={onOpenScanner} className="h-16 rounded-2xl border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em] flex-1">
              <ScanLine className="w-4 h-4 mr-2" /> Scan QR Pass <InfoButton text="Launch your device camera to instantly verify guest QR codes at the red carpet." />
            </Button>
            <Button variant="outline" onClick={exportSongRequests} className="h-16 rounded-2xl border-white/10 bg-white/5 text-white text-[10px] font-black uppercase tracking-[0.3em] flex-1">
              <Music className="w-4 h-4 mr-2" /> The Vibe List <InfoButton text="Export a curated CSV of all guest song requests to hand over to your DJ or sound engineer." />
            </Button>
            <Button variant="outline" onClick={exportGuestList} className="h-16 rounded-2xl border-white/10 bg-white/5 text-white text-[10px] font-black uppercase tracking-[0.3em] flex-1">
              <FileDown className="w-4 h-4 mr-2" /> Export CSV <InfoButton text="Download your complete verified guest list with phone numbers and seating for your vendors." />
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-[#D4AF37] p-8 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center"><Users className="text-black w-6 h-6" /></div>
                <span className="text-[12px] font-black uppercase tracking-widest text-black">{selectedIds.length} Targets Selected</span>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <Input 
                  placeholder="Table #" 
                  className="bg-black/10 border-black/20 h-14 w-28 rounded-xl text-black placeholder:text-black/40 text-lg font-bold" 
                  value={tableNumber} 
                  onChange={(e) => setTableNumber(e.target.value)} 
                />
                <Button 
                  onClick={handleBulkSeating} 
                  disabled={isAssigning} 
                  className="bg-black text-white hover:bg-black/80 rounded-xl h-14 px-10 text-[10px] font-black uppercase tracking-[0.2em]"
                >
                  {isAssigning ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Assign Seating'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guest Archive Card */}
        <div className="glass-premium rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-serif italic">Verified Registry</h3>
              <InfoButton text="This scrollable vault contains all guests who have successfully registered for your event." />
            </div>
            <button onClick={selectAll} className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-[#D4AF37] transition-colors bg-white/5 px-4 py-2 rounded-full">
              {selectedIds.length === filteredRSVPs.length ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
              {selectedIds.length === filteredRSVPs.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          
          <div className="max-h-[600px] overflow-y-auto p-6 md:p-10 space-y-4 custom-scrollbar">
            {filteredRSVPs.map((rsvp: any) => (
              <div key={rsvp.id} className={`flex flex-col md:flex-row justify-between items-center p-8 rounded-[2rem] border transition-all group ${selectedIds.includes(rsvp.id) ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30' : 'bg-white/5 border-white/5 hover:border-[#D4AF37]/30'}`}>
                <div className="flex items-center gap-8 w-full md:w-auto">
                  <button onClick={() => toggleSelect(rsvp.id)} className="text-[#D4AF37] shrink-0">
                    {selectedIds.includes(rsvp.id) ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6 opacity-20 group-hover:opacity-100" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-2xl font-serif italic text-white mb-2 truncate">{rsvp.guest_name}</p>
                    <div className="flex flex-wrap items-center gap-4">
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">{rsvp.guest_phone}</p>
                      {rsvp.has_plus_one && (
                        <span className="text-[8px] font-black uppercase tracking-widest text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full flex items-center gap-2">
                          <UserPlus size={10} /> +1 {rsvp.plus_one_name ? `(${rsvp.plus_one_name})` : ''}
                        </span>
                      )}
                      {rsvp.song_request && <span className="text-[8px] font-black uppercase tracking-widest text-purple-400 bg-purple-400/10 px-2 py-1 rounded-full flex items-center gap-2"><Music size={10} /> {rsvp.song_request}</span>}
                      
                      {rsvp.table_number && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full flex items-center gap-2 hover:bg-[#D4AF37]/20 transition-all">
                              Table {rsvp.table_number} <Info size={10} />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="bg-[#0f0f0f] border-white/10 text-white rounded-[2.5rem] p-10">
                            <DialogHeader>
                              <DialogTitle className="text-3xl font-serif italic mb-8">Table {rsvp.table_number} Concierge</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5 pb-4">Assigned to this table:</p>
                              <div className="grid gap-3">
                                {getTableMates(rsvp.table_number).map(mate => (
                                  <div key={mate.id} className="flex justify-between items-center p-6 bg-white/5 border border-white/5 rounded-2xl">
                                    <span className="text-lg font-light">{mate.guest_name}</span>
                                    {mate.checked_in && <CheckCircle2 size={20} className="text-green-500" />}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-row md:flex-col items-center md:items-end gap-3 w-full md:w-auto mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-white/5">
                  <div className={`flex items-center gap-3 px-5 py-2.5 rounded-full ${rsvp.checked_in ? 'text-green-500 bg-green-500/10' : 'text-gray-600 bg-white/5'}`}>
                    {rsvp.checked_in ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                    <span className="text-[9px] font-black uppercase tracking-[0.3em]">Main Pass: {rsvp.checked_in ? 'Verified' : 'Pending'}</span>
                  </div>
                  {rsvp.has_plus_one && (
                    <div className={`flex items-center gap-3 px-5 py-2.5 rounded-full ${rsvp.plus_one_checked_in ? 'text-blue-500 bg-blue-500/10' : 'text-gray-600 bg-white/5'}`}>
                      {rsvp.plus_one_checked_in ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      <span className="text-[9px] font-black uppercase tracking-[0.3em]">Plus One: {rsvp.plus_one_checked_in ? 'Verified' : 'Pending'}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestList;