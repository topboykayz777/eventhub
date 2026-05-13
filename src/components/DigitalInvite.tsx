"use client";

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2, Crown, Sparkles, Gem, Landmark, Star, Heart, ShieldCheck, Flower2, Waves, Sun, Moon, PenTool, User, UserPlus, Ticket } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface DigitalInviteProps {
  event: any;
  rsvpId?: string;
  guestName?: string;
  plusOneName?: string;
  isPlusOne?: boolean;
}

const DigitalInvite = ({ event, rsvpId, guestName, plusOneName, isPlusOne = false }: DigitalInviteProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const isPass = !!rsvpId;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { 
        useCORS: true, 
        scale: 3, 
        backgroundColor: '#000000' 
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL("image/png");
      link.download = `${event.event_name}_${isPlusOne ? 'PlusOne_Pass' : 'Main_Pass'}.png`;
      link.click();
      showSuccess(`HD ${isPlusOne ? 'Plus One' : 'Main'} Pass secured to gallery.`);
    } catch (err) {
      showError('Failed to generate image.');
    }
  };

  const handleShare = async () => {
    const eventUrl = `${window.location.origin}/event/${event.slug?.trim()}`;
    const shareData = { 
      title: event.event_name, 
      text: isPass 
        ? `I'm attending ${event.event_name}! Here is my ${isPlusOne ? 'Plus One' : 'Main'} digital entry pass.` 
        : `You are cordially invited to ${event.event_name}. Please RSVP here:`, 
      url: eventUrl 
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        const whatsappText = `${shareData.text} ${shareData.url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(whatsappText)}`, '_blank');
      }
    } catch (err) { 
      console.log('Share cancelled'); 
    }
  };

  const theme = event.theme?.toLowerCase() || 'modern';
  
  const themeConfigs: Record<string, any> = {
    modern: { bg: "bg-black/85", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/40", icon: Sparkles, glow: "shadow-[#D4AF37]/20", dark: true },
    traditional: { bg: "bg-[#064e3b]/85", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/50", icon: Crown, glow: "shadow-[#D4AF37]/20", dark: true },
    elegant: { bg: "bg-white/95", accent: "text-black", border: "border-black/30", icon: Gem, glow: "shadow-black/10", dark: false },
    sahara: { bg: "bg-[#78350f]/85", accent: "text-[#fbbf24]", border: "border-[#fbbf24]/40", icon: Sun, glow: "shadow-[#fbbf24]/20", dark: true },
    velvet: { bg: "bg-[#2e1065]/85", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/40", icon: Moon, glow: "shadow-[#D4AF37]/20", dark: true },
    garden: { bg: "bg-[#064e3b]/85", accent: "text-[#10b981]", border: "border-[#10b981]/40", icon: Flower2, glow: "shadow-[#10b981]/20", dark: true },
    oceanic: { bg: "bg-[#1e3a8a]/85", accent: "text-[#93c5fd]", border: "border-[#93c5fd]/40", icon: Waves, glow: "shadow-[#93c5fd]/20", dark: true },
    rose: { bg: "bg-[#831843]/85", accent: "text-[#fbcfe8]", border: "border-[#fbcfe8]/40", icon: Heart, glow: "shadow-[#fbcfe8]/20", dark: true },
    earth: { bg: "bg-[#431407]/85", accent: "text-[#fb923c]", border: "border-[#fb923c]/40", icon: Landmark, glow: "shadow-[#fb923c]/20", dark: true },
    silver: { bg: "bg-[#1f2937]/85", accent: "text-[#9ca3af]", border: "border-[#9ca3af]/40", icon: Star, glow: "shadow-[#9ca3af]/20", dark: true },
    dynasty: { bg: "bg-[#7f1d1d]/85", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/40", icon: Crown, glow: "shadow-[#D4AF37]/20", dark: true },
    vintage: { bg: "bg-[#fef3c7]/95", accent: "text-[#92400e]", border: "border-[#92400e]/40", icon: PenTool, glow: "shadow-[#92400e]/20", dark: false }
  };

  const config = themeConfigs[theme] || themeConfigs.modern;
  const Icon = config.icon;
  
  const qrValue = isPlusOne ? `${rsvpId}:plus-one` : rsvpId || `${window.location.origin}/event/${event.slug?.trim()}`;

  return (
    <div className="space-y-6 w-full max-w-[340px] mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        ref={cardRef}
        className={`relative aspect-[4/6.5] w-full rounded-[3rem] overflow-hidden shadow-2xl border-2 ${config.border} ${config.glow} group`}
      >
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <img 
            src={event.photo_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80'} 
            className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
            alt="Background"
          />
          <div className={`absolute inset-0 ${config.bg} backdrop-blur-xl`} />
        </div>
        
        {/* Content Layer */}
        <div className="relative z-10 h-full flex flex-col p-8 text-center">
          {/* Header Badge */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white">Verified Access</span>
            </div>
            <ShieldCheck size={16} className={config.accent} />
          </div>

          {/* Event Title & Type */}
          <div className="mb-8">
            <div className={`inline-flex p-4 rounded-2xl bg-white/5 backdrop-blur-md mb-4 ${config.accent} border border-white/10`}>
              {isPlusOne ? <UserPlus size={24} /> : <Icon size={24} />}
            </div>
            <p className={`text-[9px] font-black uppercase tracking-[0.5em] mb-3 ${config.accent}`}>
              {isPlusOne ? 'Plus One Entry Pass' : 'Main Entry Pass'}
            </p>
            <h2 className={`text-3xl font-serif italic leading-tight mb-2 ${config.dark ? 'text-white' : 'text-black'}`}>
              {event.event_name}
            </h2>
            <div className={`w-12 h-0.5 mx-auto ${config.accent} bg-current opacity-30`} />
          </div>

          {/* QR Code Section */}
          <div className="flex-grow flex flex-col justify-center items-center">
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-r from-[#D4AF37] via-[#F9E4B7] to-[#D4AF37] rounded-[2.5rem] blur-xl opacity-20" />
              <div className="relative bg-white p-6 rounded-[2.5rem] shadow-2xl border-4 border-black/5">
                <QRCodeSVG 
                  value={qrValue} 
                  size={140} 
                  level="H" 
                  includeMargin={false}
                  fgColor="#000000"
                  bgColor="#FFFFFF"
                />
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <Ticket size={12} className="opacity-40" />
                <p className={`text-[9px] font-mono uppercase tracking-[0.3em] opacity-40 ${config.dark ? 'text-white' : 'text-black'}`}>
                  {rsvpId?.slice(0, 8).toUpperCase()}{isPlusOne ? '-P1' : '-MN'}
                </p>
              </div>
            </div>
          </div>

          {/* Guest Info & Logistics */}
          <div className="mt-8 pt-8 border-t border-white/10 space-y-6">
            <div className="flex flex-col items-center gap-1">
              <p className={`text-[7px] font-bold uppercase tracking-[0.3em] ${config.dark ? 'text-gray-500' : 'text-gray-400'}`}>Guest of Honor</p>
              <div className="flex items-center gap-2">
                <User size={12} className={config.accent} />
                <span className={`text-sm font-serif italic ${config.dark ? 'text-white' : 'text-black'}`}>
                  {isPlusOne ? (plusOneName || `Guest of ${guestName}`) : guestName}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center border-r border-white/10">
                <p className={`text-[7px] font-bold uppercase tracking-[0.3em] mb-1 ${config.dark ? 'text-gray-500' : 'text-gray-400'}`}>Date</p>
                <p className={`text-[10px] font-bold tracking-widest ${config.dark ? 'text-white' : 'text-black'}`}>
                  {new Date(event.event_date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                </p>
              </div>
              <div className="text-center">
                <p className={`text-[7px] font-bold uppercase tracking-[0.3em] mb-1 ${config.dark ? 'text-gray-500' : 'text-gray-400'}`}>Time</p>
                <p className={`text-[10px] font-bold tracking-widest ${config.dark ? 'text-white' : 'text-black'}`}>
                  {new Date(event.event_date).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }).toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1">
              <p className={`text-[7px] font-bold uppercase tracking-[0.3em] ${config.dark ? 'text-gray-500' : 'text-gray-400'}`}>Venue Location</p>
              <p className={`text-[10px] font-medium tracking-wide truncate max-w-[220px] ${config.dark ? 'text-gray-300' : 'text-gray-600'}`}>
                {event.venue}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <Button 
          onClick={handleDownload} 
          className="flex-1 bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-none py-7 text-[10px] font-bold uppercase tracking-[0.3em] transition-all shadow-xl"
        >
          <Download className="w-4 h-4 mr-2" /> Secure Pass
        </Button>
        <Button 
          onClick={handleShare}
          variant="outline" 
          className="flex-1 rounded-none border-white/10 bg-white/5 text-white py-7 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white/10"
        >
          <Share2 className="w-4 h-4 mr-2" /> Share
        </Button>
      </div>
    </div>
  );
};

export default DigitalInvite;