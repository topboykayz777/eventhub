"use client";

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, User, Ticket } from 'lucide-react';
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
  
  // Theme mapping for the pass
  const themeStyles: Record<string, any> = {
    modern: { headerBg: "bg-[#0f0f0f]", bodyBg: "bg-white", text: "text-black", accent: "text-[#D4AF37]", headerText: "text-white" },
    traditional: { headerBg: "bg-[#064e3b]", bodyBg: "bg-[#fdfcf0]", text: "text-[#064e3b]", accent: "text-[#D4AF37]", headerText: "text-[#fdfcf0]" },
    elegant: { headerBg: "bg-black", bodyBg: "bg-white", text: "text-black", accent: "text-gray-500", headerText: "text-white" },
    sahara: { headerBg: "bg-[#451a03]", bodyBg: "bg-[#fef3c7]", text: "text-[#451a03]", accent: "text-[#fbbf24]", headerText: "text-[#fef3c7]" },
    velvet: { headerBg: "bg-[#2e1065]", bodyBg: "bg-[#f5f3ff]", text: "text-[#2e1065]", accent: "text-[#D4AF37]", headerText: "text-[#f5f3ff]" },
    garden: { headerBg: "bg-[#064e3b]", bodyBg: "bg-[#ecfdf5]", text: "text-[#064e3b]", accent: "text-[#10b981]", headerText: "text-[#ecfdf5]" },
    oceanic: { headerBg: "bg-[#1e3a8a]", bodyBg: "bg-[#eff6ff]", text: "text-[#1e3a8a]", accent: "text-[#93c5fd]", headerText: "text-[#eff6ff]" },
    rose: { headerBg: "bg-[#831843]", bodyBg: "bg-[#fdf2f8]", text: "text-[#831843]", accent: "text-[#fbcfe8]", headerText: "text-[#fdf2f8]" },
    earth: { headerBg: "bg-[#431407]", bodyBg: "bg-[#fff7ed]", text: "text-[#431407]", accent: "text-[#fb923c]", headerText: "text-[#fff7ed]" },
    silver: { headerBg: "bg-[#1f2937]", bodyBg: "bg-[#f9fafb]", text: "text-[#1f2937]", accent: "text-[#9ca3af]", headerText: "text-[#f9fafb]" },
    dynasty: { headerBg: "bg-[#7f1d1d]", bodyBg: "bg-[#fef2f2]", text: "text-[#7f1d1d]", accent: "text-[#D4AF37]", headerText: "text-[#fef2f2]" },
    vintage: { headerBg: "bg-[#92400e]", bodyBg: "bg-[#fef3c7]", text: "text-[#451a03]", accent: "text-[#92400e]", headerText: "text-[#fef3c7]" },
    onyx: { headerBg: "bg-black", bodyBg: "bg-[#111111]", text: "text-white", accent: "text-[#06b6d4]", headerText: "text-white" },
    lavender: { headerBg: "bg-[#8b5cf6]", bodyBg: "bg-[#f5f3ff]", text: "text-[#4c1d95]", accent: "text-[#8b5cf6]", headerText: "text-white" },
    midnight: { headerBg: "bg-[#020617]", bodyBg: "bg-[#f8fafc]", text: "text-[#020617]", accent: "text-[#38bdf8]", headerText: "text-white" },
    champagne: { headerBg: "bg-[#d97706]", bodyBg: "bg-[#fafaf9]", text: "text-[#44403c]", accent: "text-[#d97706]", headerText: "text-white" },
    forest: { headerBg: "bg-[#064e3b]", bodyBg: "bg-[#f0fdf4]", text: "text-[#022c22]", accent: "text-[#10b981]", headerText: "text-white" },
    sunset: { headerBg: "bg-[#f97316]", bodyBg: "bg-[#fff7ed]", text: "text-[#451a03]", accent: "text-[#f97316]", headerText: "text-white" },
    marble: { headerBg: "bg-[#111827]", bodyBg: "bg-[#f9fafb]", text: "text-[#111827]", accent: "text-[#6b7280]", headerText: "text-white" },
    platinum: { headerBg: "bg-[#1f2937]", bodyBg: "bg-[#f3f4f6]", text: "text-[#1f2937]", accent: "text-[#9ca3af]", headerText: "text-white" }
  };

  const style = themeStyles[theme] || themeStyles.modern;

  return (
    <div className={`w-full max-w-sm ${style.bodyBg} rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col border border-black/5`}>
      {/* Top Section */}
      <div className={`${style.headerBg} p-8 ${style.headerText} relative overflow-hidden`}>
        <div className={`absolute -top-24 -right-24 w-48 h-48 ${style.accent.replace('text-', 'bg-')} opacity-10 rounded-full blur-3xl`} />
        
        <div className="relative z-10 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className={`text-[10px] font-bold uppercase tracking-widest ${style.accent}`}>
                {isPlusOne ? 'Plus One Entry Pass' : 'Official Entry Pass'}
              </p>
              <h2 className="text-2xl font-serif italic">{event.event_name}</h2>
            </div>
            <Ticket className={style.accent} size={24} />
          </div>

          <div className="grid grid-cols-2 gap-4 text-[10px] font-bold uppercase tracking-wider opacity-80">
            <div className="space-y-1">
              <p className="opacity-50">Date</p>
              <p>{format(eventDate, 'MMM dd, yyyy')}</p>
            </div>
            <div className="space-y-1">
              <p className="opacity-50">Time</p>
              <p>{format(eventDate, 'h:mm a')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Perforated Line */}
      <div className={`relative h-8 ${style.bodyBg} flex items-center`}>
        <div className={`absolute left-0 -translate-x-1/2 w-8 h-8 ${style.headerBg} rounded-full`} />
        <div className={`absolute right-0 translate-x-1/2 w-8 h-8 ${style.headerBg} rounded-full`} />
        <div className="w-full border-t-2 border-dashed border-gray-200 mx-8 opacity-50" />
      </div>

      {/* Bottom Section */}
      <div className={`p-8 pt-4 ${style.bodyBg} ${style.text} flex flex-col items-center space-y-8`}>
        <div className="text-center space-y-1">
          <div className={`flex items-center justify-center gap-2 ${style.accent} mb-1`}>
            <User size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Guest Name</span>
          </div>
          <p className="text-xl font-medium">{displayName}</p>
          {rsvp.table_number && (
            <p className="text-sm opacity-60">Table {rsvp.table_number}</p>
          )}
        </div>

        <div className="p-4 bg-white rounded-3xl border border-gray-100 shadow-inner">
          <QRCodeSVG 
            value={qrValue}
            size={160}
            level="H"
            includeMargin={false}
            className="rounded-lg"
          />
        </div>

        <div className="text-center space-y-2 opacity-60">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em]">Scan at the entrance</p>
          <div className="flex items-center justify-center gap-2">
            <MapPin size={12} />
            <span className="text-[10px]">{event.venue}</span>
          </div>
        </div>
      </div>

      <div className="py-4 text-center border-t border-gray-100 opacity-30">
        <p className="text-[8px] font-bold uppercase tracking-widest">Powered by EventHub NG</p>
      </div>
    </div>
  );
};

export default DigitalPass;