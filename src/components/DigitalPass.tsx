"use client";

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, User, Ticket, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

interface DigitalPassProps {
  event: any;
  rsvp: any;
  isPlusOne?: boolean;
}

const DigitalPass = ({ event, rsvp, isPlusOne = false }: DigitalPassProps) => {
  const eventDate = new Date(event.event_date);
  const qrValue = isPlusOne ? `${rsvp.id}:plus-one` : rsvp.id;
  const displayName = isPlusOne ? (rsvp.plus_one_name || `${rsvp.guest_name}'s Guest`) : rsvp.guest_name;
  const theme = event.theme || 'modern';
  
  const themeStyles: Record<string, any> = {
    modern: { bg: "bg-white", text: "text-black", accent: "text-[#D4AF37]", header: "bg-[#0f0f0f]", headerText: "text-white" },
    traditional: { bg: "bg-[#fdfcf0]", text: "text-[#064e3b]", accent: "text-[#D4AF37]", header: "bg-[#064e3b]", headerText: "text-[#fdfcf0]" },
    elegant: { bg: "bg-white", text: "text-gray-900", accent: "text-black", header: "bg-black", headerText: "text-white" },
    sahara: { bg: "bg-[#fef3c7]", text: "text-[#451a03]", accent: "text-[#fbbf24]", header: "bg-[#451a03]", headerText: "text-[#fef3c7]" },
    velvet: { bg: "bg-[#f5f3ff]", text: "text-[#2e1065]", accent: "text-[#D4AF37]", header: "bg-[#2e1065]", headerText: "text-[#f5f3ff]" },
    garden: { bg: "bg-[#ecfdf5]", text: "text-[#064e3b]", accent: "text-[#10b981]", header: "bg-[#064e3b]", headerText: "text-[#ecfdf5]" },
    oceanic: { bg: "bg-[#eff6ff]", text: "text-[#1e3a8a]", accent: "text-[#93c5fd]", header: "bg-[#1e3a8a]", headerText: "text-[#eff6ff]" },
    rose: { bg: "bg-[#fdf2f8]", text: "text-[#831843]", accent: "text-[#fbcfe8]", header: "bg-[#831843]", headerText: "text-[#fdf2f8]" },
    earth: { bg: "bg-[#fff7ed]", text: "text-[#431407]", accent: "text-[#fb923c]", header: "bg-[#431407]", headerText: "text-[#fff7ed]" },
    silver: { bg: "bg-[#f9fafb]", text: "text-[#1f2937]", accent: "text-[#9ca3af]", header: "bg-[#1f2937]", headerText: "text-[#f9fafb]" },
    dynasty: { bg: "bg-[#fef2f2]", text: "text-[#7f1d1d]", accent: "text-[#D4AF37]", header: "bg-[#7f1d1d]", headerText: "text-[#fef2f2]" },
    vintage: { bg: "bg-[#fef3c7]", text: "text-[#451a03]", accent: "text-[#92400e]", header: "bg-[#92400e]", headerText: "text-[#fef3c7]" },
    onyx: { bg: "bg-[#111111]", text: "text-white", accent: "text-[#06b6d4]", header: "bg-black", headerText: "text-white" },
    lavender: { bg: "bg-[#f5f3ff]", text: "text-[#4c1d95]", accent: "text-[#8b5cf6]", header: "bg-[#8b5cf6]", headerText: "text-white" },
    midnight: { bg: "bg-[#f8fafc]", text: "text-[#020617]", accent: "text-[#38bdf8]", header: "bg-[#020617]", headerText: "text-white" },
    champagne: { bg: "bg-[#fafaf9]", text: "text-[#44403c]", accent: "text-[#d97706]", header: "bg-[#d97706]", headerText: "text-white" },
    forest: { bg: "bg-[#f0fdf4]", text: "text-[#022c22]", accent: "text-[#10b981]", header: "bg-[#064e3b]", headerText: "text-white" },
    sunset: { bg: "bg-[#fff7ed]", text: "text-[#451a03]", accent: "text-[#f97316]", header: "bg-[#f97316]", headerText: "text-white" },
    marble: { bg: "bg-[#f9fafb]", text: "text-[#111827]", accent: "text-[#6b7280]", header: "bg-[#111827]", headerText: "text-white" },
    platinum: { bg: "bg-[#f3f4f6]", text: "text-[#1f2937]", accent: "text-[#9ca3af]", header: "bg-[#1f2937]", headerText: "text-white" }
  };

  const style = themeStyles[theme] || themeStyles.modern;

  return (
    <div className={`w-full max-w-sm ${style.bg} rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col border border-black/5`}>
      {/* Header */}
      <div className={`${style.header} p-8 ${style.headerText} relative overflow-hidden`}>
        <div className="relative z-10 flex justify-between items-start">
          <div className="space-y-1">
            <p className={`text-[10px] font-bold uppercase tracking-[0.4em] ${style.accent}`}>
              {isPlusOne ? 'Plus One Pass' : 'Entry Pass'}
            </p>
            <h2 className="text-2xl font-serif italic">{event.event_name}</h2>
          </div>
          <Ticket className={style.accent} size={24} />
        </div>
      </div>

      {/* Perforation */}
      <div className={`relative h-10 ${style.bg} flex items-center`}>
        <div className={`absolute left-0 -translate-x-1/2 w-10 h-10 ${style.header} rounded-full`} />
        <div className={`absolute right-0 translate-x-1/2 w-10 h-10 ${style.header} rounded-full`} />
        <div className="w-full border-t-2 border-dashed border-gray-200 mx-10 opacity-50" />
      </div>

      {/* Body */}
      <div className={`p-8 pt-2 ${style.bg} ${style.text} flex flex-col items-center`}>
        <div className="text-center mb-8">
          <div className={`flex items-center justify-center gap-2 ${style.accent} mb-2`}>
            <User size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Guest</span>
          </div>
          <p className="text-2xl font-medium tracking-tight">{displayName}</p>
          {rsvp.table_number && (
            <div className="mt-2 inline-block px-4 py-1 bg-black/5 rounded-full">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Table {rsvp.table_number}</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-white rounded-[2rem] shadow-inner border border-gray-100 mb-8">
          <QRCodeSVG value={qrValue} size={160} level="H" />
        </div>

        <div className="grid grid-cols-2 gap-8 w-full border-t border-gray-100 pt-8 mb-4">
          <div className="space-y-1">
            <p className="text-[8px] font-bold uppercase tracking-widest opacity-40">Date</p>
            <p className="text-xs font-bold">{format(eventDate, 'MMM dd, yyyy')}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[8px] font-bold uppercase tracking-widest opacity-40">Venue</p>
            <p className="text-xs font-bold truncate">{event.venue}</p>
          </div>
        </div>
      </div>

      <div className="py-4 text-center opacity-20">
        <p className="text-[8px] font-bold uppercase tracking-[0.3em]">Verified by EventHub NG</p>
      </div>
    </div>
  );
};

export default DigitalPass;