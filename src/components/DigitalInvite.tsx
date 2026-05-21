"use client";

import React, { forwardRef, useEffect, useState } from 'react';
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
  const [qrImage, setQrImage] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      const canvas = document.getElementById('invite-qr-canvas') as HTMLCanvasElement;
      if (canvas) {
        setQrImage(canvas.toDataURL("image/png"));
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [eventUrl]);

  const themeStyles: Record<string, any> = {
    modern: { bg: "bg-[#050505]", accent: "#D4AF37", glass: "rgba(255, 255, 255, 0.03)", border: "rgba(212, 175, 55, 0.2)", text: "text-white" },
    traditional: { bg: "bg-[#064e3b]", accent: "#D4AF37", glass: "rgba(0, 0, 0, 0.2)", border: "rgba(212, 175, 55, 0.3)", text: "text-[#fdfcf0]" },
    elegant: { bg: "bg-[#f8f8f8]", accent: "#000000", glass: "rgba(255, 255, 255, 0.7)", border: "rgba(0, 0, 0, 0.1)", text: "text-gray-900" },
    sahara: { bg: "bg-[#451a03]", accent: "#fbbf24", glass: "rgba(0, 0, 0, 0.2)", border: "rgba(251, 191, 36, 0.2)", text: "text-[#fef3c7]" },
    velvet: { bg: "bg-[#2e1065]", accent: "#D4AF37", glass: "rgba(0, 0, 0, 0.2)", border: "rgba(212, 175, 55, 0.2)", text: "text-[#f5f3ff]" },
    garden: { bg: "bg-[#064e3b]", accent: "#10b981", glass: "rgba(0, 0, 0, 0.2)", border: "rgba(16, 185, 129, 0.2)", text: "text-[#ecfdf5]" },
    oceanic: { bg: "bg-[#1e3a8a]", accent: "#93c5fd", glass: "rgba(0, 0, 0, 0.2)", border: "rgba(147, 197, 253, 0.2)", text: "text-[#eff6ff]" },
    rose: { bg: "bg-[#831843]", accent: "#fbcfe8", glass: "rgba(0, 0, 0, 0.2)", border: "rgba(251, 207, 232, 0.2)", text: "text-[#fdf2f8]" },
    earth: { bg: "bg-[#431407]", accent: "#fb923c", glass: "rgba(0, 0, 0, 0.2)", border: "rgba(251, 146, 60, 0.2)", text: "text-[#fff7ed]" },
    silver: { bg: "bg-[#1f2937]", accent: "#9ca3af", glass: "rgba(0, 0, 0, 0.2)", border: "rgba(156, 163, 175, 0.2)", text: "text-[#f9fafb]" },
    dynasty: { bg: "bg-[#7f1d1d]", accent: "#D4AF37", glass: "rgba(0, 0, 0, 0.2)", border: "rgba(212, 175, 55, 0.2)", text: "text-[#fef2f2]" },
    vintage: { bg: "bg-[#fef3c7]", accent: "#92400e", glass: "rgba(255, 255, 255, 0.4)", border: "rgba(146, 64, 14, 0.2)", text: "text-[#451a03]" },
    onyx: { bg: "bg-black", accent: "#06b6d4", glass: "rgba(255, 255, 255, 0.05)", border: "rgba(6, 182, 212, 0.2)", text: "text-white" },
    lavender: { bg: "bg-[#f5f3ff]", accent: "#8b5cf6", glass: "rgba(255, 255, 255, 0.7)", border: "rgba(139, 92, 246, 0.2)", text: "text-[#4c1d95]" },
    midnight: { bg: "bg-[#020617]", accent: "#38bdf8", glass: "rgba(255, 255, 255, 0.05)", border: "rgba(56, 189, 248, 0.2)", text: "text-[#f8fafc]" },
    champagne: { bg: "bg-[#fafaf9]", accent: "#d97706", glass: "rgba(255, 255, 255, 0.7)", border: "rgba(217, 119, 6, 0.2)", text: "text-[#44403c]" },
    forest: { bg: "bg-[#022c22]", accent: "#10b981", glass: "rgba(255, 255, 255, 0.05)", border: "rgba(16, 185, 129, 0.2)", text: "text-[#f0fdf4]" },
    sunset: { bg: "bg-[#451a03]", accent: "#f97316", glass: "rgba(255, 255, 255, 0.05)", border: "rgba(249, 115, 22, 0.2)", text: "text-[#fff7ed]" },
    marble: { bg: "bg-[#f9fafb]", accent: "#111827", glass: "rgba(255, 255, 255, 0.8)", border: "rgba(229, 231, 235, 1)", text: "text-[#111827]" },
    platinum: { bg: "bg-[#f3f4f6]", accent: "#1f2937", glass: "rgba(255, 255, 255, 0.8)", border: "rgba(209, 213, 219, 1)", text: "text-[#1f2937]" }
  };

  const style = themeStyles[theme] || themeStyles.modern;
  const isDark = !['elegant', 'vintage', 'lavender', 'champagne', 'marble', 'platinum'].includes(theme);

  return (
    <div 
      ref={ref}
      className={`w-[380px] ${style.bg} relative overflow-hidden shadow-2xl flex flex-col items-center p-5`}
      style={{ height: '580px' }}
    >
      {/* Background Image with Blur */}
      <div className="absolute inset-0 z-0">
        <img src={event.photo_url} className="w-full h-full object-cover opacity-40 blur-[3px]" alt="" />
        <div className={`absolute inset-0 ${isDark ? 'bg-black/60' : 'bg-white/40'}`} />
      </div>

      {/* Glass Card Container */}
      <div 
        className="relative z-10 w-full h-full flex flex-col items-center text-center p-8 rounded-[2.5rem] border backdrop-blur-3xl"
        style={{ 
          backgroundColor: style.glass,
          borderColor: style.border
        }}
      >
        {/* Header */}
        <div className="mb-6">
          <div className="w-12 h-12 border-2 rotate-45 flex items-center justify-center mx-auto mb-4" style={{ borderColor: style.accent }}>
            <span className="font-serif italic text-lg -rotate-45" style={{ color: style.accent }}>E</span>
          </div>
          <p className="text-[8px] font-black uppercase tracking-[0.5em] opacity-60" style={{ color: style.accent }}>Official Invitation</p>
        </div>

        {/* Event Title */}
        <h1 className={`text-3xl font-serif italic mb-8 leading-tight px-2 ${style.text}`}>
          {event.event_name}
        </h1>

        {/* Details Grid */}
        <div className="grid grid-cols-1 gap-5 mb-8 w-full">
          <div className="flex items-center justify-center gap-3">
            <Calendar size={14} style={{ color: style.accent }} />
            <span className={`text-[10px] font-bold tracking-widest uppercase ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {format(eventDate, 'MMMM do, yyyy')}
            </span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Clock size={14} style={{ color: style.accent }} />
            <span className={`text-[10px] font-bold tracking-widest uppercase ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {format(eventDate, 'h:mm a')}
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 px-4">
            <MapPin size={14} style={{ color: style.accent }} className="shrink-0" />
            <span className={`text-[10px] font-bold tracking-widest uppercase line-clamp-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {event.venue}
            </span>
          </div>
        </div>

        {/* QR Section */}
        <div className="mt-auto pt-6 border-t w-full flex flex-col items-center" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="bg-white p-3 rounded-2xl mb-4 shadow-xl">
            {qrImage ? (
              <img src={qrImage} alt="QR Code" className="w-28 h-28" />
            ) : (
              <QRCodeCanvas 
                id="invite-qr-canvas"
                value={eventUrl}
                size={112}
                level="H"
                includeMargin={false}
              />
            )}
          </div>
          <p className={`text-[7px] font-black uppercase tracking-[0.3em] opacity-50 ${style.text}`}>
            Scan to RSVP & Access Details
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center gap-2 opacity-30">
          <ShieldCheck size={10} style={{ color: style.accent }} />
          <span className={`text-[6px] font-black uppercase tracking-[0.4em] ${style.text}`}>
            Verified by EventHub NG
          </span>
        </div>
      </div>
    </div>
  );
});

DigitalInvite.displayName = 'DigitalInvite';

export default DigitalInvite;