"use client";

import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface DigitalInviteProps {
  event: any;
}

const DigitalInvite = ({ event }: DigitalInviteProps) => {
  const eventDate = new Date(event.event_date);

  return (
    <div className="w-full max-w-sm bg-[#1a1a1a] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
      {/* Hero Image / Header */}
      <div className="relative h-64 overflow-hidden">
        {event.photo_url ? (
          <img 
            src={event.photo_url} 
            alt={event.event_name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#D4AF37]/20 to-black flex items-center justify-center">
            <span className="text-4xl font-serif italic text-[#D4AF37]">Invitation</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-8 -mt-12 relative z-10">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37]">You are cordially invited to</p>
            <h2 className="text-3xl font-serif italic text-white leading-tight">{event.event_name}</h2>
          </div>

          <div className="h-px w-12 bg-[#D4AF37]/30 mx-auto" />

          <div className="space-y-4 text-sm text-white/70">
            <div className="flex items-center justify-center gap-3">
              <Calendar size={16} className="text-[#D4AF37]" />
              <span>{format(eventDate, 'EEEE, MMMM do, yyyy')}</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Clock size={16} className="text-[#D4AF37]" />
              <span>{format(eventDate, 'h:mm a')}</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <MapPin size={16} className="text-[#D4AF37]" />
              <span className="line-clamp-1">{event.venue}</span>
            </div>
          </div>

          {event.message && (
            <p className="text-sm italic text-white/50 leading-relaxed px-4">
              "{event.message}"
            </p>
          )}

          <div className="pt-6">
            <div className="inline-block px-8 py-3 border border-[#D4AF37]/30 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
              RSVP Required
            </div>
          </div>
        </div>
      </div>

      {/* Footer Decoration */}
      <div className="h-2 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
    </div>
  );
};

export default DigitalInvite;