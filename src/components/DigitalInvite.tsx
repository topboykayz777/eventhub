"use client";

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2, Crown, Sparkles, Gem, Landmark, Star, Heart, ShieldCheck, Flower2, Waves, Sun, Moon, PenTool, Clock, User } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';

interface DigitalInviteProps {
  event: any;
  rsvpId?: string;
  guestName?: string;
}

const DigitalInvite = ({ event, rsvpId, guestName }: DigitalInviteProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
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
      link.download = `${event.event_name}_${isPass ? 'Pass' : 'Invite'}.png`;
      link.click();
      showSuccess(`HD ${isPass ? 'Pass' : 'Invite'} secured to gallery.`);
    } catch (err) {
      showError('Failed to generate image.');
    }
  };

  const handleShare = async () => {
    const eventUrl = `${window.location.origin}/event/${event.slug?.trim()}`;
    const shareData = { 
      title: event.event_name, 
      text: isPass 
        ? `I'm attending ${event.event_name}! Here is my digital entry pass.` 
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
    modern: { bg: "bg-black/80", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/30", icon: Sparkles, glow: "shadow-[#D4AF37]/10" },
    traditional: { bg: "bg-[#064e3b]/80", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/40", icon: Crown, glow: "shadow-[#D4AF37]/10" },
    elegant: { bg: "bg-white/90", accent: "text-black", border: "border-black/20", icon: Gem, glow: "shadow-black/5" },
    sahara: { bg: "bg-[#78350f]/80", accent: "text-[#fbbf24]", border: "border-[#fbbf24]/30", icon: Sun, glow: "shadow-[#fbbf24]/10" },
    velvet: { bg: "bg-[#2e1065]/80", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/30", icon: Moon, glow: "shadow-[#D4AF37]/10" },
    garden: { bg: "bg-[#064e3b]/80", accent: "text-[#10b981]", border: "border-[#10b981]/30", icon: Flower2, glow: "shadow-[#10b981]/10" },
    oceanic: { bg: "bg-[#1e3a8a]/80", accent: "text-[#93c5fd]", border: "border-[#93c5fd]/30", icon: Waves, glow: "shadow-[#93c5fd]/10" },
    rose: { bg: "bg-[#831843]/80", accent: "text-[#fbcfe8]", border: "border-[#fbcfe8]/30", icon: Heart, glow: "shadow-[#fbcfe8]/10" },
    earth: { bg: "bg-[#431407]/80", accent: "text-[#fb923c]", border: "border-[#fb923c]/30", icon: Landmark, glow: "shadow-[#fb923c]/10" },
    silver: { bg: "bg-[#1f2937]/80", accent: "text-[#9ca3af]", border: "border-[#9ca3af]/30", icon: Star, glow: "shadow-[#9ca3af]/10" },
    dynasty: { bg: "bg-[#7f1d1d]/80", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/30", icon: Crown, glow: "shadow-[#D4AF37]/10" },
    vintage: { bg: "bg-[#fef3c7]/90", accent: "text-[#92400e]", border: "border-[#92400e]/30", icon: PenTool, glow: "shadow-[#92400e]/10" }
  };

  const config = themeConfigs[theme] || themeConfigs.modern;
  const Icon = config.icon;
  const qrValue = rsvpId || `${window.location.origin}/event/${event.slug?.trim()}`;

  return (
    <div className="space-y-6 w-full max-w-[340px] mx-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        ref={cardRef}
        className={`relative aspect-[4/6] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-2 ${config.border} ${config.glow}`}
      >
        {/* Background Image - Now in full color */}
        <div className="absolute inset-0 z-0">
          <img 
            src={event.photo_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80'} 
            className="w-full h-full object-cover"
            alt="Background"
          />
          <div className={`absolute inset-0 ${config.bg} backdrop-blur-md`} />
        </div>
        
        <div className="relative z-10 h-full flex flex-col p-8 text-center">
          {/* Header Badge */}
          <div className="flex justify-between items-center mb-6">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10`}>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[7px] font-black uppercase tracking-widest text-white">Verified Elite</span>
            </div>
            <ShieldCheck size={16} className={config.accent} />
          </div>

          {/* Title Section */}
          <div className="mb-6">
            <div className={`inline-flex p-4 rounded-2xl bg-white/5 backdrop-blur-md mb-4 ${config.accent}`}>
              <Icon size={24} />
            </div>
            <p className={`text-[8px] font-black uppercase tracking-[0.5em] mb-3 ${config.accent}`}>
              {isPass ? 'Elite Entry Pass' : 'Official Invitation'}
            </p>
            <h2 className={`text-2xl md:text-3xl font-serif italic leading-tight mb-2 ${theme === 'elegant' || theme === 'vintage' ? 'text-black' : 'text-white'}`}>
              {event.event_name}
            </h2>
          </div>

          {/* QR Section */}
          <div className="flex-grow flex flex-col justify-center items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#D4AF37] via-[#F9E4B7] to-[#D4AF37] rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative bg-white p-5 rounded-[2rem] shadow-2xl border-4 border-black/5">
                <QRCodeSVG value={qrValue} size={130} level="H" />
              </div>
              {isPass && (
                <p className={`mt-4 text-[9px] font-black uppercase tracking-[0.3em] ${theme === 'elegant' || theme === 'vintage' ? 'text-black' : 'text-white'}`}>
                  ID: {rsvpId.slice(0, 8).toUpperCase()}
                </p>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
            {isPass && guestName && (
              <div className="flex items-center justify-center gap-2">
                <User size={12} className={config.accent} />
                <span className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'elegant' || theme === 'vintage' ? 'text-gray-800' : 'text-white'}`}>
                  {guestName}
                </span>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className={`text-[6px] font-bold uppercase tracking-[0.2em] mb-1 ${theme === 'elegant' || theme === 'vintage' ? 'text-gray-500' : 'text-gray-400'}`}>Date</p>
                <p className={`text-[8px] font-bold ${theme === 'elegant' || theme === 'vintage' ? 'text-gray-800' : 'text-white'}`}>
                  {new Date(event.event_date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="text-center">
                <p className={`text-[6px] font-bold uppercase tracking-[0.2em] mb-1 ${theme === 'elegant' || theme === 'vintage' ? 'text-gray-500' : 'text-gray-400'}`}>Time</p>
                <p className={`text-[8px] font-bold ${theme === 'elegant' || theme === 'vintage' ? 'text-gray-800' : 'text-white'}`}>
                  {new Date(event.event_date).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1">
              <p className={`text-[6px] font-bold uppercase tracking-[0.2em] ${theme === 'elegant' || theme === 'vintage' ? 'text-gray-500' : 'text-gray-400'}`}>Venue</p>
              <p className={`text-[9px] font-medium truncate max-w-[200px] ${theme === 'elegant' || theme === 'vintage' ? 'text-gray-600' : 'text-gray-300'}`}>
                {event.venue}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-3 justify-center">
        <Button 
          onClick={handleDownload} 
          className="flex-1 bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-none py-7 text-[10px] font-bold uppercase tracking-widest transition-all"
        >
          <Download className="w-4 h-4 mr-2" /> Download HD
        </Button>
        <Button 
          onClick={handleShare}
          variant="outline" 
          className="flex-1 rounded-none border-white/10 bg-white/5 text-white py-7 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10"
        >
          <Share2 className="w-4 h-4 mr-2" /> Share
        </Button>
      </div>
    </div>
  );
};

export default DigitalInvite;