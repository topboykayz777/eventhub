"use client";

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2, Heart, Star, PartyPopper, GlassWater, Music, Crown, Sparkles, Gem, Landmark, Camera } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';

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
        scale: 2,
        backgroundColor: '#1a1a2e'
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `${event.event_name}_Invite.png`;
      link.click();
      showSuccess('Invitation card saved to your device!');
    } catch (err) {
      showError('Failed to generate image. Please try again.');
    }
  };

  const getDesignType = () => {
    const name = event.event_name.toLowerCase();
    const theme = event.theme?.toLowerCase() || 'modern';

    if (name.includes('wedding')) return 'royal-wedding';
    if (name.includes('gala')) return 'midnight-gala';
    if (name.includes('birthday')) return 'celebration-gold';
    if (name.includes('concert') || name.includes('music')) return 'neon-vibe';
    if (name.includes('corporate') || name.includes('launch')) return 'minimal-executive';
    if (name.includes('traditional') || theme === 'traditional') return 'heritage-classic';
    if (name.includes('party')) return 'electric-night';
    if (name.includes('anniversary')) return 'diamond-anniversary';
    if (name.includes('fashion')) return 'vogue-chic';
    return 'standard-elite';
  };

  const design = getDesignType();

  const designConfigs: Record<string, any> = {
    'royal-wedding': {
      bg: "bg-[#fdfcf0]",
      border: "border-[#b8860b]",
      text: "text-[#5d4037]",
      accent: "text-[#b8860b]",
      icon: Heart,
      pattern: "opacity-10",
      font: "font-serif"
    },
    'midnight-gala': {
      bg: "bg-[#0a0a1a]",
      border: "border-[#D4AF37]",
      text: "text-white",
      accent: "text-[#D4AF37]",
      icon: GlassWater,
      pattern: "opacity-20",
      font: "font-serif"
    },
    'celebration-gold': {
      bg: "bg-gradient-to-br from-[#D4AF37] to-[#B8860B]",
      border: "border-white/20",
      text: "text-black",
      accent: "text-black/60",
      icon: Crown,
      pattern: "opacity-30",
      font: "font-sans"
    },
    'neon-vibe': {
      bg: "bg-black",
      border: "border-[#e94560]",
      text: "text-white",
      accent: "text-[#e94560]",
      icon: Music,
      pattern: "opacity-40",
      font: "font-sans"
    },
    'minimal-executive': {
      bg: "bg-white",
      border: "border-gray-900",
      text: "text-gray-900",
      accent: "text-gray-400",
      icon: Landmark,
      pattern: "opacity-5",
      font: "font-sans"
    },
    'heritage-classic': {
      bg: "bg-[#5d4037]",
      border: "border-[#b8860b]",
      text: "text-[#fdfcf0]",
      accent: "text-[#b8860b]",
      icon: Star,
      pattern: "opacity-20",
      font: "font-serif"
    },
    'electric-night': {
      bg: "bg-[#1a1a2e]",
      border: "border-[#4ecca3]",
      text: "text-white",
      accent: "text-[#4ecca3]",
      icon: PartyPopper,
      pattern: "opacity-20",
      font: "font-sans"
    },
    'diamond-anniversary': {
      bg: "bg-gray-50",
      border: "border-gray-200",
      text: "text-gray-800",
      accent: "text-blue-400",
      icon: Gem,
      pattern: "opacity-10",
      font: "font-serif"
    },
    'vogue-chic': {
      bg: "bg-black",
      border: "border-white",
      text: "text-white",
      accent: "text-gray-500",
      icon: Camera,
      pattern: "opacity-10",
      font: "font-serif"
    },
    'standard-elite': {
      bg: "bg-[#0f0f0f]",
      border: "border-[#D4AF37]",
      text: "text-white",
      accent: "text-[#D4AF37]",
      icon: Sparkles,
      pattern: "opacity-10",
      font: "font-sans"
    }
  };

  const config = designConfigs[design];
  const Icon = config.icon;

  return (
    <div className="space-y-6">
      <div 
        ref={cardRef}
        className={`aspect-[4/5] w-full max-w-sm mx-auto rounded-[2.5rem] p-10 text-center flex flex-col justify-between border-4 shadow-2xl relative overflow-hidden ${config.bg} ${config.text} ${config.font}`}
      >
        {/* Background Decoration */}
        <div className={`absolute inset-0 ${config.pattern} pointer-events-none flex items-center justify-center`}>
          <Icon size={300} className="rotate-12" />
        </div>

        <div className="z-10">
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-full ${config.bg === 'bg-white' ? 'bg-gray-100' : 'bg-white/5'} ${config.accent}`}>
              <Icon size={32} />
            </div>
          </div>
          <p className={`font-bold tracking-[0.4em] uppercase text-[10px] mb-4 ${config.accent}`}>
            {rsvpId ? 'Official Entry Pass' : 'Formal Invitation'}
          </p>
          <h2 className={`text-3xl md:text-4xl font-serif italic leading-tight mb-4`}>{event.event_name}</h2>
          <div className={`w-16 h-0.5 mx-auto ${config.accent.replace('text-', 'bg-')}`} />
        </div>

        <div className="z-10 space-y-6">
          {rsvpId ? (
            <div className="bg-white p-6 rounded-3xl inline-block mx-auto shadow-2xl border-8 border-black/5">
              <QRCodeSVG 
                value={rsvpId} 
                size={140}
                fgColor="#000000"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className={`${config.accent} text-[8px] font-bold uppercase tracking-[0.3em] mb-2 opacity-60`}>The Date</p>
                <p className="font-serif italic text-xl">
                  {new Date(event.event_date).toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <p className={`font-bold text-sm mt-1 ${config.accent}`}>
                  At {new Date(event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              
              <div>
                <p className={`${config.accent} text-[8px] font-bold uppercase tracking-[0.3em] mb-2 opacity-60`}>The Venue</p>
                <p className="font-medium text-sm leading-relaxed px-4">{event.venue}</p>
              </div>
            </div>
          )}
        </div>

        <div className="z-10 pt-8 border-t border-black/5">
          <p className="opacity-40 text-[9px] font-bold uppercase tracking-[0.4em]">Event Hub Nigeria • Elite Series</p>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <Button onClick={handleDownload} className="bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-none px-8 py-6 text-[10px] font-bold uppercase tracking-widest">
          <Download className="w-4 h-4 mr-2" /> {rsvpId ? 'Save Pass' : 'Download Card'}
        </Button>
        <Button variant="outline" className="rounded-none border-white/10 bg-white/5 text-white px-8 py-6 text-[10px] font-bold uppercase tracking-widest">
          <Share2 className="w-4 h-4 mr-2" /> Share
        </Button>
      </div>
    </div>
  );
};

export default DigitalInvite;