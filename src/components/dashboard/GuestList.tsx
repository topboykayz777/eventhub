"use client";

import React, { useState } from 'react';
import { Search, ScanLine, FileDown, CheckCircle2, Circle, Users, CheckSquare, Square, Music, UserPlus, Info, Loader2, Sparkles, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
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

const TooltipWrapper = ({ children, text }: { children: React.ReactNode, text: string }) => (
  <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent className="bg-[#1a1a1a] border-[#D4AF37]/20 text-white text-[11px] font-medium p-4 max-w-[240px] shadow-2xl rounded-2xl z-[200]">
        {text}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const GuestList = ({ event, rsvps, searchQuery, onSearchChange, onOpenScanner, onUpdate }: GuestListProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [tableNumber, setTableNumber] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

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
      if (onUpdate) onUpdate();
    } catch (err: any) { showError(err.message); } finally { setIsAssigning(false); }
  };

  const exportSongRequests = () => {
    const requests = rsvps.filter(r => r.song_request).map(r => [r.guest_name, r.song_request]);
    if (requests.length === 0) { showError("No requests yet."); return; }
    const csvContent = ["Guest,Song", ...requests.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "DJ_Playlist.csv");
    link.click();
    showSuccess("Playlist Exported.");
  };

  const exportGuestList = () => {
    if (rsvps.length === 0) return;
    const rows = rsvps.map(r => [r.guest_name, r.guest_phone, r.table_number || "N/A"]);
    const csvContent = ["Guest Name,Phone,Table", ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "Guest_List.csv");
    link.click();
    showSuccess("List Exported.");
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-2 gap-4">
        <TooltipWrapper text="The total number of unique guests who have signed up for your event.">
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] text-center shadow-lg">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">Confirmed Guests</p>
            <p className="text-3xl font-serif italic">{rsvps.length}</p>
          </div>
        </TooltipWrapper>
        <TooltipWrapper text="The active feature set unlocked for this event. Upgrade to Pro for more storage and tools.">
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] text-center shadow-lg">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">Active Suite</p>
            <p className="text-3xl font-serif italic uppercase text-[#D4AF37]">{event.plan}</p>
          </div>
        </TooltipWrapper>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Dialog>
          <TooltipWrapper text="View and manage every guest who has RSVP'd. You can also group them into tables here.">
            <DialogTrigger asChild>
              <button className="bg-white/5 border border-white/5 h-40 flex flex-col items-center justify-center gap-6 hover:bg-white/10 transition-all group rounded-[2rem]">
                <Users className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Guest Registry</span>
              </button>
            </DialogTrigger>
          </TooltipWrapper>
          <DialogContent className="bg-[#0f0f0f] border-white/10 text-white max-w-4xl w-[95vw] rounded-[3rem] p-0 overflow-hidden shadow-2xl">
            <div className="flex flex-col h-[85vh]">
              <DialogHeader className="p-8 border-b border-white/5 shrink-0 bg-white/[0.02]">
                <div className="flex justify-between items-center pr-8">
                  <DialogTitle className="text-3xl font-serif italic">Verified Guests</DialogTitle>
                  <button onClick={selectAll} className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/20 px-4 py-2 rounded-full">
                    {selectedIds.length === filteredRSVPs.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
              </DialogHeader>
              
              <div className="p-6 border-b border-white/5 bg-black/40">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                  <Input placeholder="Find a guest..." className="pl-12 bg-white/5 border-white/10 h-14 rounded-xl" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                {filteredRSVPs.map((rsvp: any) => (
                  <div key={rsvp.id} className={`flex justify-between items-center p-6 rounded-2xl border transition-all ${selectedIds.includes(rsvp.id) ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30' : 'bg-white/5 border-white/5'}`}>
                    <div className="flex items-center gap-6">
                      <button onClick={() => toggleSelect(rsvp.id)} className="text-[#D4AF37]">{selectedIds.includes(rsvp.id) ? <CheckSquare /> : <Square className="opacity-20" />}</button>
                      <div>
                        <p className="text-lg font-serif italic">{rsvp.guest_name}</p>
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{rsvp.guest_phone}</p>
                      </div>
                    </div>
                    {rsvp.table_number && <span className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full">Table {rsvp.table_number}</span>}
                  </div>
                ))}
              </div>

              {selectedIds.length > 0 && (
                <div className="p-8 border-t border-white/5 bg-[#D4AF37] shrink-0 flex items-center justify-between">
                  <span className="text-black font-black uppercase text-[10px] tracking-widest">{selectedIds.length} Guests Selected</span>
                  <div className="flex gap-4">
                    <Input placeholder="Table #" className="w-24 bg-black/10 border-black/10 text-black placeholder:text-black/40" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} />
                    <Button onClick={handleBulkSeating} disabled={isAssigning} className="bg-black text-white hover:bg-black/80 rounded-xl">
                      {isAssigning ? <Loader2 className="animate-spin" /> : 'Assign Table'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <TooltipWrapper text="Open your camera to instantly verify guest QR passes at the entrance for fast check-in.">
          <button onClick={onOpenScanner} className="bg-white/5 border border-white/5 h-40 flex flex-col items-center justify-center gap-6 hover:bg-white/10 transition-all group rounded-[2rem]">
            <ScanLine className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Scan QR Pass</span>
          </button>
        </TooltipWrapper>

        <TooltipWrapper text="Get a file containing every song requested by your guests to share with your DJ or band.">
          <button onClick={exportSongRequests} className="bg-white/5 border border-white/5 h-40 flex flex-col items-center justify-center gap-6 hover:bg-white/10 transition-all group rounded-[2rem]">
            <Music className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">The Vibe List</span>
          </button>
        </TooltipWrapper>

        <TooltipWrapper text="Download your entire guest list as a file to share with your security team or catering vendors.">
          <button onClick={exportGuestList} className="bg-white/5 border border-white/5 h-40 flex flex-col items-center justify-center gap-6 hover:bg-white/10 transition-all group rounded-[2rem]">
            <FileDown className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Export CSV</span>
          </button>
        </TooltipWrapper>
      </div>
    </div>
  );
};

export default GuestList;