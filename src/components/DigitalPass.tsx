"use client";

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, User, Ticket } from 'lucide-react';
import { format } from 'date-fns';

interface DigitalPassProps {
  event: any;
  rsvp: any;
}

const DigitalPass = ({ event, rsvp }: DigitalPassProps) => {
  const eventDate = new Date(event.event_date);
  
  // The QR code should contain the RSVP ID or a check-in URL
  // We'll use the RSVP ID as the primary identifier
  const qrValue = rsvp.id;

  return (
    <div className="w-full max-w-sm bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
      {/* Top Section: Event Info */}
      <div className="bg-[#0f0f0f] p-8 text-white relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">Official Entry Pass</p>
              <h2 className="text-2xl font-serif italic">{event.event_name}</h2>
            </div>
            <Ticket className="text-[#D4AF37]" size={24} />
          </div>

          <div className="grid grid-cols-2 gap-4 text-[10px] font-bold uppercase tracking-wider">
            <div className="space-y-1">
              <p className="text-white/40">Date</p>
              <p>{format(eventDate, 'MMM dd, yyyy')}</p>
            </div>
            <div className="space-y-1">
              <p className="text-white/40">Time</p>
              <p>{format(eventDate, 'h:mm a')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Perforated Line */}
      <div className="relative h-8 bg-white flex items-center">
        <div className="absolute left-0 -translate-x-1/2 w-8 h-8 bg-[#0f0f0f] rounded-full" />
        <div className="absolute right-0 translate-x-1/2 w-8 h-8 bg-[#0f0f0f] rounded-full" />
        <div className="w-full border-t-2 border-dashed border-gray-100 mx-8" />
      </div>

      {/* Bottom Section: Guest & QR */}
      <div className="p-8 pt-4 bg-white text-black flex flex-col items-center space-y-8">
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2 text-[#D4AF37] mb-1">
            <User size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Guest Name</span>
          </div>
          <p className="text-xl font-medium">{rsvp.guest_name}</p>
          {rsvp.table_number && (
            <p className="text-sm text-gray-500">Table {rsvp.table_number}</p>
          )}
        </div>

        {/* QR Code Container */}
        <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100 shadow-inner">
          <QRCodeSVG 
            value={qrValue}
            size={160}
            level="H"
            includeMargin={false}
            className="rounded-lg"
          />
        </div>

        <div className="text-center space-y-2">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">Scan at the entrance</p>
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <MapPin size={12} />
            <span className="text-[10px]">{event.venue}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 py-4 text-center border-t border-gray-100">
        <p className="text-[8px] font-bold uppercase tracking-widest text-gray-300">Powered by Dyad Concierge</p>
      </div>
    </div>
  );
};

export default DigitalPass;