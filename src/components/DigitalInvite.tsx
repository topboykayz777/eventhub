"use client";

import React from 'react';
import { Calendar, MapPin, Clock, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';

interface DigitalInviteProps {
  event: any;
}

const DigitalInvite = ({ event }: DigitalInviteProps) => {
  const eventDate = new Date(event.event_date);
  const eventUrl = `${window.location.origin}/event/${event.slug}`;

  const theme = event.theme || 'modern';
  
  // Theme mapping for the invitation card
  const themeStyles: Record<string, any> = {
    modern: { bg: "bg-[#1a1a1a]", text: "text-white", accent: "text-[#D4AF37]", border: "border-white/10", qrBg: "bg-white" },
    traditional: { bg: "bg-[#064e3b]", text: "text-[#fdfcf0]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/20", qrBg: "bg-white" },
    elegant: { bg: "bg-white", text: "text-gray-900", accent: "text-black", border: "border-gray-200", qrBg: "bg-gray-50" },
    sahara: { bg: "bg-[#78350f]", text: "text-[#fef3c7]", accent: "text-[#fbbf24]", border: "border-[#fbbf24]/20", qrBg: "bg-white" },
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
    <div className={`w-full max-w-sm ${style.bg} border ${style.border} rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col`}>
      {/* Hero Image */}
      <div className="relative h-56 overflow-hidden">
        {event.photo_url ? (
          <img src={event.photo_url} alt={event.event_name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
            <span className={`text-3xl font-serif italic ${style.accent}`}>Invitation</span>
          </div>
        )}
        <div className={`absolute inset-0 bg-gradient-to-t from-${style.bg.replace('bg-', '')} via-transparent to-transparent`} />
      </div>

      {/* Content */}
      <div className={`p-8 -mt-10 relative z-10 ${style.text}`}>
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <p className={`text-[9px] font-bold uppercase tracking-[0.4em] ${style.accent}`}>You are cordially invited to</p>
            <h2 className="text-3xl font-serif italic leading-tight">{event.event_name}</h2>
          </div>

          <div className={`h-px w-12 mx-auto opacity-30 ${style.accent.replace('text-', 'bg-')}`} />

          <div className="space-y-4 text-sm opacity-80">
            <div className="flex items-center justify-center gap-3">
              <Calendar size={16} className={style.accent} />
              <span>{format(eventDate, 'EEEE, MMMM do, yyyy')}</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Clock size={16} className={style.accent} />
              <span>{format(eventDate, 'h:mm a')}</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <MapPin size={16} className={style.accent} />
              <span className="line-clamp-1">{event.venue}</span>
            </div>
          </div>

          {/* QR Code for Sharing */}
          <div className="pt-4 flex flex-col items-center gap-4">
            <div className={`p-3 ${style.qrBg} rounded-2xl shadow-inner`}>
              <QRCodeSVG value={eventUrl} size={100} level="M" />
            </div>
            <p className="text-[8px] font-bold uppercase tracking-widest opacity-40">Scan to view event page</p>
          </div>

          <div className="pt-4">
            <div className={`inline-block px-8 py-3 border rounded-full text-[9px] font-bold uppercase tracking-widest ${style.accent} ${style.border}`}>
              RSVP Required
            </div>
          </div>
        </div>
      </div>

      <div className={`h-1.5 bg-gradient-to-r from-transparent via-${style.accent.replace('text-', '')} to-transparent opacity-20`} />
    </div>
  );
};

export default DigitalInvite;