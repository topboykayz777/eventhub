"use client";

import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, MessageSquare, X } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface BroadcastBoxProps {
  eventId: string;
  currentMessage?: string;
}

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
    <div className="flex flex-col gap-3 p-4 bg-white/5 border-b border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="text-[#D4AF37] w-3 h-3" />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">Live Broadcast Message</span>
        </div>
        {currentMessage && (
          <button 
            onClick={clearMessage}
            className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-500/70 hover:text-red-500 flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>
      <div className="flex gap-2">
        <Input 
          placeholder="Update message (e.g. 'The Buffet is Open!')" 
          className="bg-black/20 border-white/5 h-10 rounded-none text-[10px] font-bold uppercase tracking-[0.1em] placeholder:text-gray-600"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleUpdateMessage()}
        />
        <Button 
          onClick={handleUpdateMessage}
          disabled={loading || !message.trim()}
          className="h-10 bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-none px-4"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};

export default BroadcastBox;