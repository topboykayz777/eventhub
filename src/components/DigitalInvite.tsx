"use client";

import React, { forwardRef } from 'react';
import { Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { QRCodeCanvas } from 'qrcode.react';

interface DigitalInviteProps {
  event: any;
}

const DigitalInvite = forwardRef<HTMLDivElement, DigitalInviteProps>(({ event }, ref) => {
  const eventDate = new Date(event.event_date);
  const eventUrl = `${window.location.origin}/event/${event.slug}`;
  const theme = event.theme || 'modern';
  
  const themeStyles: Record<string, any> = {
    modern: { bg: "bg-[#050505]", text: "text-white", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/20", pattern: "opacity-10" },
    traditional: { bg: "bg-[#064e3b]", text: "text-[#fdfcf0]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/30", pattern: "opacity-20" },
    elegant: { bg: "bg-[#fafaf9]", text: "text-gray-900", accent: "text-black", border: "border-black/10", pattern: "opacity-5" },
    sahara: { bg: "bg-[#451a03]", text: "text-[#fef3c7]", accent: "text-[#fbbf24]", border: "border-[#fbbf24]/20", pattern: "opacity-15" },
    velvet: { bg: "bg-[#2e1065]", text: "text-[#f5f3ff]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/20", pattern: "opacity-10" },
    garden: { bg: "bg-[#064e3b]", text: "text-[#ecfdf5]", accent: "text-[#10b981]", border: "border-[#10b981]/20", pattern: "opacity-15" },
    oceanic: { bg: "bg-[#1e3a8a]", text: "text-[#eff6ff]", accent: "text-[#93c5fd]", border: "border-[#93c5fd]/20", pattern: "opacity-10" },
    rose: { bg: "bg-[#831843]", text: "text-[#fdf2f8]", accent: "text-[#fbcfe8]", border: "border-[#fbcfe8]/20", pattern: "opacity-10" },
    earth: { bg: "bg-[#431407]", text: "text-[#fff7ed]", accent: "text-[#fb923c]", border: "border-[#fb923c]/20", pattern: "opacity-15" },
    silver: { bg: "bg-[#1f2937]", text: "text-[#f9fafb]", accent: "text-[#9ca3af]", border: "border-[#9ca3af]/20", pattern: "opacity-10" },
    dynasty: { bg: "bg-[#7f1d1d]", text: "text-[#fef2f2]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/20", pattern: "opacity-10" },
    vintage: { bg: "bg-[#fef3c7]", text: "text-[#451a03]", accent: "text-[#92400e]", border: "border-[#92400e]/20", pattern: "opacity-20" },
    onyx: { bg: "bg-[#050505]", text: "text-white", accent: "text-[#06b6d4]", border: "border-[#06b6d4]/20", pattern: "opacity-10" },
    lavender: { bg: "bg-[#f5f3ff]", text: "text-[#4c1d95]", accent: "text-[#8b5cf6]", border: "border-[#8b5cf6]/20", pattern: "opacity-10" },
    midnight: { bg: "bg-[#020617]", text: "text-[#f8fafc]", accent: "text-[#38bdf8]", border: "border-[#38bdf8]/20", pattern: "opacity-10" },
    champagne: { bg: "bg-[#fafaf9]", text: "text-[#44403c]", accent: "text-[#d97706]", border: "border-[#d97706]/20", pattern: "opacity-10" },
    forest: { bg: "bg-[#022c22]", text: "text-[#f0fdf4]", accent: "text-[#10b981]", border: "border-[#10b981]/20", pattern: "opacity-10" },
    sunset: { bg: "bg-[#451a03]", text: "text-[#fff7ed]", accent: "text-[#f97316]", border: "border-[#f97316]/20", pattern: "opacity-10" },
    marble: { bg: "bg-[#f9fafb]", text: "text-[#111827]", accent: "text-[#6b7280]", border: "border-[#e5e7eb]", pattern: "opacity-5" },
    platinum: { bg: "bg-[#f3f4f6]", text: "text-[#1f2937]", accent: "text-[#9ca3af]", border: "border-[#d1d5db]", pattern: "opacity-5" }
  };

  const style = themeStyles[theme] || themeStyles.modern;

  return (
    <div ref={ref} className={`w-full max-w-sm ${style.bg} ${style.text} rounded-[3.5rem] p-12 shadow-2xl border ${style.border} relative overflow-hidden flex flex-col items-center text-center`}>
      {/* Elegant Background Pattern */}
      <div className={`absolute inset-0 ${style.pattern} pointer-events-none`} style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      
      <div className="relative z-10 w-full space-y-12">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className={`w-12 h-12 rounded-full border ${style.border} flex items-center justify-center`}>
              <Sparkles className={`${style.accent} w-5 h-5`} />
            </div>
          </div>
          <p className={`text-[10px] font-black uppercase tracking-[0.6em] ${style.accent}`}>The Invitation</p>
          <h2 className="text-4xl md:text-5xl font-serif italic leading-tight tracking-tight">
            {event.event_name}
          </h2>
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <p className="text-[8px] font-bold uppercase tracking-[0.4em] opacity-40">Date & Time</p>
            <p className="text-xl font-light">{format(eventDate, 'EEEE, MMMM do')}</p>
            <p className="text-sm font-light opacity-60">{format(eventDate, 'h:mm a')}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-[8px] font-bold uppercase tracking-[0.4em] opacity-40">The Venue</p>
            <p className="text-xl font-light px-4 leading-snug">{event.venue}</p>
          </div>
        </div>

        <div className="pt-6">
          <div className="inline-block p-5 bg-white rounded-[3rem] shadow-2xl border border-gray-100">
            <QRCodeCanvas 
              value={eventUrl} 
              size={140} 
              level="H" 
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
          <p className={`mt-8 text-[8px] font-bold uppercase tracking-[0.5em] ${style.accent} opacity-60`}>Scan to RSVP</p>
        </div>

        <div className="pt-10 border-t border-white/5">
          <p className="text-[9px] font-black uppercase tracking-[0.6em] opacity-20">EventHub Nigeria</p>
        </div>
      </div>
    </div>
  );
});

DigitalInvite.displayName = "DigitalInvite";

export default DigitalInvite;