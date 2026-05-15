"use client";

import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { User, ShieldCheck, Ticket } from 'lucide-react';
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
  const [qrImage, setQrImage] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      const canvas = document.getElementById(`pass-qr-canvas-${isPlusOne ? 'p1' : 'main'}`) as HTMLCanvasElement;
      if (canvas) {
        setQrImage(canvas.toDataURL("image/png"));
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [qrValue]);
  
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
    <div className={`w-full max-w-sm ${style.bg} rounded-[2.5rem] p-4 relative overflow-hidden shadow-2xl border border-white/5`}>
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img src={event.photo_url} className="w-full h-full object-cover opacity-30 blur-[4px]" alt="" />
        <div className={`absolute inset-0 ${isDark ? 'bg-black/40' : 'bg-white/20'}`} />
      </div>

      {/* Glass Container */}
      <div 
        className="relative z-10 w-full h-full flex flex-col items-center p-8 rounded-[2.2rem] border backdrop-blur-2xl"
        style={{ 
          backgroundColor: style.glass,
          borderColor: style.border
        }}
      >
        {/* Header */}
        <div className="w-full flex justify-between items-start mb-8">
          <div className="space-y-1">
            <p className="text-[8px] font-black uppercase tracking-[0.5em] opacity-70" style={{ color: style.accent }}>Entry Pass</p>
            <h3 className={`text-lg font-serif italic leading-tight ${style.text}`}>{event.event_name}</h3>
          </div>
          <Ticket style={{ color: style.accent }} className="opacity-50" size={20} />
        </div>

        {/* Guest Identity */}
        <div className="w-full space-y-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/5 border flex items-center justify-center" style={{ borderColor: style.border }}>
              <User style={{ color: style.accent }} size={20} />
            </div>
            <div>
              <p className={`text-[7px] font-bold uppercase tracking-[0.4em] opacity-40 ${style.text}`}>Verified Guest</p>
              <p className={`text-xl font-medium tracking-tight ${style.text}`}>{displayName}</p>
            </div>
          </div>

          {rsvp.table_number && (
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
              <span className={`text-[7px] font-black uppercase tracking-[0.4em] opacity-50 ${style.text}`}>Seating</span>
              <span className="text-xs font-bold" style={{ color: style.accent }}>Table {rsvp.table_number}</span>
            </div>
          )}
        </div>

        {/* QR Code */}
        <div className="bg-white p-3 rounded-2xl mb-8 shadow-xl">
          {qrImage ? (
            <img src={qrImage} alt="QR Code" className="w-32 h-32" />
          ) : (
            <QRCodeCanvas 
              id={`pass-qr-canvas-${isPlusOne ? 'p1' : 'main'}`}
              value={qrValue} 
              size={128} 
              level="H" 
              includeMargin={false}
            />
          )}
        </div>

        {/* Footer */}
        <div className="w-full grid grid-cols-2 gap-6 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="space-y-1">
            <p className={`text-[6px] font-bold uppercase tracking-[0.4em] opacity-30 ${style.text}`}>Date</p>
            <p className={`text-[10px] font-bold ${style.text}`}>{format(eventDate, 'MMM dd, yyyy')}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className={`text-[6px] font-bold uppercase tracking-[0.4em] opacity-30 ${style.text}`}>Venue</p>
            <p className={`text-[10px] font-bold truncate ${style.text}`}>{event.venue}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalPass;