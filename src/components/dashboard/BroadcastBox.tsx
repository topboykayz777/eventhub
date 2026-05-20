"use client";

import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Info, Loader2, X } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BroadcastBoxProps {
  eventId: string;
  currentMessage?: string;
}

const TooltipWrapper = ({ children, text }: { children: React.ReactNode, text: string }) => (
  <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent className="bg-[#1a1a1a] border-[#D4AF37]/20 text-white text-[11px] font-medium p-4 max-w-[240px] shadow-2xl rounded-2xl z-[200]">
        {text}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const BroadcastBox = ({ eventId, currentMessage }: BroadcastBoxProps) => {
  const [message, setMessage] = useState(currentMessage || '');
  const [loading, setLoading] = useState(false);

  const handleUpdateMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);

    const { error } = await supabase
      .from('events')
      .update({ message: message })
      .eq('id', eventId);

    if (error) showError(error.message);
    else {
      showSuccess("Public page updated.");
    }
    setLoading(false);
  };

  return (
    <Dialog>
      <TooltipWrapper text="Post a live announcement that appears instantly at the top of your public event page for all guests to see.">
        <DialogTrigger asChild>
          <button className="bg-white/5 border border-white/5 h-40 flex flex-col items-center justify-center gap-6 hover:bg-white/10 transition-all group rounded-[2rem]">
            <MessageSquare className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Live Broadcast</span>
          </button>
        </DialogTrigger>
      </TooltipWrapper>
      <DialogContent className="bg-[#0f0f0f] border-white/10 text-white max-w-lg w-[95vw] rounded-[3rem] p-10">
        <DialogHeader>
          <DialogTitle className="text-3xl font-serif italic mb-2">The Broadcast</DialogTitle>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-8">Page-Top Announcement</p>
        </DialogHeader>
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-xs text-gray-500 leading-relaxed italic">
              "Your message will appear as a scrolling banner or bold header on your live event page."
            </p>
            <Input 
              placeholder="e.g. The Red Carpet is now open!" 
              className="bg-white/5 border-white/10 h-16 rounded-2xl text-lg font-light focus-visible:ring-[#D4AF37]/30"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <DialogClose asChild>
              <Button 
                onClick={handleUpdateMessage}
                disabled={loading || !message.trim()}
                className="flex-1 h-16 bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Event Page'}
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BroadcastBox;