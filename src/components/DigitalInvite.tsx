"use client";

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Share2, 
  Crown, 
  Sparkles, 
  Gem, 
  Landmark, 
  Star, 
  Heart, 
  ShieldCheck, 
  Flower2, 
  Waves, 
  Sun, 
  Moon, 
  PenTool, 
  User, 
  Diamond, 
  Wine, 
  Anchor, 
  Cloud, 
  Leaf, 
  Flame, 
  Bird, 
  Shield, 
  Coffee, 
  Wind,
  TreePine,
  Mountain
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import html2canvas from 'html2canvas';
import { QRCodeCanvas } from 'qrcode.react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface DigitalInviteProps {
  event: any;
  rsvpId?: string;
  guestName?: string;
}

const DigitalInvite = ({ event, rsvpId, guestName }: DigitalInviteProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const isPass = !!rsvpId;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { useCORS: true, scale: 3, backgroundColor: '#000000' });
      const link = document.createElement('a');
      link.href = canvas.toDataURL("image/png");
      link.download = `${event.event_name}_${isPass ? 'Pass' : 'Invite'}.png`;
      link.click();
      showSuccess(`HD ${isPass ? 'Pass' : 'Invite'} secured to gallery.`);
    } catch (err) { showError('Failed to generate image.'); }
  };

  const handleShare = async () => {
    const eventUrl = `${window.location.origin}/event/${event.slug?.trim()}`;
    const shareData = { title: event.event_name, text: isPass ? `I'm attending ${event.event_name}! Here is my digital entry pass.` : `You are cordially invited to ${event.event_name}. Please RSVP here:`, url: eventUrl };
    try {
      if (navigator.share) await navigator.share(shareData);
      else window.open(`https://wa.me/?text=${encodeURIComponent(`${shareData.text} ${shareData.url}`)}`, '_blank');
    } catch (err) { console.log('Share cancelled'); }
  };

  const theme = event.theme?.toLowerCase() || 'modern';
  const themeConfigs: Record<string, any> = {
    modern: { bg: "bg-black/80", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/30", icon: Sparkles },
    traditional: { bg: "bg-[#064e3b]/80", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/40", icon: Crown },
    elegant: { bg: "bg-white/90", accent: "text-black", border: "border-black/20", icon: Gem, dark: true },
    sahara: { bg: "bg-[#78350f]/80", accent: "text-[#fbbf24]", border: "border-[#fbbf24]/30", icon: Sun },
    velvet: { bg: "bg-[#2e1065]/80", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/30", icon: Moon },
    garden: { bg: "bg-[#064e3b]/80", accent: "text-[#10b981]", border: "border-[#10b981]/30", icon: Flower2 },
    oceanic: { bg: "bg-[#1e3a8a]/80", accent: "text-[#93c5fd]", border: "border-[#93c5fd]/30", icon: Waves },
    rose: { bg: "bg-[#831843]/80", accent: "text-[#fbcfe8]", border: "border-[#fbcfe8]/30", icon: Heart },
    earth: { bg: "bg-[#431407]/80", accent: "text-[#fb923c]", border: "border-[#fb923c]/30", icon: Landmark },
    silver: { bg: "bg-[#1f2937]/80", accent: "text-[#9ca3af]", border: "border-[#9ca3af]/30", icon: Star },
    dynasty: { bg: "bg-[#7f1d1d]/80", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/30", icon: Crown },
    vintage: { bg: "bg-[#fef3c7]/90", accent: "text-[#92400e]", border: "border-[#92400e]/30", icon: PenTool, dark: true },
    onyx: { bg: "bg-[#1a1a1a]/90", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/30", icon: Diamond },
    champagne: { bg: "bg-[#fdf2f8]/90", accent: "text-[#be185d]", border: "border-[#be185d]/20", icon: Wine, dark: true },
    pearl: { bg: "bg-[#0f172a]/90", accent: "text-[#38bdf8]", border: "border-[#38bdf8]/30", icon: Anchor },
    tuscan: { bg: "bg-[#fefce8]/90", accent: "text-[#ca8a04]", border: "border-[#ca8a04]/20", icon: Sun, dark: true },
    frost: { bg: "bg-[#f0f9ff]/90", accent: "text-[#0ea5e9]", border: "border-[#0ea5e9]/20", icon: Cloud, dark: true },
    magenta: { bg: "bg-[#fdf2f8]/90", accent: "text-[#db2777]", border: "border-[#db2777]/20", icon: Heart, dark: true },
    jade: { bg: "bg-[#f0fdf4]/90", accent: "text-[#15803d]", border: "border-[#15803d]/20", icon: Leaf, dark: true },
    saffron: { bg: "bg-[#fff7ed]/90", accent: "text-[#ea580c]", border: "border-[#ea580c]/20", icon: Flame, dark: true },
    slate: { bg: "bg-[#f8fafc]/90", accent: "text-[#475569]", border: "border-[#475569]/20", icon: Landmark, dark: true },
    lavender: { bg: "bg-[#f5f3ff]/90", accent: "text-[#5b21b6]", border: "border-[#5b21b6]/20", icon: Bird, dark: true },
    ruby: { bg: "bg-[#fff1f2]/90", accent: "text-[#e11d48]", border: "border-[#e11d48]/20", icon: Wine, dark: true },
    golden: { bg: "bg-[#fffbeb]/90", accent: "text-[#d97706]", border: "border-[#d97706]/20", icon: Sun, dark: true },
    birch: { bg: "bg-[#f9fafb]/90", accent: "text-[#4b5563]", border: "border-[#4b5563]/20", icon: TreePine, dark: true },
    bronze: { bg: "bg-[#fff7ed]/90", accent: "text-[#9a3412]", border: "border-[#9a3412]/20", icon: Shield, dark: true },
    plum: { bg: "bg-[#faf5ff]/90", accent: "text-[#6b21a8]", border: "border-[#6b21a8]/30", icon: Coffee, dark: true },
    teal: { bg: "bg-[#f0fdfa]/90", accent: "text-[#0d9488]", border: "border-[#0d9488]/20", icon: Waves, dark: true },
    charcoal: { bg: "bg-[#111827]/90", accent: "text-[#f43f5e]", border: "border-[#f43f5e]/30", icon: Heart },
    sand: { bg: "bg-[#fafaf9]/90", accent: "text-[#78716c]", border: "border-[#78716c]/20", icon: Mountain, dark: true },
    forest: { bg: "bg-[#022c22]/90", accent: "text-[#10b981]", border: "border-[#10b981]/30", icon: TreePine },
    ember: { bg: "bg-[#450a0a]/90", accent: "text-[#ef4444]", border: "border-[#ef4444]/30", icon: Flame },
    blossom: { bg: "bg-[#fff1f2]/90", accent: "text-[#fb7185]", border: "border-[#fb7185]/20", icon: Flower2, dark: true },
    solstice: { bg: "bg-[#1e1b4b]/90", accent: "text-[#818cf8]", border: "border-[#818cf8]/30", icon: Moon },
    breeze: { bg: "bg-[#f0f9ff]/90", accent: "text-[#38bdf8]", border: "border-[#38bdf8]/20", icon: Wind, dark: true }
  };

  const config = themeConfigs[theme] || themeConfigs.modern;
  const Icon = config.icon;
  const qrValue = rsvpId || `${window.location.origin}/event/${event.slug?.trim()}`;

  return (
    <div className="space-y-4 md:space-y-6 w-full max-w-[320px] md:max-w-[340px] mx-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        ref={cardRef} 
        className={`relative aspect-[4/6] w-full rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border-2 ${config.border}`}
      >
        <div className="absolute inset-0 z-0">
          <img src={event.photo_url} loading="lazy" className="w-full h-full object-cover" alt="" />
          <div className={`absolute inset-0 ${config.bg} backdrop-blur-md`} />
        </div>
        <div className="relative z-10 h-full flex flex-col p-6 md:p-8 text-center">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
              <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[6px] font-black uppercase tracking-widest text-white">Verified Elite</span>
            </div>
            <ShieldCheck size={14} className={config.accent} />
          </div>
          <div className="mb-4 md:mb-6">
            <div className={`inline-flex p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 backdrop-blur-md mb-3 md:mb-4 ${config.accent}`}>
              <Icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <p className={`text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] mb-2 md:mb-3 ${config.accent}`}>
              {isPass ? 'Elite Entry Pass' : 'Official Invitation'}
            </p>
            <h2 className={`text-xl md:text-3xl font-serif italic leading-tight mb-1 md:mb-2 ${config.dark ? 'text-black' : 'text-white'}`}>
              {event.event_name}
            </h2>
          </div>
          <div className="flex-grow flex flex-col justify-center items-center">
            <div className="relative bg-white p-3 md:p-5 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl border-2 md:border-4 border-black/5">
              <QRCodeCanvas value={qrValue} size={isMobile ? 100 : 140} level="H" />
            </div>
            {isPass && (
              <p className={`mt-3 text-[7px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] ${config.dark ? 'text-black' : 'text-white'}`}>
                ID: {rsvpId.slice(0, 8).toUpperCase()}
              </p>
            )}
          </div>
          <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-white/10 space-y-3 md:space-y-4">
            {isPass && guestName && (
              <div className="flex items-center justify-center gap-2">
                <User size={10} className={config.accent} />
                <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-widest ${config.dark ? 'text-gray-800' : 'text-white'}`}>
                  {guestName}
                </span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 md:gap-4">
              <div className="text-center">
                <p className={`text-[5px] md:text-[6px] font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] mb-0.5 md:mb-1 ${config.dark ? 'text-gray-500' : 'text-gray-400'}`}>Date</p>
                <p className={`text-[7px] md:text-[8px] font-bold ${config.dark ? 'text-gray-800' : 'text-white'}`}>
                  {new Date(event.event_date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="text-center">
                <p className={`text-[5px] md:text-[6px] font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] mb-0.5 md:mb-1 ${config.dark ? 'text-gray-500' : 'text-gray-400'}`}>Time</p>
                <p className={`text-[7px] md:text-[8px] font-bold ${config.dark ? 'text-gray-800' : 'text-white'}`}>
                  {new Date(event.event_date).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <p className={`text-[5px] md:text-[6px] font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] ${config.dark ? 'text-gray-500' : 'text-gray-400'}`}>Venue</p>
              <p className={`text-[7px] md:text-[9px] font-medium truncate max-w-[160px] md:max-w-[200px] ${config.dark ? 'text-gray-600' : 'text-gray-300'}`}>
                {event.venue}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="flex gap-2 md:gap-3 justify-center">
        <Button onClick={handleDownload} className="flex-1 bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-none py-5 md:py-7 text-[8px] md:text-[10px] font-bold uppercase tracking-widest transition-all">
          <Download className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" /> Download
        </Button>
        <Button onClick={handleShare} variant="outline" className="flex-1 rounded-none border-white/10 bg-white/5 text-white py-5 md:py-7 text-[8px] md:text-[10px] font-bold uppercase tracking-widest hover:bg-white/10">
          <Share2 className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" /> Share
        </Button>
      </div>
    </div>
  );
};

export default DigitalInvite;