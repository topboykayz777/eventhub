"use client";

import React from 'react';
import { Calendar, MapPin, Clock, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';

interface DigitalInviteProps {
  event: any;
}

const DigitalInvite = ({ event }: DigitalInviteProps) => {
  const eventDate = new Date(event.event_date);
  const eventUrl = `${window.location.origin}/event/${event.slug}`;
  const theme = event.theme || 'modern';
  
  const themeStyles: Record<string, any> = {
    modern: { bg: "bg-[#050505]", text: "text-white", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/20", qrBg: "bg-white" },
    traditional: { bg: "bg-[#064e3b]", text: "text-[#fdfcf0]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/30", qrBg: "bg-white" },
    elegant: { bg: "bg-[#fafaf9]", text: "text-gray-900", accent: "text-black", border: "border-black/10", qrBg: "bg-white" },
    sahara: { bg: "bg-[#451a03]", text: "text-[#fef3c7]", accent: "text-[#fbbf24]", border: "border-[#fbbf24]/20", qrBg: "bg-white" },
    velvet: { bg: "bg-[#2e1065]", text: "text-[#f5f3ff]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/20", qrBg: "bg-white" },
    garden: { bg: "bg-[#064e3b]", text: "text-[#ecfdf5]", accent: "text-[#10b981]", border: "border-[#10b981]/20", qrBg: "bg-white" },
    oceanic: { bg: "bg-[#1e3a8a]", text: "text-[#eff6ff]", accent: "text-[#93c5fd]", border: "border-[#93c5fd]/20", qrBg: "bg-white" },
    rose: { bg: "bg-[#831843]", text: "text-[#fdf2f8]", accent: "text-[#fbcfe8]", border: "border-[#fbcfe8]/20", qrBg: "bg-white" },
    earth: { bg: "bg-[#431407]", text: "text-[#fff7ed]", accent: "text-[#fb923c]", border: "border-[#fb923c]/20", qrBg: "bg-white" },
    silver: { bg: "bg-[#1f2937]", text: "text-[#f9fafb]", accent: "text-[#9ca3af]", border: "border-[#9ca3af]/20", qrBg: "bg-white" },
    dynasty: { bg: "bg-[#7f1d1d]", text: "text-[#fef2f2]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/20", qrBg: "bg-white" },
    vintage: { bg: "bg-[#fef3c7]", text: "text-[#451a03]", accent: "text-[#92400e]", border: "border-[#92400e]/20", qrBg: "bg-white" },
    onyx: { bg: "bg-[#050505]", text: "text-white", accent: "text-[#06b6d4]", border: "border-[#06b6d4]/20", qrBg: "bg-white" },
    lavender: { bg: "bg-[#f5f3ff]", text: "text-[#4c1d95]", accent: "text-[#8b5cf6]", border: "border-[#8b5cf6]/20", qrBg: "bg-white" },
    midnight: { bg: "bg-[#020617]", text: "text-[#f8fafc]", accent: "text-[#38bdf8]", border: "border-[#38bdf8]/20", qrBg: "bg-white" },
    champagne: { bg: "bg-[#fafaf9]", text: "text-[#44403c]", accent: "text-[#d97706]", border: "border-[#d97706]/20", qrBg: "bg-white" },
    forest: { bg: "bg-[#022c22]", text: "text-[#f0fdf4]", accent: "text-[#10b981]", border: "border-[#10b981]/20", qrBg: "bg-white" },
    sunset: { bg: "bg-[#451a03]", text: "text-[#fff7ed]", accent: "text-[#f97316]", border: "border-[#f97316]/20", qrBg: "bg-white" },
    marble: { bg: "bg-[#f9fafb]", text: "text-[#111827]", accent: "text-[#6b7280]", border: "border-[#e5e7eb]", qrBg: "bg-white" },
    platinum: { bg: "bg-[#f3f4f6]", text: "text-[#1f2937]", accent: "text-[#9ca3af]", border: "border-[#d1d5db]", qrBg: "bg-white" }
  };

  const style = themeStyles[theme] || themeStyles.modern;

  return (
    <div className={`w-full max-w-sm ${style.bg} border-2 ${style.border} rounded-[3rem] overflow-hidden shadow-2xl flex flex-col relative p-10`}>
      {/* Decorative Corner */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${style.accent.replace('text-', 'bg-')} opacity-5 rounded-bl-[5rem]`} />
      
      <div className={`relative z-10 flex flex-col items-center text-center ${style.text}`}>
        <div className="mb-8">
          <Sparkles className={`${style.accent} w-8 h-8 mb-4 mx-auto opacity-50`} />
          <p className={`text-[10px] font-bold uppercase tracking-[0.5em] ${style.accent} mb-2`}>Invitation</p>
          <h2 className="text-4xl font-serif italic leading-tight">{event.event_name}</h2>
        </div>

        <div className={`w-16 h-px ${style.accent.replace('text-', 'bg-')} opacity-20 mb-10`} />

        <div className="space-y-6 mb-12 w-full">
          <div className="flex flex-col items-center gap-1">
            <Calendar size={14} className={`${style.accent} opacity-60`} />
            <span className="text-sm font-light tracking-wide">{format(eventDate, 'EEEE, MMMM do, yyyy')}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Clock size={14} className={`${style.accent} opacity-60`} />
            <span className="text-sm font-light tracking-wide">{format(eventDate, 'h:mm a')}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <MapPin size={14} className={`${style.accent} opacity-60`} />
            <span className="text-sm font-light tracking-wide px-4">{event.venue}</span>
          </div>
        </div>

        <div className="relative group mb-10">
          <div className={`absolute -inset-4 ${style.accent.replace('text-', 'bg-')} opacity-5 rounded-[2rem] blur-xl group-hover:opacity-10 transition-opacity`} />
          <div className={`p-4 ${style.qrBg} rounded-3xl shadow-xl relative z-10`}>
            <QRCodeSVG value={eventUrl} size={120} level="M" />
          </div>
          <p className="text-[8px] font-bold uppercase tracking-[0.3em] opacity-40 mt-4">Scan to RSVP</p>
        </div>

        <div className={`w-full py-4 border-t ${style.border} mt-auto`}>
          <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30">EventHub Nigeria</p>
        </div>
      </div>
    </div>
  );
};

export default DigitalInvite;