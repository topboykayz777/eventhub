"use client";

import React, { useState } from 'react';
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
    className={`group flex flex-col items-center justify-center p-6 border rounded-[2rem] transition-all aspect-square text-center ${
      accent 
      ? 'bg-[#D4AF37]/5 border-[#D4AF37]/20 hover:bg-[#D4AF37]/10' 
      : 'bg-white/5 border-white/5 hover:bg-white/10'
    }`}
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
      accent ? 'bg-[#D4AF37]/10' : 'bg-white/5'
    }`}>
      <Icon className={`w-6 h-6 ${accent ? 'text-[#D4AF37]' : 'text-gray-400 group-hover:text-[#D4AF37]'}`} />
    </div>
    <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{title}</span>
    <span className="text-[8px] text-gray-500 font-medium leading-tight max-w-[100px]">{description}</span>
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

      if (error || !data) showError("Pass invalid.");
      else {
        showSuccess(`${data.guest_name} verified.`);
        setShowScanner(false);
      }
    } catch (err) {
      showError("Invalid pass.");
    }
  };

  const handleBroadcast = async () => {
    if (!broadcastMessage.trim()) return;
    setIsBroadcast(true);
    const { error } = await supabase.from('events').update({ message: broadcastMessage }).eq('id', event.id);
    if (error) showError(error.message);
    else showSuccess("Broadcast updated.");
    setIsBroadcast(false);
  };

  if (showScanner) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        <div className="p-6 flex items-center justify-between border-b border-white/10 bg-black/80 backdrop-blur-md">
          <Button 
            variant="ghost" 
            onClick={() => setShowScanner(false)}
            className="text-white hover:bg-white/10 rounded-full h-12"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tools
          </Button>
          <span className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Entry Control</span>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowScanner(false)}
            className="text-white hover:bg-white/10 rounded-full w-12 h-12"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
        <div className="flex-1 overflow-hidden p-6 flex flex-col items-center justify-center">
          <QRScanner onScanSuccess={handleManualScan} />
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
          <button className="group flex flex-col items-center justify-center p-6 bg-white/5 border border-white/5 rounded-[2rem] hover:bg-white/10 transition-all aspect-square text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Send className="w-6 h-6 text-gray-400 group-hover:text-[#D4AF37]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Broadcast</span>
            <span className="text-[8px] text-gray-500 font-medium leading-tight max-w-[100px]">Send live updates to all guests.</span>
          </button>
        </DialogTrigger>
        <DialogContent className="bg-[#0f0f0f] border-white/10 text-white rounded-[3rem] p-10 max-w-md mx-auto shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-serif italic mb-2">Live Broadcast</DialogTitle>
            <DialogDescription className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-8">
              Page-Top Announcement
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-8">
            <textarea 
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-lg font-light min-h-[160px] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 resize-none leading-relaxed"
              placeholder="Type your message to guests..."
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
            />
            <Button 
              onClick={handleBroadcast}
              disabled={isBroadcasting || !broadcastMessage.trim()}
              className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black font-black uppercase tracking-[0.3em] py-8 rounded-2xl text-[10px]"
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