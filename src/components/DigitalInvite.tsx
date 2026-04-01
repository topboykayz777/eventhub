"use client";

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2, Crown, Sparkles, Gem, Landmark, Star, Heart, ShieldCheck } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';

interface DigitalInviteProps {
  event: any;
  rsvpId?: string;
}

const DigitalInvite = ({ event, rsvpId }: DigitalInviteProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

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
      link.download = `${event.event_name}_Elite_Pass.png`;
      link.click();
      showSuccess('Elite Pass secured to gallery.');
    } catch (err) {
      showError('Failed to generate pass.');
    }
  };

  const handleShare = async () => {
    const shareData = { 
      title: event.event_name, 
      text: `I'm attending ${event.event_name}! Here is my digital entry pass.`, 
      url: window.location.href 
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`, '_blank');
    } catch (err) { console.log('Share cancelled'); }
  };

  const theme = event.theme?.toLowerCase() || 'modern';
  
  const themeConfigs: Record<string, any> = {
    modern: { // Midnight Noir
      bg: "bg-black/40",
      accent: "text-[#D4AF37]",
      border: "border-[#D4AF37]/30",
      icon: Sparkles,
      glow: "shadow-[#D4AF37]/10"
    },
    traditional: { // Royal Emerald
      bg: "bg-[#064e3b]/40",
      accent: "text-[#D4AF37]",
      border: "border-[#D4AF37]/40",
      icon: Crown,
      glow: "shadow-[#D4AF37]/10"
    },
    elegant: { // Diamond Ivory
      bg: "bg-white/40",
      accent: "text-black",
      border: "border-black/20",
      icon: Gem,
      glow: "shadow-black/5"
    },
    sahara: { // Sahara Gold
      bg: "bg-[#78350f]/40",
      accent: "text-[#fbbf24]",
      border: "border-[#fbbf24]/30",
      icon: Star,
      glow: "shadow-[#fbbf24]/10"
    },
    blush: { // Blush Quartz
      bg: "bg-[#be185d]/40",
      accent: "text-[#fbcfe8]",
      border: "border-[#fbcfe8]/30",
      icon: Heart,
      glow: "shadow-[#fbcfe8]/10"
    },
    amethyst: { // Amethyst Velvet
      bg: "bg-[#581c87]/40",
      accent: "text-[#D4AF37]",
      border: "border-[#D4AF37]/30",
      icon: Crown,
      glow: "shadow-[#D4AF37]/10"
    },
    azure: { // Azure Silk
      bg: "bg-[#1e3a8a]/40",
      accent: "text-[#93c5fd]",
      border: "border-[#93c5fd]/30",
      icon: Sparkles,
      glow: "shadow-[#93c5fd]/10"
    }
  };

  const config = themeConfigs[theme] || themeConfigs.modern;
  const Icon = config.icon;

  // The QR code value: either the RSVP ID for check-in, or the event link for invitation
  const qrValue = rsvpId || `${window.location.origin}/event/${event.slug}`;

  return (
    <div className="space-y-8 w-full max-w-sm mx-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        ref={cardRef}
        className={`relative aspect-[4/6] w-full rounded-[3rem] overflow-hidden shadow-2xl border-2 ${config.border} ${config.glow}`}
      >
        {/* Background Image Layer - Now visible but subtle */}
        <div className="absolute inset-0 z-0">
          <img 
            src={event.photo_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80'} 
            className="w-full h-full object-cover grayscale opacity-40"
            alt="Background"
          />
          <div className={`absolute inset-0 ${config.bg} backdrop-blur-xl`} />
        </div>
        
        <div className="relative z-10 h-full flex flex-col p-10 text-center">
          {/* Header */}
          <div className="mb-6">
            <div className={`inline-flex p-4 rounded-2xl bg-white/5 backdrop-blur-md mb-6 ${config.accent}`}>
              <Icon size={28} />
            </div>
            <p className={`text-[8px] font-black uppercase tracking-[0.5em] mb-3 ${config.accent}`}>
              {rsvpId ? 'Elite Entry Pass' : 'Official Invitation'}
            </p>
            <h2 className={`text-2xl md:text-3xl font-serif italic leading-tight ${theme === 'elegant' ? 'text-black' : 'text-white'}`}>
              {event.event_name}
            </h2>
          </div>

          {/* QR Section - The Centerpiece */}
          <div className="flex-grow flex flex-col justify-center items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#D4AF37] via-[#F9E4B7] to-[#D4AF37] rounded-[2.5rem] blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative bg-white p-6 rounded-[2rem] shadow-2xl border-8 border-black/5">
                <QRCodeSVG value={qrValue} size={140} level="H" />
              </div>
              <p className={`mt-6 text-[8px] font-bold uppercase tracking-[0.3em] ${theme === 'elegant' ? 'text-gray-500' : 'text-gray-400'}`}>
                {rsvpId ? 'Scan at the Concierge' : 'Scan to RSVP'}
              </p>
            </div>
          </div>

          {/* Footer Details */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="space-y-2 mb-4">
              <p className={`text-[7px] font-bold uppercase tracking-[0.4em] ${theme === 'elegant' ? 'text-gray-500' : 'text-gray-400'}`}>
                {new Date(event.event_date).toLocaleDateString('en-NG', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              <p className={`text-[9px] font-medium truncate px-4 ${theme === 'elegant' ? 'text-gray-600' : 'text-gray-300'}`}>
                {event.venue}
              </p>
            </div>
            <div className="flex justify-center items-center gap-3">
              <div className={`h-px w-6 ${theme === 'elegant' ? 'bg-black/10' : 'bg-white/10'}`} />
              <Landmark size={12} className="text-gray-500" />
              <div className={`h-px w-6 ${theme === 'elegant' ? 'bg-black/10' : 'bg-white/10'}`} />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={handleDownload} 
          className="flex-1 bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-none py-8 text-[10px] font-bold uppercase tracking-widest transition-all hover:scale-105"
        >
          <Download className="w-4 h-4 mr-2" /> {rsvpId ? 'Save Pass' : 'Download Card'}
        </Button>
        <Button 
          onClick={handleShare}
          variant="outline" 
          className="flex-1 rounded-none border-white/10 bg-white/5 text-white py-8 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10"
        >
          <Share2 className="w-4 h-4 mr-2" /> Share Invite
        </Button>
      </div>
    </div>
  );
};

export default DigitalInvite;