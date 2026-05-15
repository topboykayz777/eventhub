"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  CheckCircle2, 
  Circle, 
  MoreVertical, 
  User,
  Phone,
  Music,
  Users as UsersIcon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { showError, showSuccess } from '@/utils/toast';

interface GuestListProps {
  eventId: string;
}

const GuestList = ({ eventId }: GuestListProps) => {
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventId) {
      fetchGuests();
    }
  }, [eventId]);

  const fetchGuests = async () => {
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGuests(data || []);
    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleCheckIn = async (guestId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('rsvps')
        .update({ checked_in: !currentStatus })
        .eq('id', guestId);

      if (error) throw error;
      
      setGuests(guests.map(g => 
        g.id === guestId ? { ...g, checked_in: !currentStatus } : g
      ));
      
      showSuccess(currentStatus ? "Guest unchecked" : "Guest checked in");
    } catch (error: any) {
      showError(error.message);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Loading guests...</div>;
  }

  if (guests.length === 0) {
    return <div className="p-12 text-center text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">No guests found</div>;
  }

  return (
    <div className="divide-y divide-white/5">
      {guests.map((guest) => (
        <div key={guest.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
              guest.checked_in ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5 border-white/10'
            }`}>
              <User className={`w-4 h-4 ${guest.checked_in ? 'text-green-400' : 'text-gray-500'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-[0.1em]">{guest.guest_name}</span>
                {guest.has_plus_one && (
                  <span className="text-[8px] bg-[#D4AF37]/10 text-[#D4AF37] px-1.5 py-0.5 font-black uppercase tracking-widest">
                    +1
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.1em] text-gray-500">
                <span className="flex items-center gap-1"><Phone className="w-2.5 h-2.5" /> {guest.guest_phone}</span>
                {guest.song_request && (
                  <span className="flex items-center gap-1 text-[#D4AF37]/70"><Music className="w-2.5 h-2.5" /> Request</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">Status</div>
              <div className={`text-[10px] font-black uppercase tracking-widest ${
                guest.checked_in ? 'text-green-400' : 'text-gray-600'
              }`}>
                {guest.checked_in ? 'Checked In' : 'Pending'}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => toggleCheckIn(guest.id, guest.checked_in)}
                className={`rounded-none h-10 w-10 ${
                  guest.checked_in ? 'text-green-400 hover:text-green-300' : 'text-gray-500 hover:text-white'
                }`}
              >
                {guest.checked_in ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-none h-10 w-10 text-gray-500 hover:text-white">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-black border-white/10 rounded-none">
                  <DropdownMenuItem className="text-[10px] font-bold uppercase tracking-[0.2em] focus:bg-white/10 focus:text-white">
                    Edit Guest
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 focus:bg-red-500/10 focus:text-red-500">
                    Remove Guest
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GuestList;