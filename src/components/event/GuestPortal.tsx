"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Users, CheckCircle2, Coins, PartyPopper, Share2, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/ui/GlassCard';
import DigitalPass from '@/components/DigitalPass';
import { showSuccess, showError } from '@/utils/toast';

interface GuestPortalProps {
  event: any;
  submittedRsvp: any;
  tableMates: any[];
  giftAmount: string; // Kept for prop compatibility but unused
  setGiftAmount: (val: string) => void; // Kept for prop compatibility but unused
  onSpray: () => void;
  isFinished: boolean;
  config: any;
}

const GuestPortal = ({ 
  event, 
  submittedRsvp, 
  tableMates, 
  onSpray, 
  isFinished, 
  config 
}: GuestPortalProps) => {
  const [passIndex, setPassIndex] = useState(0);

  const handleShare = async () => {
    const eventUrl = `https://theeventhub.com.ng/event/${event.slug}`;
    const shareData = {
      title: event.event_name,
      text: `Join the celebration memories for ${event.event_name} on EventHub NG.`,
      url: eventUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(eventUrl);
        showSuccess("Link copied to clipboard.");
      }
    } catch (err) {
      // Ignore abort errors from user canceling share
      if ((err as Error).name !== 'AbortError') {
        showError("Could not share link.");
      }
    }
  };

  if (isFinished) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="sticky top-32 space-y-10">
        <GlassCard className={`${config.card} p-10 md:p-16 rounded-[3.5rem] border text-center`}>
          <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-8">
            <PartyPopper className="text-[#D4AF37] w-10 h-10" />
          </div>
          <h3 className="text-2xl font-serif italic mb-6">Event Concluded</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-10">
            The host thanks you for your time and for being part of this beautiful journey. The celebration was a resounding success.
          </p>
          <div className="pt-8 border-t border-white/5">
            <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-gray-600 mb-4">Share the Memories</p>
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                onClick={handleShare}
                className="rounded-full w-12 h-12 p-0 border-white/10 hover:bg-[#D4AF37] hover:text-black transition-all"
              >
                <Share2 size={16} />
              </Button>
              <Button variant="outline" className="rounded-full w-12 h-12 p-0 border-white/10 hover:bg-[#D4AF37] hover:text-black transition-all">
                <Camera size={16} />
              </Button>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="sticky top-32 space-y-10">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full mb-4">
          <Bookmark size={10} className="text-[#D4AF37]" />
          <span className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">Guest Instruction</span>
        </div>
        <p className="text-[11px] font-medium leading-relaxed opacity-70 px-4">
          Please <span className="text-[#D4AF37]">Bookmark</span> this page. This is your live portal for event updates and your entry pass.
        </p>
      </div>

      <div className="relative">
        {submittedRsvp.has_plus_one && (
          <div className="flex justify-center gap-4 mb-6">
            <button 
              onClick={() => setPassIndex(0)}
              className={`px-4 py-2 text-[8px] font-black uppercase tracking-widest transition-all ${passIndex === 0 ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-gray-500'}`}
            >
              Main Pass
            </button>
            <button 
              onClick={() => setPassIndex(1)}
              className={`px-4 py-2 text-[8px] font-black uppercase tracking-widest transition-all ${passIndex === 1 ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-gray-500'}`}
            >
              Plus One Pass
            </button>
          </div>
        )}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={passIndex}
            initial={{ opacity: 0, x: passIndex === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: passIndex === 0 ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          >
            <DigitalPass 
              event={event} 
              rsvp={submittedRsvp}
              isPlusOne={passIndex === 1}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      
      {submittedRsvp.table_number && (
        <GlassCard className={`${config.card} p-10 rounded-[2.5rem] border`}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] flex items-center gap-4">
              <Users className="w-4 h-4" /> Table Concierge
            </h2>
            <span className="text-2xl font-serif italic text-[#D4AF37]">Table {submittedRsvp.table_number}</span>
          </div>
          <div className="space-y-4">
            <p className="text-[9px] font-bold uppercase tracking-widest opacity-50 mb-2">Your Table Mates</p>
            <div className="grid gap-3">
              {tableMates.map((mate, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-lg">
                  <span className="text-sm font-light">{mate.guest_name}</span>
                  {mate.checked_in && (
                    <div className="flex items-center gap-2 text-green-500">
                      <span className="text-[7px] font-black uppercase tracking-widest">Seated</span>
                      <CheckCircle2 className="w-4 h-auto" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      <GlassCard className={`${config.card} p-10 rounded-[2.5rem] border text-center`}>
        <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-8 flex items-center justify-center gap-4">
          <Coins className="w-4 h-4" /> Digital Spraying
        </h2>
        <div className="space-y-6">
          <p className="text-xs text-gray-400 leading-relaxed">Honor the host with a direct digital spray.</p>
          <Button 
            onClick={onSpray} 
            className={`w-full h-20 rounded-none text-[10px] font-bold tracking-[0.3em] uppercase ${config.button}`}
          >
            Spray the Host
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default GuestPortal;