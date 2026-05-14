"use client";

import React, { forwardRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Calendar, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';

interface DigitalInviteProps {
  event: any;
}

const DigitalInvite = forwardRef<HTMLDivElement, DigitalInviteProps>(({ event }, ref) => {
  const eventUrl = `${window.location.origin}/event/${event.slug}`;
  const eventDate = new Date(event.event_date);
  const theme = event.theme || 'modern';

  const themeStyles: Record<string, any> = {
    modern: { bg: "bg-[#0a0a0a]", text: "text-white", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/30", qrBg: "bg-white" },
    traditional: { bg: "bg-[#064e3b]", text: "text-[#fdfcf0]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/40", qrBg: "bg-white" },
    elegant: { bg: "bg-white", text: "text-gray-900", accent: "text-black", border: "border-black/20", qrBg: "bg-gray-50" },
    sahara: { bg: "bg-[#451a03]", text: "text-[#fef3c7]", accent: "text-[#fbbf24]", border: "border-[#fbbf24]/30", qrBg: "bg-white" },
    velvet: { bg: "bg-[#2e1065]", text: "text-[#f5f3ff]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/30", qrBg: "bg-white" },
    garden: { bg: "bg-[#064e3b]", text: "text-[#ecfdf5]", accent: "text-[#10b981]", border: "border-[#10b981]/30", qrBg: "bg-white" },
    oceanic: { bg: "bg-[#1e3a8a]", text: "text-[#eff6ff]", accent: "text-[#93c5fd]", border: "border-[#93c5fd]/30", qrBg: "bg-white" },
    rose: { bg: "bg-[#831843]", text: "text-[#fdf2f8]", accent: "text-[#fbcfe8]", border: "border-[#fbcfe8]/30", qrBg: "bg-white" },
    earth: { bg: "bg-[#431407]", text: "text-[#fff7ed]", accent: "text-[#fb923c]", border: "border-[#fb923c]/30", qrBg: "bg-white" },
    silver: { bg: "bg-[#1f2937]", text: "text-[#f9fafb]", accent: "text-[#9ca3af]", border: "border-[#9ca3af]/30", qrBg: "bg-white" },
    dynasty: { bg: "bg-[#7f1d1d]", text: "text-[#fef2f2]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/30", qrBg: "bg-white" },
    vintage: { bg: "bg-[#fef3c7]", text: "text-[#451a03]", accent: "text-[#92400e]", border: "border-[#92400e]/30", qrBg: "bg-white" },
    onyx: { bg: "bg-black", text: "text-white", accent: "text-[#06b6d4]", border: "border-[#06b6d4]/30", qrBg: "bg-white" },
    lavender: { bg: "bg-[#f5f3ff]", text: "text-[#4c1d95]", accent: "text-[#8b5cf6]", border: "border-[#8b5cf6]/30", qrBg: "bg-white" },
    midnight: { bg: "bg-[#020617]", text: "text-white", accent: "text-[#38bdf8]", border: "border-[#38bdf8]/30", qrBg: "bg-white" },
    champagne: { bg: "bg-[#fafaf9]", text: "text-[#44403c]", accent: "text-[#d97706]", border: "border-[#d97706]/30", qrBg: "bg-white" },
    forest: { bg: "bg-[#022c22]", text: "text-white", accent: "text-[#10b981]", border: "border-[#10b981]/30", qrBg: "bg-white" },
    sunset: { bg: "bg-[#451a03]", text: "text-white", accent: "text-[#f97316]", border: "border-[#f97316]/30", qrBg: "bg-white" },
    marble: { bg: "bg-[#f9fafb]", text: "text-[#111827]", accent: "text-[#6b7280]", border: "border-[#e5e7eb]", qrBg: "bg-white" },
    platinum: { bg: "bg-[#f3f4f6]", text: "text-[#1f2937]", accent: "text-[#9ca3af]", border: "border-[#d1d5db]", qrBg: "bg-white" }
  };

  const style = themeStyles[theme] || themeStyles.modern;

  return (
    <div 
      ref={ref}
      className={`w-[400px] ${style.bg} ${style.text} border-8 ${style.border} p-12 relative overflow-hidden shadow-2xl flex flex-col items-center text-center`}
      style={{ minHeight: '650px' }}
    >
      {/* Decorative Corner Accents */}
      <div className={`absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 ${style.border} -translate-x-2 -translate-y-2 opacity-60`} />
      <div className={`absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 ${style.border} translate-x-2 -translate-y-2 opacity-60`} />
      <div className={`absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 ${style.border} -translate-x-2 translate-y-2 opacity-60`} />
      <div className={`absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 ${style.border} translate-x-2 translate-y-2 opacity-60`} />
      
      <div className="relative z-10 flex flex-col items-center w-full h-full">
        {/* Header Logo */}
        <div className="mb-10">
          <div className={`w-16 h-16 border-2 ${style.border} rotate-45 flex items-center justify-center mx-auto mb-6`}>
            <span className={`${style.accent} font-serif italic text-2xl -rotate-45`}>E</span>
          </div>
          <p className={`${style.accent} text-[10px] font-black uppercase tracking-[0.6em] mb-2`}>Official Invitation</p>
          <div className={`h-[1px] w-16 ${style.accent} opacity-30 mx-auto`} />
        </div>

        {/* Event Title */}
        <h1 className="text-4xl font-serif italic mb-12 leading-tight px-4">
          {event.event_name}
        </h1>

        {/* Logistics Grid */}
        <div className="space-y-8 mb-12 w-full px-6">
          <div className="flex flex-col items-center gap-2">
            <Calendar size={20} className={`${style.accent} opacity-70`} />
            <span className="text-sm font-light tracking-[0.2em] uppercase">
              {format(eventDate, 'EEEE, MMMM do, yyyy')}
            </span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <Clock size={20} className={`${style.accent} opacity-70`} />
            <span className="text-sm font-light tracking-[0.2em] uppercase">
              {format(eventDate, 'h:mm a')}
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <MapPin size={20} className={`${style.accent} opacity-70`} />
            <span className="text-sm font-light tracking-[0.15em] uppercase leading-relaxed max-w-[280px]">
              {event.venue}
            </span>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="mt-auto pt-10 border-t border-white/10 w-full flex flex-col items-center">
          <div className={`${style.qrBg} p-5 rounded-[2.5rem] mb-6 shadow-2xl border ${style.border} group`}>
            <QRCodeCanvas 
              value={eventUrl}
              size={150}
              level="H"
              includeMargin={false}
              imageSettings={{
                src: "/favicon.svg",
                x: undefined,
                y: undefined,
                height: 28,
                width: 28,
                excavate: true,
              }}
            />
          </div>
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-50 max-w-[200px] leading-loose">
            Scan to RSVP & Access <br /> Exclusive Event Details
          </p>
        </div>

        {/* Security Badge */}
        <div className="mt-8 flex items-center gap-2 opacity-20">
          <ShieldCheck size={12} />
          <span className="text-[7px] font-black uppercase tracking-[0.4em]">Verified by EventHub NG</span>
        </div>
      </div>

      {/* Subtle Background Texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
    </div>
  );
});

DigitalInvite.displayName = 'DigitalInvite';

export default DigitalInvite;