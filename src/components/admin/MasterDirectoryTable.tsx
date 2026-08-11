"use client";

import React from 'react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Event {
  id: string;
  event_name: string;
  slug: string;
  hostName: string;
  hostEmail: string;
  event_date: string;
  venue: string;
  plan: string;
  is_finished: boolean;
  rsvpCount: number;
  sprayTotal: number;
}

interface MasterDirectoryTableProps {
  events: Event[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const MasterDirectoryTable = ({ events, searchQuery, setSearchQuery }: MasterDirectoryTableProps) => {
  const filteredEvents = events.filter(e => 
    e.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-card border border-border rounded-[3rem] overflow-hidden shadow-sm p-8 md:p-12 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-2xl font-serif italic">Master Event Directory</h2>
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Live monitoring of all user orchestrations</p>
        </div>

        <div className="relative w-full md:w-80">
          <input 
            type="text"
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
  );
};

export default MasterDirectoryTable;