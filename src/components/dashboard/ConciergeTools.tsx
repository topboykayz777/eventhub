"use client";

import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageIcon, Wallet, Send, Sparkles, Monitor, Lock, Download, Loader2, Copy, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import DigitalInvite from '@/components/DigitalInvite';
import { showError, showSuccess } from '@/utils/toast';
import html2canvas from 'html2canvas';
import InfoButton from '@/components/InfoButton';

interface ConciergeToolsProps {
  event: any;
  onSendWhatsAppBlast: () => void;
}

const ConciergeTools = ({ event, onSendWhatsAppBlast }: ConciergeToolsProps) => {
  const navigate = useNavigate();
  const inviteRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const isStarted = new Date() >= new Date(event.event_date);
  const isFinished = event.is_finished;
  const isLive = isStarted && !isFinished;
  const hasFullAccess = event.plan === 'Pro' || event.plan === 'beta';

  const handleCopyLink = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsCopying(true);
    const url = `${window.location.origin}/event/${event.slug}`;
    navigator.clipboard.writeText(url);
    showSuccess("Event Link Copied.");
    setTimeout(() => setIsCopying(false), 2000);
  };

  const handleVibeClick = () => {
    if (!isStarted) {
      showError("The Vibe Screen activates once the event begins.");
      return;
    }
    if (isFinished) {
      showError("This event has ended. The screen is no longer active.");
      return;
    }
    window.open(`/vibe/${event.slug}`, '_blank');
  };

  const handleDownloadInvite = async () => {
    if (!inviteRef.current) return;
    setIsDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const canvas = await html2canvas(inviteRef.current, {
        backgroundColor: '#0a0a0a', scale: 3, useCORS: true, allowTaint: true, logging: false
      });
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = `${event.event_name.replace(/\s+/g, '_')}_Invitation.png`;
      link.click();
      showSuccess("Invitation Saved.");
    } catch (err) {
      showError("Failed to save image.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="relative group w-full">
        <Dialog>
          <DialogTrigger asChild>
            <button className="w-full bg-card border border-border h-40 flex flex-col items-center justify-center gap-6 hover:bg-secondary/50 transition-all group rounded-[2rem] shadow-sm px-6">
              <ImageIcon className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground text-center">Digital Invite</span>
            </button>
          </DialogTrigger>
          <DialogContent className="bg-popover border-border text-foreground max-w-lg w-[95vw] p-0 overflow-hidden rounded-[3rem] shadow-2xl">
            <div className="relative h-full max-h-[90vh] flex flex-col">
              <DialogHeader className="p-8 border-b border-border shrink-0">
                <DialogTitle className="text-2xl font-serif italic">Your Digital Invitation</DialogTitle>
              </DialogHeader>
              <ScrollArea className="flex-1 p-8">
                <div className="pb-12 flex justify-center"><DigitalInvite ref={inviteRef} event={event} /></div>
              </ScrollArea>
              <div className="p-8 border-t border-border bg-secondary/50 shrink-0 flex flex-col sm:flex-row gap-4">
                <button onClick={handleDownloadInvite} disabled={isDownloading} className="flex-1 py-5 bg-[#D4AF37] text-black text-[10px] font-bold uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 shadow-lg">
                  {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download size={14} />} {isDownloading ? 'Processing...' : 'Save to Gallery'}
                </button>
                <button onClick={() => handleCopyLink()} className="flex-1 py-5 bg-card text-foreground text-[10px] font-bold uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 border border-border hover:bg-secondary transition-all">
                  <Copy size={14} className="text-[#D4AF37]" /> {isCopying ? 'Copied' : 'Copy Link'}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <div className="absolute top-4 right-4"><InfoButton text="View and save a high-quality picture of your invitation to share on your WhatsApp status or groups." /></div>
      </div>

      <div className="relative group w-full">
        <button onClick={() => navigate(`/budget/${event.id}`)} className="w-full bg-card border border-border h-40 flex flex-col items-center justify-center gap-6 hover:bg-secondary/50 transition-all group rounded-[2rem] shadow-sm px-6">
          <Wallet className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground text-center">Financial Suite</span>
        </button>
        <div className="absolute top-4 right-4"><InfoButton text="Open your financial vault to see guest gifts and manage your event budget." /></div>
      </div>

      <div className="relative group w-full">
        <button onClick={handleVibeClick} className={`w-full h-40 flex flex-col items-center justify-center gap-6 transition-all group border rounded-[2rem] shadow-sm px-6 ${isLive ? 'bg-card border-border hover:bg-secondary/50' : 'bg-secondary/50 border-border opacity-50 cursor-not-allowed'}`}>
          {isLive ? <Monitor className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 transition-transform" /> : <Lock className="w-8 h-8 text-muted-foreground" />}
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground text-center">Vibe Screen</span>
        </button>
        <div className="absolute top-4 right-4"><InfoButton text="Launch the live screen to show on a TV. It displays guest arrivals and gift alerts in real-time as they happen." /></div>
      </div>

      <div className="relative group w-full sm:col-span-2 lg:col-span-3">
        <button onClick={hasFullAccess ? onSendWhatsAppBlast : () => navigate(`/payment/${event.id}?upgrade=Pro`)} className={`w-full h-40 flex flex-col items-center justify-center gap-6 transition-all group border rounded-[2rem] shadow-sm px-6 ${hasFullAccess ? 'bg-[#25D366]/10 border-[#25D366]/20 hover:bg-[#25D366]/20' : 'bg-[#D4AF37]/10 border-[#D4AF37]/20 hover:bg-[#D4AF37]/20'}`}>
          <Send className={`w-8 h-8 group-hover:scale-110 transition-transform ${hasFullAccess ? 'text-[#25D366]' : 'text-[#D4AF37]'}`} />
          <span className={`text-[10px] font-bold uppercase tracking-[0.3em] text-center ${hasFullAccess ? 'text-[#25D366]' : 'text-[#D4AF37]'}`}>
            {hasFullAccess ? 'WhatsApp Blast' : 'Upgrade to Pro'}
          </span>
        </button>
        <div className="absolute top-4 right-4"><InfoButton text={hasFullAccess ? "Dispatch official invitations and digital passes to your entire guest list via WhatsApp instantly." : "Unlock the high-speed WhatsApp dispatcher to reach all your guests at once."} /></div>
      </div>
    </div>
  );
};

export default ConciergeTools;