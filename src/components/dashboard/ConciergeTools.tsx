"use client";

import React, { useState } from 'react';
import { QrCode, Send, LayoutPanelLeft, Share2, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import QRScanner from './QRScanner';

interface ConciergeToolsProps {
  event: any;
}

const ToolCard = ({ icon: Icon, title, onClick, description }: any) => (
  <button
    onClick={onClick}
    className="group flex flex-col items-center justify-center p-6 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[2rem] hover:bg-black/10 dark:hover:bg-white/10 transition-all aspect-square text-center"
  >
    <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6 text-[#D4AF37]" />
    </div>
    <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{title}</span>
    <span className="text-[8px] text-gray-500 font-medium leading-tight max-w-[100px]">{description}</span>
  </button>
);

const ConciergeTools = ({ event }: ConciergeToolsProps) => {
  const [showScanner, setShowScanner] = useState(false);

  if (showScanner) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        <div className="p-6 flex items-center justify-between border-b border-white/10 bg-black/80 backdrop-blur-md">
          <Button 
            variant="ghost" 
            onClick={() => setShowScanner(false)}
            className="text-white hover:bg-white/10 rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tools
          </Button>
          <span className="text-white text-[10px] font-bold uppercase tracking-widest">Entry Control</span>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowScanner(false)}
            className="text-white hover:bg-white/10 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-hidden">
          <QRScanner eventId={event.id} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <ToolCard 
        icon={QrCode} 
        title="QR Scanner" 
        description="Verify guest entry passes instantly."
        onClick={() => setShowScanner(true)}
      />
      
      <Dialog>
        <DialogTrigger asChild>
          <button className="group flex flex-col items-center justify-center p-6 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[2rem] hover:bg-black/10 dark:hover:bg-white/10 transition-all aspect-square text-center">
            <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Send className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Broadcast</span>
            <span className="text-[8px] text-gray-500 font-medium leading-tight max-w-[100px]">Send live updates to all guests.</span>
          </button>
        </DialogTrigger>
        <DialogContent className="bg-white dark:bg-[#1a1a1a] border-none rounded-[2.5rem] p-8 max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif italic mb-2">Live Broadcast</DialogTitle>
            <DialogDescription className="text-[11px] uppercase tracking-widest opacity-60">
              Message will appear instantly on the event page.
            </DialogDescription>
          </DialogHeader>
          {/* Broadcast content would go here */}
          <div className="mt-4 flex flex-col gap-4">
            <textarea 
              className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl p-4 text-[13px] min-h-[120px] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50"
              placeholder="Type your message to guests..."
            />
            <Button className="w-full bg-[#D4AF37] hover:bg-[#B8962E] text-black font-bold uppercase tracking-widest py-6 rounded-2xl">
              Send Alert
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ToolCard 
        icon={LayoutPanelLeft} 
        title="Vibe Screen" 
        description="Control the live display dashboard."
        onClick={() => window.open(`/vibe/${event.id}`, '_blank')}
      />

      <ToolCard 
        icon={Share2} 
        title="Digital Invite" 
        description="Preview and share your event link."
        onClick={() => {
          // This should trigger the existing digital invite popup logic
          // For now, navigating to the event page as a fallback or if it's external
          window.open(`/event/${event.slug}`, '_blank');
        }}
      />
    </div>
  );
};

export default ConciergeTools;