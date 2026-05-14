"use client";

import React from 'react';
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
    <div className={`w-full max-w-sm ${style.bg} rounded-[3.5rem] p-1 relative overflow-hidden shadow-2xl border border-white/5`}>
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img src={event.photo_url} className="w-full h-full object-cover opacity-30 blur-[4px]" alt="" />
        <div className={`absolute inset-0 ${isDark ? 'bg-black/40' : 'bg-white/20'}`} />
      </div>

      {/* Glass Container */}
      <div 
        className="relative z-10 w-full h-full flex flex-col items-center p-10 rounded-[3.2rem] border backdrop-blur-2xl"
        style={{ 
          backgroundColor: style.glass,
          borderColor: style.border
        }}
      >
        {/* Header */}
        <div className="w-full flex justify-between items-start mb-12">
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-[0.5em] opacity-70" style={{ color: style.accent }}>Entry Pass</p>
            <h3 className={`text-xl font-serif italic leading-tight ${isDark ? 'text-white' : 'text-black'}`}>{event.event_name}</h3>
          </div>
          <Ticket style={{ color: style.accent }} className="opacity-50" size={24} />
        </div>

        {/* Guest Identity */}
        <div className="w-full space-y-8 mb-12">
          <div className="flex items-center gap-5">
            <div 
              className="w-14 h-14 rounded-full bg-white/5 border flex items-center justify-center shadow-lg"
              style={{ borderColor: style.border }}
            >
              <User style={{ color: style.accent }} size={24} />
            </div>
            <div>
              <p className={`text-[8px] font-bold uppercase tracking-[0.4em] opacity-40 ${isDark ? 'text-white' : 'text-black'}`}>Verified Guest</p>
              <p className={`text-2xl font-medium tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>{displayName}</p>
            </div>
          </div>

          {rsvp.table_number && (
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full">
              <span className={`text-[8px] font-black uppercase tracking-[0.4em] opacity-50 ${isDark ? 'text-white' : 'text-black'}`}>Seating</span>
              <span className="text-sm font-bold" style={{ color: style.accent }}>Table {rsvp.table_number}</span>
            </div>
          )}
        </div>

        {/* QR Code */}
        <div className="relative group mb-10">
          <div className="absolute -inset-8 blur-3xl opacity-30 transition-all group-hover:opacity-50" style={{ backgroundColor: style.accent }} />
          <div className="p-5 bg-white rounded-[3rem] shadow-2xl relative z-10 border-4 border-white/20">
            <QRCodeCanvas 
              value={qrValue} 
              size={160} 
              level="H" 
              includeMargin={false}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="w-full grid grid-cols-2 gap-8 pt-10 border-t relative z-10" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="space-y-1.5">
            <p className={`text-[7px] font-bold uppercase tracking-[0.4em] opacity-30 ${isDark ? 'text-white' : 'text-black'}`}>Event Date</p>
            <p className={`text-[11px] font-bold ${isDark ? 'text-white' : 'text-black'}`}>{format(eventDate, 'MMM dd, yyyy')}</p>
          </div>
          <div className="space-y-1.5 text-right">
            <p className={`text-[7px] font-bold uppercase tracking-[0.4em] opacity-30 ${isDark ? 'text-white' : 'text-black'}`}>Venue</p>
            <p className={`text-[11px] font-bold truncate ${isDark ? 'text-white' : 'text-black'}`}>{event.venue}</p>
          </div>
        </div>

        <div className="mt-10 opacity-20">
          <p className={`text-[7px] font-black uppercase tracking-[0.5em] ${isDark ? 'text-white' : 'text-black'}`}>Verified by EventHub NG</p>
        </div>
      </div>
    </div>
  );
};

export default DigitalPass;