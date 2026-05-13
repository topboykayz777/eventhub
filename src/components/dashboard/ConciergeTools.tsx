"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageIcon, Wallet, Send, Sparkles, Monitor, Lock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DigitalInvite from '@/components/DigitalInvite';
import { showError } from '@/utils/toast';

interface ConciergeToolsProps {
  event: any;
  onSendWhatsAppBlast: () => void;
}

const ConciergeTools = ({ event, onSendWhatsAppBlast }: ConciergeToolsProps) => {
  const navigate = useNavigate();

  const isStarted = new Date() >= new Date(event.event_date);
  const isFinished = event.is_finished;
  const isLive = isStarted && !isFinished;

  const handleVibeClick = () => {
    if (!isStarted) {
      showError("The Vibe Screen activates once the event commences.");
      return;
    }
    if (isFinished) {
      showError("This event has concluded. The Vibe Screen is no longer active.");
      return;
    }
    window.open(`/vibe/${event.slug}`, '_blank');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Dialog>
        <DialogTrigger asChild>
          <button className="bg-white/5 border border-white/5 p-10 flex flex-col items-center justify-center gap-6 hover:bg-white/10 transition-all group">
            <ImageIcon className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Digital Invite</span>
          </button>
        </DialogTrigger>
        <DialogContent className="bg-[#0f0f0f] border-white/10 text-white max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif italic text-center mb-8">The Digital Invitation</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <DigitalInvite event={event} />
          </div>
        </DialogContent>
      </Dialog>

      <button 
        onClick={() => navigate(`/budget/${event.id}`)} 
        className="bg-white/5 border border-white/5 p-10 flex flex-col items-center justify-center gap-6 hover:bg-white/10 transition-all group"
      >
        <Wallet className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 transition-transform" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Financial Suite</span>
      </button>

      <button 
        onClick={handleVibeClick} 
        className={`p-10 flex flex-col items-center justify-center gap-6 transition-all group border ${
          isLive 
            ? 'bg-white/5 border-white/5 hover:bg-white/10' 
            : 'bg-black/20 border-white/5 opacity-50 cursor-not-allowed'
        }`}
      >
        {isLive ? (
          <Monitor className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 transition-transform" />
        ) : (
          <Lock className="w-8 h-8 text-gray-600" />
        )}
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">
          {isFinished ? 'Vibe Concluded' : isStarted ? 'Vibe Screen' : 'Vibe Locked'}
        </span>
      </button>

      {event.plan === 'Pro' ? (
        <button 
          onClick={onSendWhatsAppBlast} 
          className="bg-[#25D366]/10 border border-[#25D366]/20 p-10 flex flex-col items-center justify-center gap-6 hover:bg-[#25D366]/20 transition-all group"
        >
          <Send className="w-8 h-8 text-[#25D366] group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#25D366]">WhatsApp Blast</span>
        </button>
      ) : (
        <button 
          onClick={() => navigate(`/payment/${event.id}?upgrade=Pro`)} 
          className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 p-10 flex flex-col items-center justify-center gap-6 hover:bg-[#D4AF37]/20 transition-all group"
        >
          <Sparkles className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">Upgrade to Pro</span>
        </button>
      )}
    </div>
  );
};

export default ConciergeTools;