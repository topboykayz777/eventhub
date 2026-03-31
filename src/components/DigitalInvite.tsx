"use client";

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2, Heart, Star, PartyPopper, GlassWater } from 'lucide-react';
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

  const getEventType = () => {
    const name = event.event_name.toLowerCase();
    if (name.includes('wedding') || name.includes('marriage') || name.includes('nupitals')) return 'wedding';
    if (name.includes('gala') || name.includes('ball') || name.includes('dinner')) return 'gala';
    if (name.includes('birthday') || name.includes('party') || name.includes('celebration')) return 'party';
    return 'general';
  };

  const eventType = getEventType();

  const themeStyles = {
    modern: "bg-[#1a1a2e] border-[#e94560] text-white",
    traditional: "bg-[#fdfcf0] border-[#b8860b] text-[#5d4037]",
    elegant: "bg-white border-gray-200 text-gray-900"
  };

  const currentTheme = (event.theme || 'modern') as keyof typeof themeStyles;

  const EventIcon = {
    wedding: Heart,
    gala: GlassWater,
    party: PartyPopper,
    general: Star
  }[eventType];

  return (
    <div className="space-y-6">
      <div 
        ref={cardRef}
        className={`aspect-[4/5] w-full max-w-sm mx-auto rounded-[2.5rem] p-10 text-center flex flex-col justify-between border-4 shadow-2xl relative overflow-hidden ${themeStyles[currentTheme]}`}
      >
        {/* Event-Specific Background Decorations */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          {eventType === 'wedding' && <Heart size={300} className="rotate-12" />}
          {eventType === 'gala' && <GlassWater size={300} className="-rotate-12" />}
          {eventType === 'party' && <PartyPopper size={300} />}
        </div>

        <div className="z-10">
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-full ${currentTheme === 'modern' ? 'bg-[#e94560]/20 text-[#e94560]' : 'bg-black/5 text-current'}`}>
              <EventIcon size={32} />
            </div>
          </div>
          <p className={`font-bold tracking-[0.4em] uppercase text-[10px] mb-4 ${currentTheme === 'modern' ? 'text-[#e94560]' : 'text-gray-400'}`}>
            {rsvpId ? 'Official Entry Pass' : 'Formal Invitation'}
          </p>
          <h2 className={`text-3xl md:text-4xl font-serif italic leading-tight mb-4`}>{event.event_name}</h2>
          <div className={`w-16 h-0.5 mx-auto ${currentTheme === 'modern' ? 'bg-[#e94560]' : 'bg-current opacity-20'}`} />
        </div>

        <div className="z-10 space-y-6">
          {rsvpId ? (
            <div className="bg-white p-6 rounded-3xl inline-block mx-auto shadow-2xl border-8 border-black/5">
              <QRCodeSVG 
                value={rsvpId} 
                size={140}
                fgColor={currentTheme === 'traditional' ? '#5d4037' : '#000000'}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-[8px] font-bold uppercase tracking-[0.3em] mb-2">The Date</p>
                <p className="font-serif italic text-xl">
                  {new Date(event.event_date).toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <p className={`font-bold text-sm mt-1 ${currentTheme === 'modern' ? 'text-[#e94560]' : ''}`}>
                  At {new Date(event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              
              <div>
                <p className="text-gray-400 text-[8px] font-bold uppercase tracking-[0.3em] mb-2">The Venue</p>
                <p className="font-medium text-sm leading-relaxed px-4">{event.venue}</p>
              </div>
            </div>
          )}
        </div>

        <div className="z-10 pt-8 border-t border-black/5">
          <p className="text-gray-400 text-[9px] font-bold uppercase tracking-[0.4em]">Event Hub Nigeria • Elite Series</p>
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