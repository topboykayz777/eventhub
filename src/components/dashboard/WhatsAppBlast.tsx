"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Users, CheckCircle2, Loader2, MessageSquare, CheckSquare, Square, Copy, Check, ArrowRight, Play, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';

interface WhatsAppBlastProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  rsvps: any[];
}

const WhatsAppBlast = ({ isOpen, onClose, event, rsvps }: WhatsAppBlastProps) => {
  const [message, setMessage] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLooping, setIsLooping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(rsvps.map(r => r.id));
      setIsLooping(false);
      setCurrentIndex(0);
    }
  }, [isOpen, rsvps]);

  const formatPhone = (phone: string) => {
    let cleaned = phone.replace(/\D/g, '');
    // Nigeria specific: if starts with 0, replace with 234
    if (cleaned.startsWith('0')) {
      cleaned = '234' + cleaned.substring(1);
    }
    // If it's just 10 digits (e.g. 803...), add 234
    if (cleaned.length === 10) {
      cleaned = '234' + cleaned;
    }
    return cleaned;
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === rsvps.length) setSelectedIds([]);
    else setSelectedIds(rsvps.map(r => r.id));
  };

  const handleStartLoop = () => {
    if (!message.trim()) {
      showError("Please enter a message.");
      return;
    }
    if (selectedIds.length === 0) {
      showError("Please select at least one guest.");
      return;
    }
    setIsLooping(true);
    setCurrentIndex(0);
    showSuccess("Blast Loop Started.");
  };

  const selectedGuests = rsvps.filter(r => selectedIds.includes(r.id));
  const currentGuest = selectedGuests[currentIndex];

  const sendAndNext = () => {
    if (!currentGuest) return;

    const formattedPhone = formatPhone(currentGuest.guest_phone);
    const text = encodeURIComponent(`${message}\n\nView Event: ${window.location.origin}/event/${event.slug}`);
    
    // Open WhatsApp
    window.open(`https://api.whatsapp.com/send?phone=${formattedPhone}&text=${text}`, '_blank');

    // Move to next guest automatically
    if (currentIndex < selectedGuests.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      showSuccess("Blast Sequence Complete!");
      setIsLooping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-6"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-2xl w-full bg-[#0f0f0f] border border-white/10 p-8 md:p-12 rounded-none shadow-2xl max-h-[90vh] flex flex-col"
          >
            <div className="flex justify-between items-center mb-8 shrink-0">
              <div>
                <span className="text-[#25D366] text-[10px] font-bold tracking-[0.4em] uppercase block mb-2">Mass Communication</span>
                <h3 className="text-2xl md:text-3xl font-serif italic text-white">WhatsApp Blast</h3>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
              {!isLooping ? (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Your Message</Label>
                    <Textarea 
                      placeholder="e.g. The Buffet is now open! Please proceed to the dining hall."
                      className="min-h-[150px] bg-white/5 border-white/10 rounded-none focus:border-[#25D366]/50 text-lg font-light resize-none"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Recipients ({selectedIds.length})</Label>
                      <button onClick={toggleSelectAll} className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">
                        {selectedIds.length === rsvps.length ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                      {rsvps.map((rsvp) => (
                        <div 
                          key={rsvp.id} 
                          onClick={() => setSelectedIds(prev => prev.includes(rsvp.id) ? prev.filter(i => i !== rsvp.id) : [...prev, rsvp.id])}
                          className={`p-3 border cursor-pointer text-[8px] font-bold uppercase tracking-widest transition-all ${
                            selectedIds.includes(rsvp.id) ? 'bg-[#25D366]/10 border-[#25D366]/30 text-white' : 'bg-white/5 border-white/5 text-gray-500'
                          }`}
                        >
                          {rsvp.guest_name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-full bg-white/5 h-1 mb-12">
                    <motion.div 
                      className="bg-[#25D366] h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentIndex + 1) / selectedGuests.length) * 100}%` }}
                    />
                  </div>
                  
                  <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">
                    Guest {currentIndex + 1} of {selectedGuests.length}
                  </span>
                  
                  <h2 className="text-4xl md:text-6xl font-serif italic text-white mb-4">
                    {currentGuest?.guest_name}
                  </h2>
                  <p className="text-gray-500 font-mono mb-12">{currentGuest?.guest_phone}</p>

                  <div className="bg-[#25D366]/5 border border-[#25D366]/20 p-6 mb-12 max-w-md">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#25D366] mb-2">The Loop Strategy</p>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Click the button below. WhatsApp will open with the message ready. Send it, then come back here—the next guest will be waiting.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-8 shrink-0">
              {!isLooping ? (
                <Button 
                  onClick={handleStartLoop}
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase"
                >
                  <Play className="w-4 h-4 mr-2" /> Start Blast Loop
                </Button>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  <Button 
                    variant="outline"
                    onClick={() => setIsLooping(false)}
                    className="col-span-1 border-white/10 bg-white/5 text-white py-10 rounded-none text-[10px] font-bold tracking-[0.2em] uppercase"
                  >
                    Stop
                  </Button>
                  <Button 
                    onClick={sendAndNext}
                    className="col-span-2 bg-[#25D366] hover:bg-[#128C7E] text-white py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase"
                  >
                    Send & Next <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={() => currentIndex < selectedGuests.length - 1 && setCurrentIndex(prev => prev + 1)}
                    className="col-span-1 text-gray-500 hover:text-white py-10 rounded-none text-[10px] font-bold tracking-[0.2em] uppercase"
                  >
                    Skip <SkipForward className="ml-2 w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppBlast;