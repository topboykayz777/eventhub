"use client";

import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Megaphone, Loader2 } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface BroadcastBoxProps {
  eventId: string;
  currentMessage?: string;
}

const BroadcastBox = ({ eventId, currentMessage }: BroadcastBoxProps) => {
  const [message, setMessage] = useState(currentMessage || '');
  const [loading, setLoading] = useState(false);

  const handleBroadcast = async () => {
    if (!message.trim()) return;
    setLoading(true);

    const { error } = await supabase
      .from('events')
      .update({ broadcast_message: message })
      .eq('id', eventId);

    if (error) showError(error.message);
    else {
      showSuccess("Broadcast sent to all guests.");
    }
    setLoading(false);
  };

  const clearBroadcast = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('events')
      .update({ broadcast_message: null })
      .eq('id', eventId);

    if (error) showError(error.message);
    else {
      setMessage('');
      showSuccess("Broadcast cleared.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center bg-white/5 border border-white/10 p-6 rounded-none">
      <div className="flex items-center gap-4 shrink-0">
        <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
          <Megaphone className="text-[#D4AF37] w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Live Broadcast</span>
      </div>
      <div className="flex-1 w-full flex gap-4">
        <Input 
          placeholder="Type a message to all guests (e.g. The Buffet is Open!)" 
          className="bg-white/5 border-white/10 h-14 rounded-none text-[10px] font-bold uppercase tracking-[0.2em]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleBroadcast()}
        />
        <Button 
          onClick={handleBroadcast}
          disabled={loading}
          className="h-14 bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-none px-8 text-[10px] font-bold uppercase tracking-[0.2em]"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
        {currentMessage && (
          <Button 
            variant="ghost"
            onClick={clearBroadcast}
            className="h-14 text-red-500 hover:bg-red-500/10 rounded-none text-[10px] font-bold uppercase tracking-[0.2em]"
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default BroadcastBox;