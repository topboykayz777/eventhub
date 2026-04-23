"use client";

import React, { useState } from 'react';
import { Search, ScanLine, FileDown, CheckCircle2, Circle, Users, CheckSquare, Square } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';
import { motion, AnimatePresence } from 'framer-motion';

interface GuestListProps {
  rsvps: any[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenScanner: () => void;
  onExportCSV: () => void;
  onToggleCheckIn: (rsvpId: string, currentStatus: boolean) => void;
}

const GuestList = ({ 
  rsvps, 
  searchQuery, 
  onSearchChange, 
  onOpenScanner, 
  onExportCSV
}: GuestListProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [tableNumber, setTableNumber] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  const filteredRSVPs = rsvps.filter((r: any) => 
    r.guest_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.guest_phone.includes(searchQuery)
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
    if (!tableNumber || selectedIds.length === 0) return;
    setIsAssigning(true);

    const { error } = await supabase
      .from('rsvps')
      .update({ table_number: tableNumber })
      .in('id', selectedIds);

    if (error) showError(error.message);
    else {
      showSuccess(`Assigned ${selectedIds.length} guests to Table ${tableNumber}`);
      setSelectedIds([]);
      setTableNumber('');
    }
    setIsAssigning(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4AF37] w-4 h-4" />
          <Input 
            placeholder="Search the guest list..." 
            className="pl-16 bg-white/5 border-white/10 h-16 rounded-none text-[10px] font-bold uppercase tracking-[0.2em]"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={onOpenScanner}
            className="h-16 rounded-none border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em] px-8"
          >
            <ScanLine className="w-4 h-4 mr-2" /> Scan QR
          </Button>
          <Button 
            variant="outline" 
            onClick={onExportCSV}
            className="h-16 rounded-none border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-[0.2em] px-8"
          >
            <FileDown className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-[#D4AF37] p-6 flex flex-col md:flex-row justify-between items-center gap-6"
          >
            <div className="flex items-center gap-4">
              <Users className="text-black w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest text-black">
                {selectedIds.length} Guests Selected
              </span>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <Input 
                placeholder="Table #" 
                className="bg-black/10 border-black/20 h-12 w-24 rounded-none text-black placeholder:text-black/40 text-[10px] font-bold uppercase"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
              />
              <Button 
                onClick={handleBulkSeating}
                disabled={isAssigning}
                className="bg-black text-white hover:bg-black/80 rounded-none h-12 px-8 text-[10px] font-bold uppercase tracking-widest"
              >
                Assign Seating
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-h-[500px] overflow-y-auto space-y-4 pr-4 custom-scrollbar">
        <div className="flex items-center px-8 mb-4">
          <button onClick={selectAll} className="flex items-center gap-3 text-[8px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
            {selectedIds.length === filteredRSVPs.length ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
            Select All
          </button>
        </div>

        {filteredRSVPs.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/5">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">No guests found in the registry.</p>
          </div>
        ) : (
          filteredRSVPs.map((rsvp: any) => (
            <div key={rsvp.id} className={`flex justify-between items-center p-8 border transition-all group ${
              selectedIds.includes(rsvp.id) ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30' : 'bg-white/5 border-white/5 hover:border-[#D4AF37]/30'
            }`}>
              <div className="flex items-center gap-6">
                <button onClick={() => toggleSelect(rsvp.id)} className="text-[#D4AF37]">
                  {selectedIds.includes(rsvp.id) ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 opacity-20 group-hover:opacity-100" />}
                </button>
                <div>
                  <p className="text-lg font-serif italic text-white mb-1">{rsvp.guest_name}</p>
                  <div className="flex items-center gap-4">
                    <p className="text-[8px] text-gray-500 font-bold uppercase tracking-[0.2em]">{rsvp.guest_phone}</p>
                    {rsvp.table_number && (
                      <span className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5">
                        Table {rsvp.table_number}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Read-only status badge - Manual toggle disabled as requested */}
              <div className={`flex items-center gap-3 px-4 py-2 ${rsvp.checked_in ? 'text-green-500 bg-green-500/5' : 'text-gray-600'}`}>
                {rsvp.checked_in ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                <span className="text-[8px] font-black uppercase tracking-[0.3em]">
                  {rsvp.checked_in ? 'Verified' : 'Pending'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GuestList;