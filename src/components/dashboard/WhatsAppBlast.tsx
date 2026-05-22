"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, CheckCircle2, Zap, Smartphone, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhatsAppBlastProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  rsvps: any[];
}

const WhatsAppBlast = ({ isOpen, onClose, event, rsvps }: WhatsAppBlastProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoAdvanceEnabled, setIsAutoAdvanceEnabled] = useState(true);
  const [completed, setCompleted] = useState<string[]>([]);
  const [isWaitingForReturn, setIsWaitingForReturn] = useState(false);
  
  const guests = rsvps || [];
  const currentGuest = guests[currentIndex];
  const isFinished = currentIndex >= guests.length;
  
  // High-reliability return detection using document visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isWaitingForReturn && isAutoAdvanceEnabled) {
        // User has returned from WhatsApp
        console.log("[WhatsAppBlast] User returned. Advancing queue...");
        setIsWaitingForReturn(false);
        
        // Short delay to allow UI to settle before the guest card flips
        setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
        }, 600);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isWaitingForReturn, isAutoAdvanceEnabled]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!currentGuest) return;

    const utilityData = [
      `Hi ${currentGuest.guest_name}, your Digital Pass for ${event.event_name} is ready! 🎫`,
      currentGuest.table_number ? `📍 Your Table: ${currentGuest.table_number}` : null,
      currentGuest.has_plus_one ? `👥 Plus-one: Confirmed` : null,
      `Access your pass here: https://theeventhub.com.ng/event/${event.slug}`,
      `See you there!`
    ].filter(Boolean).join('\n');

    const encodedText = encodeURIComponent(utilityData);
    const phone = currentGuest.guest_phone.replace(/\D/g, '');
    
    // Check for native mobile vs web
    const isMobile = /iPhone|Android|iPad/i.test(navigator.userAgent);
    const url = isMobile 
      ? `whatsapp://send?phone=${phone}&text=${encodedText}` 
      : `https://web.whatsapp.com/send?phone=${phone}&text=${encodedText}`;

    // Mark as completed locally
    setCompleted(prev => [...prev, currentGuest.id]);
    
    // Set wait flag before leaving the tab
    setIsWaitingForReturn(true);
    
    // Trigger launch
    window.open(url, '_blank');
    
    // Manual fallback for devices that don't trigger visibility changes well
    if (!isAutoAdvanceEnabled) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/95 backdrop-blur-2xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-card border border-border rounded-[3rem] overflow-hidden shadow-2xl"
      >
        <div className="p-8 border-b border-border flex justify-between items-center bg-muted/20">
          <div>
            <h3 className="text-foreground font-serif italic text-xl">Industrial Dispatcher</h3>
            <p className="text-[9px] text-[#D4AF37] font-black uppercase tracking-[0.3em] mt-1">Staccato-Speed Protocol</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-2">
            <X size={24} />
          </button>
        </div>

        <div className="p-10">
          {!isFinished ? (
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentGuest?.id || 'empty'}
                initial={{ opacity: 0, x: 30, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Guest {currentIndex + 1} of {guests.length}</span>
                    <h4 className="text-3xl text-foreground font-light tracking-tight">{currentGuest?.guest_name}</h4>
                  </div>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-500 ${isWaitingForReturn ? 'bg-amber-500/10 border-amber-500/30' : 'bg-[#D4AF37]/10 border-[#D4AF37]/30'}`}>
                    {isWaitingForReturn ? <Loader2 className="text-amber-500 w-6 h-6 animate-spin" /> : <Zap className="text-[#D4AF37] w-6 h-6" />}
                  </div>
                </div>

                <div className="bg-muted/40 rounded-3xl p-6 border border-border">
                   <p className="text-xs text-muted-foreground font-mono leading-relaxed italic line-clamp-3">
                     "Hi {currentGuest?.guest_name}, your Digital Pass for {event.event_name} is ready! {currentGuest?.table_number ? `Your Table: ${currentGuest.table_number}` : ''}..."
                   </p>
                </div>

                <div className="flex flex-col gap-4">
                  <Button 
                    onClick={handleSend}
                    className={`w-full h-20 rounded-2xl text-[12px] font-black uppercase tracking-[0.4em] group shadow-xl transition-all duration-500 ${
                      isWaitingForReturn 
                        ? 'bg-muted border border-border text-muted-foreground cursor-wait' 
                        : 'bg-[#D4AF37] hover:bg-[#B8860B] text-black scale-100 hover:scale-[1.02]'
                    }`}
                  >
                    {isWaitingForReturn ? (
                      <span className="flex items-center gap-3">Verification Pending...</span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        Launch Message <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                  
                  <div className="flex items-center justify-between px-2 pt-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${isAutoAdvanceEnabled ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`} />
                      <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Return Detection Active</span>
                    </div>
                    <button 
                      onClick={() => setIsAutoAdvanceEnabled(!isAutoAdvanceEnabled)}
                      className="text-[9px] text-[#D4AF37] font-black uppercase tracking-widest underline underline-offset-4"
                    >
                      {isAutoAdvanceEnabled ? 'Switch to Manual' : 'Switch to Auto'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="text-center py-10 space-y-8">
              <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                <CheckCircle2 className="text-green-500 w-12 h-12" />
              </div>
              <div>
                <h4 className="text-2xl text-foreground font-serif italic mb-2">Orchestration Complete</h4>
                <p className="text-muted-foreground text-sm font-light">All active guests in this batch have been dispatched.</p>
              </div>
              <Button onClick={onClose} variant="outline" className="border-border text-foreground rounded-2xl w-full py-8 text-[11px] font-black uppercase tracking-widest hover:bg-muted">
                Return to Dashboard
              </Button>
            </div>
          )}
        </div>

        <div className="bg-muted/30 p-6 flex items-center justify-center gap-6 border-t border-border">
           <div className="flex items-center gap-2 text-muted-foreground">
              <Smartphone size={14} />
              <span className="text-[8px] font-black uppercase tracking-widest">Device Optimized</span>
           </div>
           <div className="w-px h-3 bg-border/50" />
           <div className="flex items-center gap-2 text-muted-foreground">
              <Zap size={14} />
              <span className="text-[8px] font-black uppercase tracking-widest">Industrial Grade</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WhatsAppBlast;