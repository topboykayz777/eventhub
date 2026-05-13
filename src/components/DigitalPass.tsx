"use client";

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { User, ShieldCheck, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface DigitalPassProps {
  event: any;
  rsvp: any;
  isPlusOne?: boolean;
}

const DigitalPass = ({ event, rsvp, isPlusOne = false }: DigitalPassProps) => {
  const eventDate = new Date(event.event_date);
  // The QR code value must be the RSVP ID for the scanner to work
  const qrValue = isPlusOne ? `${rsvp.id}:plus-one` : rsvp.id;
  const displayName = isPlusOne ? (rsvp.plus_one_name || `${rsvp.guest_name}'s Guest`) : rsvp.guest_name;
  const theme = event.theme || 'modern';
  
  const themeStyles: Record<string, any> = {
    modern: { bg: "bg-[#0f0f0f]", text: "text-white", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/30" },
    traditional: { bg: "bg-[#064e3b]", text: "text-[#fdfcf0]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/40" },
    elegant: { bg: "bg-white", text: "text-gray-900", accent: "text-black", border: "border-black/10" },
    sahara: { bg: "bg-[#451a03]", text: "text-[#fef3c7]", accent: "text-[#fbbf24]", border: "border-[#fbbf24]/30" },
    velvet: { bg: "bg-[#2e1065]", text: "text-[#f5f3ff]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/30" },
    garden: { bg: "bg-[#064e3b]", text: "text-[#ecfdf5]", accent: "text-[#10b981]", border: "border-[#10b981]/30" },
    oceanic: { bg: "bg-[#1e3a8a]", text: "text-[#eff6ff]", accent: "text-[#93c5fd]", border: "border-[#93c5fd]/30" },
    rose: { bg: "bg-[#831843]", text: "text-[#fdf2f8]", accent: "text-[#fbcfe8]", border: "border-[#fbcfe8]/30" },
    earth: { bg: "bg-[#431407]", text: "text-[#fff7ed]", accent: "text-[#fb923c]", border: "border-[#fb923c]/30" },
    silver: { bg: "bg-[#1f2937]", text: "text-[#f9fafb]", accent: "text-[#9ca3af]", border: "border-[#9ca3af]/30" },
    dynasty: { bg: "bg-[#7f1d1d]", text: "text-[#fef2f2]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/30" },
    vintage: { bg: "bg-[#92400e]", text: "text-[#fef3c7]", accent: "text-[#451a03]", border: "border-[#92400e]/30" },
    onyx: { bg: "bg-black", text: "text-white", accent: "text-[#06b6d4]", border: "border-[#06b6d4]/30" },
    lavender: { bg: "bg-[#8b5cf6]", text: "text-white", accent: "text-white", border: "border-white/20" },
    midnight: { bg: "bg-[#020617]", text: "text-white", accent: "text-[#38bdf8]", border: "border-[#38bdf8]/30" },
    champagne: { bg: "bg-[#d97706]", text: "text-white", accent: "text-white", border: "border-white/20" },
    forest: { bg: "bg-[#064e3b]", text: "text-white", accent: "text-[#10b981]", border: "border-[#10b981]/30" },
    sunset: { bg: "bg-[#f97316]", text: "text-white", accent: "text-white", border: "border-white/20" },
    marble: { bg: "bg-[#111827]", text: "text-white", accent: "text-[#6b7280]", border: "border-white/10" },
    platinum: { bg: "bg-[#1f2937]", text: "text-white", accent: "text-[#9ca3af]", border: "border-white/10" }
  };

  const style = themeStyles[theme] || themeStyles.modern;

  return (
    <div className={`w-full max-w-sm ${style.bg} ${style.text} rounded-[2.5rem] p-10 shadow-2xl border ${style.border} relative overflow-hidden flex flex-col items-center`}>
      {/* Luxury Card Header */}
      <div className="w-full flex justify-between items-start mb-12 relative z-10">
        <div className="space-y-1">
          <p className={`text-[8px] font-black uppercase tracking-[0.5em] ${style.accent}`}>Access Pass</p>
          <h3 className="text-xl font-serif italic">{event.event_name}</h3>
        </div>
        <ShieldCheck className={`${style.accent} opacity-50`} size={24} />
      </div>

      {/* Guest Identity */}
      <div className="w-full space-y-8 mb-12 relative z-10">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full ${style.accent.replace('text-', 'bg-')} bg-opacity-10 flex items-center justify-center`}>
            <User className={style.accent} size={20} />
          </div>
          <div>
            <p className="text-[8px] font-bold uppercase tracking-widest opacity-40">Verified Guest</p>
            <p className="text-xl font-medium tracking-tight">{displayName}</p>
          </div>
        </div>

        {rsvp.table_number && (
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
            <span className="text-[8px] font-black uppercase tracking-widest opacity-50">Seating</span>
            <span className={`text-xs font-bold ${style.accent}`}>Table {rsvp.table_number}</span>
          </div>
        )}
      </div>

      {/* Scannable QR Code */}
      <div className="relative group mb-10">
        <div className="absolute -inset-4 bg-white/5 rounded-[3rem] blur-2xl group-hover:bg-white/10 transition-all" />
        <div className="p-5 bg-white rounded-[2.5rem] shadow-2xl relative z-10 border border-gray-100">
          <QRCodeSVG 
            value={qrValue} 
            size={160} 
            level="H" 
            includeMargin={true}
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>
      </div>

      {/* Footer Details */}
      <div className="w-full grid grid-cols-2 gap-6 pt-8 border-t border-white/5 relative z-10">
        <div className="space-y-1">
          <p className="text-[7px] font-bold uppercase tracking-widest opacity-30">Event Date</p>
          <p className="text-[10px] font-bold">{format(eventDate, 'MMM dd, yyyy')}</p>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-[7px] font-bold uppercase tracking-widest opacity-30">Venue</p>
          <p className="text-[10px] font-bold truncate">{event.venue}</p>
        </div>
      </div>

      <div className="mt-8 opacity-20">
        <p className="text-[7px] font-black uppercase tracking-[0.4em]">Verified by EventHub NG</p>
      </div>
    </div>
  );
};

export default DigitalPass;