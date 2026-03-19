"use client";

import React from 'react';
import { Search, ScanLine, FileDown, CheckCircle2, Circle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
  onExportCSV, 
  onToggleCheckIn 
}: GuestListProps) => {
  const filteredRSVPs = rsvps.filter((r: any) => 
    r.guest_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.guest_phone.includes(searchQuery)
  );

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

      <div className="max-h-[400px] overflow-y-auto space-y-4 pr-4 custom-scrollbar">
        {filteredRSVPs.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/5">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">No guests found in the registry.</p>
          </div>
        ) : (
          filteredRSVPs.map((rsvp: any) => (
            <div key={rsvp.id} className="flex justify-between items-center p-8 bg-white/5 border border-white/5 group hover:border-[#D4AF37]/30 transition-all">
              <div>
                <p className="text-lg font-serif italic text-white mb-1">{rsvp.guest_name}</p>
                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-[0.2em]">{rsvp.guest_phone}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onToggleCheckIn(rsvp.id, rsvp.checked_in)}
                className={`rounded-none transition-all ${rsvp.checked_in ? 'text-green-500 bg-green-500/5' : 'text-gray-500 hover:text-white'}`}
              >
                {rsvp.checked_in ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                <span className="ml-3 text-[8px] font-black uppercase tracking-[0.3em]">
                  {rsvp.checked_in ? 'Checked In' : 'Check In'}
                </span>
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GuestList;