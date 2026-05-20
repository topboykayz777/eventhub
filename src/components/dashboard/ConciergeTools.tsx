"use client";

import React, { useState, useEffect } from 'react';
import { QrCode, Send, LayoutPanelLeft, X, ArrowLeft, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import QRScanner from '@/components/QRScanner';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';

interface ConciergeToolsProps {
  event: any;
  onSendWhatsAppBlast: () => void;
}

const ToolCard = ({ icon: Icon, title, onClick, description, accent = false }: any) => (
  <button
    onClick={onClick}
    className={`group flex flex-col items-center justify-center p-8 border rounded-[2.5rem] transition-all aspect-square text-center ${
      accent 
      ? 'bg-primary/10 border-primary/30 hover:bg-primary/20 hover:scale-[1.02]' 
      : 'bg-muted/30 border-border hover:bg-muted/50 hover:border-primary/30 hover:scale-[1.02]'
    }`}
  >
    <div className={`w-14 h-14 rounded-3xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform ${
      accent ? 'bg-primary/20' : 'bg-background/80 dark:bg-card/80 border border-border'
    }`}>
      <Icon className={`w-7 h-7 ${accent ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} />
    </div>
    <span className="text-[11px] font-bold uppercase tracking-[0.25em] mb-2">{title}</span>
    <span className="text-[9px] text-muted-foreground font-medium leading-relaxed max-w-[120px]">{description}</span>
  </button>
);

const ConciergeTools = ({ event, onSendWhatsAppBlast }: ConciergeToolsProps) => {
  const [showScanner, setShowScanner] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isBroadcasting, setIsBroadcast] = useState(false);

  const handleManualScan = async (scannedText: string) => {
    let rsvpId = scannedText.trim();
    let isPlusOne = rsvpId.includes(':plus-one');
    if (isPlusOne) rsvpId = rsvpId.split(':plus-one')[0];
    
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .update(isPlusOne ? { plus_one_checked_in: true } : { checked_in: true })
        .eq('id', rsvpId)
        .select('guest_name')
        .maybeSingle();

      if (error || !data) showError("Pass invalid or not found.");
      else {
        showSuccess(`${data.guest_name} verified successfully.`);
        setShowScanner(false);
      }
    } catch (err) {
      showError("Connection error during verification.");
    }
  };

  const handleBroadcast = async () => {
    if (!broadcastMessage.trim()) return;
    setIsBroadcast(true);
    const { error } = await supabase.from('events').update({ message: broadcastMessage }).eq('id', event.id);
    if (error) showError(error.message);
    else {
      showSuccess("Broadcast announcement updated.");
      setBroadcastMessage('');
    }
    setIsBroadcast(false);
  };

  if (showScanner) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex flex-col">
        <div className="p-6 md:p-8 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl sticky top-0">
          <Button 
            variant="ghost" 
            onClick={() => setShowScanner(false)}
            className="hover:bg-muted rounded-full h-12 px-6"
          >
            <ArrowLeft className="w-5 h-5 mr-3" /> <span className="font-bold uppercase tracking-widest text-[10px]">Back to Tools</span>
          </Button>
          <div className="flex items-center gap-3">
            <QrCode className="text-primary w-5 h-5" />
            <span className="font-black uppercase tracking-[0.4em] text-[10px]">Entry Control</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowScanner(false)}
            className="hover:bg-muted rounded-full w-12 h-12"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
        <div className="flex-1 overflow-hidden p-6 md:p-12 flex flex-col items-center justify-center">
          <div className="max-w-md w-full space-y-12">
            <div className="text-center">
              <h3 className="text-4xl font-serif italic mb-3">Scanning Gallery</h3>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.4em]">Position QR pass in view</p>
            </div>
            <QRScanner onScanSuccess={handleManualScan} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
      <ToolCard 
        icon={QrCode} 
        title="QR Scanner" 
        description="Verify guest entry passes instantly."
        onClick={() => setShowScanner(true)}
      />
      
      <ToolCard 
        icon={Zap} 
        title="WhatsApp Blast" 
        description="Mass dispatch invitations to guests."
        onClick={onSendWhatsAppBlast}
        accent={true}
      />

      <ToolCard 
        icon={LayoutPanelLeft} 
        title="Vibe Screen" 
        description="Launch the live display dashboard."
        onClick={() => window.open(`/vibe/${event.slug}`, '_blank')}
      />

      <Dialog>
        <DialogTrigger asChild>
          <button className="group flex flex-col items-center justify-center p-8 bg-muted/30 border border-border rounded-[2.5rem] hover:bg-muted/50 hover:border-primary/30 transition-all aspect-square text-center hover:scale-[1.02]">
            <div className="w-14 h-14 rounded-3xl bg-background/80 dark:bg-card/80 border border-border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Send className="w-7 h-7 text-muted-foreground group-hover:text-primary" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] mb-2">Broadcast</span>
            <span className="text-[9px] text-muted-foreground font-medium leading-relaxed max-w-[120px]">Send live updates to all guests.</span>
          </button>
        </DialogTrigger>
        <DialogContent className="bg-card border-border text-foreground rounded-[3rem] p-10 max-w-md mx-auto shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-serif italic mb-2">Live Broadcast</DialogTitle>
            <DialogDescription className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8">
              Page-Top Announcement
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-8">
            <textarea 
              className="w-full bg-muted/50 border border-border rounded-2xl p-6 text-lg font-light min-h-[160px] focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none leading-relaxed transition-all"
              placeholder="Type your message to guests..."
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
            />
            <Button 
              onClick={handleBroadcast}
              disabled={isBroadcasting || !broadcastMessage.trim()}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-[0.3em] py-8 rounded-2xl text-[10px] shadow-xl"
            >
              {isBroadcasting ? <Loader2 className="animate-spin" /> : 'Update Event Page'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConciergeTools;