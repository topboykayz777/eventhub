"use client";

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2, Heart, Star, PartyPopper, GlassWater, Music, Crown, Sparkles, Gem, Landmark, Camera } from 'lucide-react';
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
        scale: 3, // Higher scale for "Nanobanana" quality
        backgroundColor: '#000000'
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `${event.event_name}_Elite_Pass.png`;
      link.click();
      showSuccess('Your Elite Pass has been secured to your gallery.');
    } catch (err) {
      showError('Failed to generate high-res image.');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: event.event_name,
      text: `I'm attending ${event.event_name}! Here is my digital entry pass.`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to WhatsApp
        const text = encodeURIComponent(`${shareData.text} ${shareData.url}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
      }
    } catch (err) {
      console.log('Share cancelled');
    }
  };

  const getDesignConfig = () => {
    const theme = event.theme?.toLowerCase() || 'modern';
    
    const configs: Record<string, any> = {
      modern: {
        bg: "bg-[#0a0a1a]",
        accent: "text-[#e94560]",
        border: "border-[#e94560]/30",
        gradient: "from-[#e94560]/20 to-transparent",
        icon: Sparkles
      },
      traditional: {
        bg: "bg-[#2d1b0d]",
        accent: "text-[#D4AF37]",
        border: "border-[#D4AF37]/40",
        gradient: "from-[#D4AF37]/20 to-transparent",
        icon: Crown
      },
      elegant: {
        bg: "bg-white",
        accent: "text-black",
        border: "border-black/10",
        gradient: "from-gray-100 to-transparent",
        icon: Gem
      }
    };
    
    return configs[theme] || configs.modern;
  };

  const config = getDesignConfig();
  const Icon = config.icon;

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        ref={cardRef}
        className={`relative aspect-[4/6] w-full max-w-sm mx-auto rounded-[3rem] overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] border-4 ${config.border} ${config.bg}`}
      >
        {/* Luxury Textures */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`} />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </div>

        <div className="relative z-10 h-full flex flex-col p-10 text-center">
          {/* Header */}
          <div className="mb-8">
            <div className={`inline-flex p-4 rounded-2xl bg-white/5 backdrop-blur-md mb-6 ${config.accent}`}>
              <Icon size={32} />
            </div>
            <p className={`text-[10px] font-black uppercase tracking-[0.5em] mb-4 ${config.accent}`}>
              {rsvpId ? 'Official Entry Pass' : 'Formal Invitation'}
            </p>
            <h2 className={`text-3xl md:text-4xl font-serif italic leading-tight text-white`}>
              {event.event_name}
            </h2>
          </div>

          {/* QR Section - The Masterpiece */}
          <div className="flex-grow flex flex-col justify-center items-center">
            {rsvpId ? (
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#D4AF37] via-[#F9E4B7] to-[#D4AF37] rounded-[2.5rem] blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative bg-white p-6 rounded-[2rem] shadow-2xl border-8 border-black/5">
                  <QRCodeSVG 
                    value={rsvpId} 
                    size={160}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <p className="mt-6 text-[8px] font-bold uppercase tracking-[0.3em] text-gray-500">
                  Scan at the Concierge
                </p>
              </div>
            ) : (
              <div className="space-y-6 py-8 border-y border-white/5 w-full">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-gray-500 mb-2">The Date</p>
                  <p className="text-xl font-serif italic text-white">
                    {new Date(event.event_date).toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-gray-500 mb-2">The Venue</p>
                  <p className="text-sm font-medium text-gray-300 leading-relaxed px-4">{event.venue}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-8 border-t border-white/5">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="h-px w-8 bg-white/10" />
              <Landmark size={14} className="text-gray-600" />
              <div className="h-px w-8 bg-white/10" />
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.5em] text-gray-600">
              Event Hub Nigeria • Elite Series
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto">
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