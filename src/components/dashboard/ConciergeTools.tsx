"use client";

import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageIcon, Wallet, Send, Sparkles, Monitor, Lock, Download, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import DigitalInvite from '@/components/DigitalInvite';
import { showError, showSuccess } from '@/utils/toast';
import html2canvas from 'html2canvas';

interface ConciergeToolsProps {
  event: any;
  onSendWhatsAppBlast: () => void;
}

const ConciergeTools = ({ event, onSendWhatsAppBlast }: ConciergeToolsProps) => {
  const navigate = useNavigate();
  const inviteRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

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

  const handleDownloadInvite = async () => {
    if (!inviteRef.current) return;
    setIsDownloading(true);
    
    try {
      const canvas = await html2canvas(inviteRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `${event.event_name.replace(/\s+/g, '_')}_Invitation.png`;
      link.click();
      showSuccess("Invitation downloaded successfully.");
    } catch (err) {
      showError("Could not generate invitation image.");
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
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
        <DialogContent className="bg-[#0f0f0f] border-white/10 text-white max-w-lg w-[95vw] p-0 overflow-hidden rounded-3xl">
          <div className="relative h-full max-h-[90vh] flex flex-col">
            <DialogHeader className="p-6 border-b border-white/5 shrink-0">
              <DialogTitle className="text-xl font-serif italic">The Digital Invitation</DialogTitle>
            </DialogHeader>
            
            <ScrollArea className="flex-1 p-6">
              <div className="pb-12 flex justify-center">
                <DigitalInvite ref={inviteRef} event={event} />
              </div>
            </ScrollArea>

            <div className="p-6 border-t border-white/5 bg-black/40 shrink-0 flex gap-4">
              <button 
                onClick={handleDownloadInvite}
                disabled={isDownloading}
                className="flex-1 py-4 bg-[#D4AF37] hover:bg-[#B8860B] text-black [10px] font-bold uppercase tracking-widest transition-all rounded-xl flex items-center justify-center gap-2"
              >
                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download size={14} />}
                {isDownloading ? 'Generating...' : 'Download IV'}
              </button>
              <DialogClose asChild>
                <button className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest transition-all rounded-xl">
                  Close
                </button>
              </DialogClose>
            </div>
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