"use client";

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

interface DigitalInviteProps {
  event: any;
}

const DigitalInvite = ({ event }: DigitalInviteProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    // In a real app, we'd use html2canvas here. 
    // For now, we'll simulate the action.
    showSuccess('Invitation card generated! Downloading...');
  };

  return (
    <div className="space-y-6">
      <div 
        ref={cardRef}
        className="aspect-[4/5] w-full max-w-sm mx-auto bg-[#1a1a2e] rounded-[2rem] p-8 text-center flex flex-col justify-between border-4 border-[#e94560] shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#e94560] blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#e94560] blur-3xl" />
        </div>

        <div className="z-10">
          <p className="text-[#e94560] font-bold tracking-[0.3em] uppercase text-sm mb-4">You are Invited</p>
          <h2 className="text-3xl font-black text-white uppercase italic leading-tight mb-2">{event.event_name}</h2>
          <div className="w-12 h-1 bg-[#e94560] mx-auto mb-6" />
        </div>

        <div className="z-10 space-y-4">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Date & Time</p>
            <p className="text-white font-bold text-lg">
              {new Date(event.event_date).toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-[#e94560] font-bold">
              {new Date(event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Venue</p>
            <p className="text-white font-medium leading-tight">{event.venue}</p>
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
        <Button variant="outline" className="rounded-xl border-white/20 text-white hover:bg-white/10">
          <Share2 className="w-4 h-4 mr-2" /> Share Card
        </Button>
      </div>
    </div>
  );
};

export default DigitalInvite;