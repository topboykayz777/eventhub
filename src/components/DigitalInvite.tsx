"use client";

import React, { forwardRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Calendar, MapPin, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

interface DigitalInviteProps {
  event: any;
}

const DigitalInvite = forwardRef<HTMLDivElement, DigitalInviteProps>(({ event }, ref) => {
  const eventUrl = `${window.location.origin}/event/${event.slug}`;
  const eventDate = new Date(event.event_date);
  const theme = event.theme || 'modern';

  const themeStyles: Record<string, any> = {
    modern: { bg: "bg-[#0a0a0a]", accent: "#D4AF37", border: "rgba(212, 175, 55, 0.3)", glass: "rgba(255, 255, 255, 0.03)" },
    traditional: { bg: "bg-[#064e3b]", accent: "#D4AF37", border: "rgba(212, 175, 55, 0.4)", glass: "rgba(0, 0, 0, 0.2)" },
    elegant: { bg: "bg-[#f8f8f8]", accent: "#000000", border: "rgba(0, 0, 0, 0.1)", glass: "rgba(255, 255, 255, 0.8)" },
    sahara: { bg: "bg-[#451a03]", accent: "#fbbf24", border: "rgba(251, 191, 36, 0.3)", glass: "rgba(0, 0, 0, 0.2)" },
    velvet: { bg: "bg-[#2e1065]", accent: "#D4AF37", border: "rgba(212, 175, 55, 0.3)", glass: "rgba(0, 0, 0, 0.2)" },
    garden: { bg: "bg-[#064e3b]", accent: "#10b981", border: "rgba(16, 185, 129, 0.3)", glass: "rgba(0, 0, 0, 0.2)" },
    oceanic: { bg: "bg-[#1e3a8a]", accent: "#93c5fd", border: "rgba(147, 197, 253, 0.3)", glass: "rgba(0, 0, 0, 0.2)" },
    rose: { bg: "bg-[#831843]", accent: "#fbcfe8", border: "rgba(251, 207, 232, 0.3)", glass: "rgba(0, 0, 0, 0.2)" },
    earth: { bg: "bg-[#431407]", accent: "#fb923c", border: "rgba(251, 146, 60, 0.3)", glass: "rgba(0, 0, 0, 0.2)" },
    silver: { bg: "bg-[#1f2937]", accent: "#9ca3af", border: "rgba(156, 163, 175, 0.3)", glass: "rgba(0, 0, 0, 0.2)" },
    dynasty: { bg: "bg-[#7f1d1d]", accent: "#D4AF37", border: "rgba(212, 175, 55, 0.3)", glass: "rgba(0, 0, 0, 0.2)" },
    vintage: { bg: "bg-[#fef3c7]", accent: "#92400e", border: "rgba(146, 64, 14, 0.3)", glass: "rgba(255, 255, 255, 0.4)" },
    onyx: { bg: "bg-[#050505]", accent: "#06b6d4", border: "rgba(6, 182, 212, 0.3)", glass: "rgba(255, 255, 255, 0.05)" },
    lavender: { bg: "bg-[#f5f3ff]", accent: "#8b5cf6", border: "rgba(139, 92, 246, 0.3)", glass: "rgba(255, 255, 255, 0.8)" },
    midnight: { bg: "bg-[#020617]", accent: "#38bdf8", border: "rgba(56, 189, 248, 0.3)", glass: "rgba(255, 255, 255, 0.05)" },
    champagne: { bg: "bg-[#fafaf9]", accent: "#d97706", border: "rgba(217, 119, 6, 0.3)", glass: "rgba(255, 255, 255, 0.8)" },
    forest: { bg: "bg-[#022c22]", accent: "#10b981", border: "rgba(16, 185, 129, 0.3)", glass: "rgba(255, 255, 255, 0.05)" },
    sunset: { bg: "bg-[#451a03]", accent: "#f97316", border: "rgba(249, 115, 22, 0.3)", glass: "rgba(255, 255, 255, 0.05)" },
    marble: { bg: "bg-[#f9fafb]", accent: "#111827", border: "rgba(229, 231, 235, 1)", glass: "rgba(255, 255, 255, 0.8)" },
    platinum: { bg: "bg-[#f3f4f6]", accent: "#1f2937", border: "rgba(209, 213, 219, 1)", glass: "rgba(255, 255, 255, 0.8)" }
  };

  const style = themeStyles[theme] || themeStyles.modern;
  const isDark = !['elegant', 'vintage', 'lavender', 'champagne', 'marble', 'platinum'].includes(theme);

  return (
    <div 
      ref={ref}
      className={`w-[420px] ${style.bg} relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col items-center p-1`}
      style={{ minHeight: '700px' }}
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img src={event.photo_url} className="w-full h-full object-cover opacity-40 blur-[2px]" alt="" />
        <div className={`absolute inset-0 ${isDark ? 'bg-black/60' : 'bg-white/40'}`} />
      </div>

      {/* Glass Container */}
      <div 
        className="relative z-10 w-full h-full flex-1 flex flex-col items-center text-center p-10 m-4 rounded-[3rem] border backdrop-blur-3xl"
        style={{ 
          backgroundColor: style.glass,
          borderColor: style.border
        }}
      >
        {/* Header */}
        <div className="mb-10">
          <div 
            className="w-14 h-14 border-2 rotate-45 flex items-center justify-center mx-auto mb-6 shadow-xl"
            style={{ borderColor: style.accent }}
          >
            <span className="font-serif italic text-xl -rotate-45" style={{ color: style.accent }}>E</span>
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.6em] mb-2 opacity-70" style={{ color: style.accent }}>
            Official Invitation
          </p>
          <div className="h-[1px] w-12 mx-auto opacity-30" style={{ backgroundColor: style.accent }} />
        </div>

        {/* Event Title */}
        <h1 className={`text-4xl font-serif italic mb-12 leading-tight px-2 ${isDark ? 'text-white' : 'text-black'}`}>
          {event.event_name}
        </h1>

        {/* Details */}
        <div className="space-y-8 mb-12 w-full px-4">
          <div className="flex flex-col items-center gap-2">
            <Calendar size={18} style={{ color: style.accent }} className="opacity-80" />
            <span className={`text-xs font-bold tracking-[0.2em] uppercase ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {format(eventDate, 'EEEE, MMMM do, yyyy')}
            </span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <Clock size={18} style={{ color: style.accent }} className="opacity-80" />
            <span className={`text-xs font-bold tracking-[0.2em] uppercase ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {format(eventDate, 'h:mm a')}
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <MapPin size={18} style={{ color: style.accent }} className="opacity-80" />
            <span className={`text-xs font-bold tracking-[0.15em] uppercase leading-relaxed max-w-[260px] ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {event.venue}
            </span>
          </div>
        </div>

        {/* QR Section */}
        <div className="mt-auto pt-10 border-t w-full flex flex-col items-center" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="bg-white p-4 rounded-[2.5rem] mb-6 shadow-2xl border-4 border-white/20">
            <QRCodeCanvas 
              value={eventUrl}
              size={140}
              level="H"
              includeMargin={false}
              imageSettings={{
                src: "/favicon.svg",
                height: 28,
                width: 28,
                excavate: true,
              }}
            />
          </div>
          <p className={`text-[8px] font-black uppercase tracking-[0.3em] opacity-50 leading-loose ${isDark ? 'text-white' : 'text-black'}`}>
            Scan to RSVP & Access <br /> Exclusive Event Details
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center gap-2 opacity-30">
          <ShieldCheck size={12} style={{ color: style.accent }} />
          <span className={`text-[7px] font-black uppercase tracking-[0.4em] ${isDark ? 'text-white' : 'text-black'}`}>
            Verified by EventHub NG
          </span>
        </div>
      </div>

      {/* Decorative Sparkles */}
      <div className="absolute top-10 right-10 opacity-20">
        <Sparkles size={40} style={{ color: style.accent }} />
      </div>
    </div>
  );
});

DigitalInvite.displayName = 'DigitalInvite';

export default DigitalInvite;