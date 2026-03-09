"use client";

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import html2canvas from 'html2canvas';

interface DigitalInviteProps {
  event: any;
}

const DigitalInvite = ({ event }: DigitalInviteProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        scale: 2, // Higher quality
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

  const themeStyles = {
    modern: "bg-[#1a1a2e] border-[#e94560] text-white",
    traditional: "bg-[#fdfcf0] border-[#b8860b] text-[#5d4037]",
    elegant: "bg-white border-gray-200 text-gray-900"
  };

  const accentColors = {
    modern: "bg-[#e94560]",
    traditional: "bg-[#b8860b]",
    elegant: "bg-black"
  };

  const currentTheme = (event.theme || 'modern') as keyof typeof themeStyles;

  return (
    <div className="space-y-6">
      <div 
        ref={cardRef}
        className={`aspect-[4/5] w-full max-w-sm mx-auto rounded-[2rem] p-8 text-center flex flex-col justify-between border-4 shadow-2xl relative overflow-hidden ${themeStyles[currentTheme]}`}
      >
        {/* Decorative Blobs for Modern Theme */}
        {currentTheme === 'modern' && (
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#e94560] blur-3xl" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#e94560] blur-3xl" />
          </div>
        )}

        <div className="z-10">
          <p className={`font-bold tracking-[0.3em] uppercase text-sm mb-4 ${currentTheme === 'modern' ? 'text-[#e94560]' : 'text-gray-500'}`}>You are Invited</p>
          <h2 className={`text-3xl font-black uppercase italic leading-tight mb-2`}>{event.event_name}</h2>
          <div className={`w-12 h-1 mx-auto mb-6 ${accentColors[currentTheme]}`} />
        </div>

        <div className="z-10 space-y-4">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Date & Time</p>
            <p className="font-bold text-lg">
              {new Date(event.event_date).toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className={`font-bold ${currentTheme === 'modern' ? 'text-[#e94560]' : ''}`}>
              {new Date(event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Venue</p>
            <p className="font-medium leading-tight">{event.venue}</p>
          </div>
        </div>

        <div className="z-10 pt-6 border-t border-white/10">
          <p className="text-gray-500 text-[10px] uppercase tracking-widest">Powered by Event Hub Nigeria</p>
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <Button onClick={handleDownload} className="bg-[#e94560] hover:bg-[#d43d56] rounded-xl">
          <Download className="w-4 h-4 mr-2" /> Download Card
        </Button>
        <Button variant="outline" className="rounded-xl border-gray-200 hover:bg-gray-50">
          <Share2 className="w-4 h-4 mr-2" /> Share Card
        </Button>
      </div>
    </div>
  );
};

export default DigitalInvite;