"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageIcon, Wallet, Send, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DigitalInvite from '@/components/DigitalInvite';

interface ConciergeToolsProps {
  event: any;
  onSendWhatsAppBlast: () => void;
}

const ConciergeTools = ({ event, onSendWhatsAppBlast }: ConciergeToolsProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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