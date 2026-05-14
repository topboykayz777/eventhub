"use client";

import React, { forwardRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface DigitalInviteProps {
  event: any;
}

const DigitalInvite = forwardRef<HTMLDivElement, DigitalInviteProps>(({ event }, ref) => {
  const eventUrl = `${window.location.origin}/e/${event.slug}`;
  const eventDate = new Date(event.event_date);

  return (
    <div 
      ref={ref}
      className="w-[380px] bg-[#0a0a0a] border border-[#D4AF37]/30 p-8 relative overflow-hidden shadow-2xl"
      style={{ minHeight: '600px' }}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-[#D4AF37]/20 -translate-x-4 -translate-y-4" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-[#D4AF37]/20 translate-x-4 translate-y-4" />
      
      <div className="relative z-10 flex flex-col items-center text-center h-full">
        <div className="mb-8">
          <div className="w-16 h-16 border border-[#D4AF37] rotate-45 flex items-center justify-center mx-auto mb-6">
            <span className="text-[#D4AF37] font-serif italic text-2xl -rotate-45">E</span>
          </div>
          <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.4em] mb-2">Official Invitation</p>
          <div className="h-[1px] w-12 bg-[#D4AF37]/30 mx-auto" />
        </div>

        <h1 className="text-3xl font-serif italic text-white mb-8 leading-tight">
          {event.event_name}
        </h1>

        <div className="space-y-6 mb-12 w-full">
          <div className="flex items-center justify-center gap-4 text-gray-400">
            <Calendar size={16} className="text-[#D4AF37]" />
            <span className="text-xs font-light tracking-widest uppercase">
              {format(eventDate, 'EEEE, MMMM do, yyyy')}
            </span>
          </div>
          <div className="flex items-center justify-center gap-4 text-gray-400">
            <Clock size={16} className="text-[#D4AF37]" />
            <span className="text-xs font-light tracking-widest uppercase">
              {format(eventDate, 'h:mm a')}
            </span>
          </div>
          <div className="flex items-center justify-center gap-4 text-gray-400 px-4">
            <MapPin size={16} className="text-[#D4AF37] shrink-0" />
            <span className="text-xs font-light tracking-widest uppercase line-clamp-2">
              {event.venue}
            </span>
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-white/5 w-full flex flex-col items-center">
          <div className="bg-white p-3 rounded-xl mb-4 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
            <QRCodeCanvas 
              value={eventUrl}
              size={140}
              level="H"
              includeMargin={false}
              imageSettings={{
                src: "/favicon.svg",
                x: undefined,
                y: undefined,
                height: 24,
                width: 24,
                excavate: true,
              }}
            />
          </div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">
            Scan to RSVP & Access Event Details
          </p>
        </div>
      </div>

      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
    </div>
  );
});

DigitalInvite.displayName = 'DigitalInvite';

export default DigitalInvite;