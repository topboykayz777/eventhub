"use client";

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2, Crown, Sparkles, Gem, Landmark } from 'lucide-react';
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
      const canvas = await html2canvas(cardRef.current, { useCORS: true, scale: 3, backgroundColor: '#000000' });
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
    const shareData = { title: event.event_name, text: `I'm attending ${event.event_name}!`, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`, '_blank');
    } catch (err) { console.log('Share cancelled'); }
  };

  const theme = event.theme?.toLowerCase() || 'modern';
  const configs: Record<string, any> = {
    modern: { bg: "bg-[#0a0a1a]", accent: "text-[#e94560]", border: "border-[#e94560]/20", icon: Sparkles, pattern: "opacity-10 bg-[radial-gradient(#e94560_1px,transparent_1px)] [background-size:20px_20px]" },
    traditional: { bg: "bg-[#2d1b0d]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/30", icon: Crown, pattern: "opacity-10 bg-[url('https://www.transparenttextures.com/patterns/az-subtle.png')]" },
    elegant: { bg: "bg-white", accent: "text-black", border: "border-black/10", icon: Gem, pattern: "opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" }
  };
  const config = configs[theme] || configs.modern;
  const Icon = config.icon;

  return (
    <div className="space-y-6 w-full max-w-xs mx-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        ref={cardRef}
        className={`relative aspect-[4/5] w-full rounded-[2rem] overflow-hidden shadow-2xl border-2 ${config.border} ${config.bg}`}
      >
        <div className={`absolute inset-0 ${config.pattern}`} />
        
        <div className="relative z-10 h-full flex flex-col p-8 text-center">
          <div className="mb-4">
            <div className={`inline-flex p-3 rounded-xl bg-white/5 backdrop-blur-md mb-4 ${config.accent}`}>
              <Icon size={24} />
            </div>
            <p className={`text-[7px] font-black uppercase tracking-[0.4em] mb-2 ${config.accent}`}>
              {rsvpId ? 'Elite Entry Pass' : 'Official Invitation'}
            </p>
            <h2 className={`text-xl md:text-2xl font-serif italic leading-tight ${theme === 'elegant' ? 'text-black' : 'text-white'}`}>
              {event.event_name}
            </h2>
          </div>

          <div className="flex-grow flex flex-col justify-center items-center">
            {rsvpId ? (
              <div className="bg-white p-4 rounded-2xl shadow-xl border-4 border-black/5">
                <QRCodeSVG value={rsvpId} size={120} level="H" />
              </div>
            ) : (
              <div className="space-y-4 py-4 border-y border-black/5 w-full">
                <div>
                  <p className="text-[6px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-1">The Date</p>
                  <p className={`text-sm font-serif italic ${theme === 'elegant' ? 'text-black' : 'text-white'}`}>
                    {new Date(event.event_date).toLocaleDateString('en-NG', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-[6px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-1">The Venue</p>
                  <p className="text-[10px] font-medium text-gray-400 leading-relaxed px-4">{event.venue}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-black/5">
            <div className="flex justify-center items-center gap-2 mb-2">
              <div className="h-px w-4 bg-black/10" />
              <Landmark size={10} className="text-gray-400" />
              <div className="h-px w-4 bg-black/10" />
            </div>
            <p className="text-[6px] font-black uppercase tracking-[0.4em] text-gray-400">
              Event Hub Nigeria • Elite Series
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button 
          onClick={handleDownload} 
          className="flex-1 bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-none py-6 text-[8px] font-bold uppercase tracking-widest transition-all hover:scale-105"
        >
          <Download className="w-3 h-3 mr-2" /> {rsvpId ? 'Save Pass' : 'Download Card'}
        </Button>
        <Button 
          onClick={handleShare}
          variant="outline" 
          className="flex-1 rounded-none border-white/10 bg-white/5 text-white py-6 text-[8px] font-bold uppercase tracking-widest hover:bg-white/10"
        >
          <Share2 className="w-3 h-3 mr-2" /> Share Invite
        </Button>
      </div>
    </div>
  );
};

export default DigitalInvite;