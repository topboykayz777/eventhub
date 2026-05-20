"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, CheckCircle2, Zap, Smartphone } from 'lucide-react';
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

  const guests = rsvps || [];
  const currentGuest = guests[currentIndex];
  const isFinished = currentIndex >= guests.length;

  useEffect(() => {
    const handleFocus = () => {
      if (isAutoAdvanceEnabled && !isFinished && currentGuest && completed.includes(currentGuest.id)) {
        setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
        }, 800);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [currentIndex, isAutoAdvanceEnabled, completed, isFinished, currentGuest]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!currentGuest) return;

    const utilityData = [
      `Hi ${currentGuest.guest_name}, your Digital Pass for ${event.event_name} is ready! 🎫`,
      currentGuest.table_number ? `📍 Your Table: ${currentGuest.table_number}` : null,
      currentGuest.has_plus_one ? `👥 Plus-one: Confirmed` : null,
      `Access your pass here: https://eventhub.ng/event/${event.slug}`,
      `See you there!`
    ].filter(Boolean).join('\n');

    const encodedText = encodeURIComponent(utilityData);
    const phone = currentGuest.guest_phone.replace(/\D/g, '');
    
    const isMobile = /iPhone|Android|iPad/i.test(navigator.userAgent);
    const url = isMobile 
      ? `whatsapp://send?phone=${phone}&text=${encodedText}` 
      : `https://web.whatsapp.com/send?phone=${phone}&text=${encodedText}`;

    window.open(url, '_blank');
    setCompleted(prev => [...prev, currentGuest.id]);
    
    if (!isAutoAdvanceEnabled) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/90 backdrop-blur-xl transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl transition-colors duration-500"
      >
        <div className="p-8 border-b border-border flex justify-between items-center bg-muted/30">
          <div>
            <h3 className="text-foreground font-serif italic text-xl">Industrial Dispatcher</h3>
            <p className="text-[9px] text-[#D4AF37] font-black uppercase tracking-[0.3em] mt-1">Staccato-Speed Invitations</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-10">
          {!isFinished ? (
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentGuest?.id || 'empty'}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Target {currentIndex + 1} of {guests.length}</span>
                    <h4 className="text-3xl text-foreground font-light tracking-tight">{currentGuest?.guest_name}</h4>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20 shadow-sm">
                    <Zap className="text-[#D4AF37] w-6 h-6" />
                  </div>
                </div>

                <div className="bg-muted/40 rounded-2xl p-6 border border-border space-y-3">
                   <p className="text-xs text-muted-foreground font-mono leading-relaxed italic">
                     "Hi {currentGuest?.guest_name}, your Digital Pass for {event.event_name} is ready! {currentGuest?.table_number ? `Your Table: ${currentGuest.table_number}` : ''}..."
                   </p>
                </div>

                <div className="flex flex-col gap-4">
                  <Button 
                    onClick={handleSend}
                    className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black h-20 rounded-[1.2rem] text-[11px] font-black uppercase tracking-[0.5em] group shadow-lg"
                  >
                    <span>Launch WhatsApp</span>
                    <Send size={16} className="ml-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isAutoAdvanceEnabled ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`} />
                      <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Auto-Advance Active</span>
                    </div>
                    <button 
                      onClick={() => setIsAutoAdvanceEnabled(!isAutoAdvanceEnabled)}
                      className="text-[9px] text-[#D4AF37] font-black uppercase tracking-widest underline decoration-1 underline-offset-4"
                    >
                      {isAutoAdvanceEnabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="text-center py-10 space-y-8">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                <CheckCircle2 className="text-green-500 w-10 h-10" />
              </div>
              <div>
                <h4 className="text-2xl text-foreground font-serif italic mb-2">Orchestration Complete</h4>
                <p className="text-muted-foreground text-sm font-light">All active guests have been dispatched.</p>
              </div>
              <Button onClick={onClose} variant="outline" className="border-border text-foreground rounded-[1.2rem] w-full py-8 text-[11px] font-black uppercase tracking-widest hover:bg-muted">
                Return to Dashboard
              </Button>
            </div>
          )}
        </div>

        <div className="bg-muted/20 p-6 flex items-center justify-center gap-6 border-t border-border">
           <div className="flex items-center gap-2 text-muted-foreground">
              <Smartphone size={14} />
              <span className="text-[8px] font-black uppercase tracking-widest">Native Protocol Optimized</span>
           </div>
           <div className="w-px h-3 bg-border" />
           <div className="flex items-center gap-2 text-muted-foreground">
              <Zap size={14} />
              <span className="text-[8px] font-black uppercase tracking-widest">Staccato Flow</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WhatsAppBlast;