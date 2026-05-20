"use client";

import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, MessageSquare, X, Info } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
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

const InfoButton = ({ text }: { text: string }) => (
  <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="inline-flex items-center justify-center ml-2 text-gray-500 hover:text-[#D4AF37] transition-all">
          <Info size={12} className="opacity-60" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="bg-[#1a1a1a] border-[#D4AF37]/20 text-white text-[10px] font-medium p-3 max-w-[200px] shadow-2xl rounded-xl z-[200]">
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
      showSuccess("Host's Message updated live.");
    }
    setLoading(false);
  };

  const clearMessage = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('events')
      .update({ message: null })
      .eq('id', eventId);

    if (error) showError(error.message);
    else {
      setMessage('');
      showSuccess("Host's Message cleared.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-center bg-white/[0.03] border border-white/10 p-8 rounded-[2rem] mb-12 shadow-xl">
      <div className="flex items-center gap-5 shrink-0">
        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
          <MessageSquare className="text-[#D4AF37] w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Live Broadcast</span>
            <InfoButton text="Messages set here appear instantly on both your public event page and the Vibe Screen for your guests to see." />
          </div>
          {currentMessage && (
            <button 
              onClick={clearMessage}
              className="text-[8px] font-black uppercase tracking-[0.2em] text-red-500/70 hover:text-red-500 flex items-center gap-1 transition-colors mt-1"
            >
              <X className="w-2 h-2" /> Clear Message
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 w-full flex gap-4">
        <Input 
          placeholder="Update your message (e.g. 'The Buffet is Open!')" 
          className="bg-black/20 border-white/10 h-16 rounded-2xl text-sm font-light focus-visible:ring-[#D4AF37]/30"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleUpdateMessage()}
        />
        <Button 
          onClick={handleUpdateMessage}
          disabled={loading || !message.trim()}
          className="h-16 bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-2xl px-10 text-[10px] font-black uppercase tracking-[0.2em] shrink-0 transition-all duration-500"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Dispatch</>}
        </Button>
      </div>
    </div>
  );
};

export default BroadcastBox;