"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Users, CheckCircle2, Loader2, MessageSquare } from 'lucide-react';
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
  const [sending, setSending] = useState(false);
  const [sentCount, setSentCount] = useState(0);

  const handleBlast = async () => {
    if (!message.trim()) {
      showError("Please enter a message.");
      return;
    }

    setSending(true);
    
    // Due to browser security, we can't send 100 messages in the background.
    // We provide a "Sequential Blast" interface where the host clicks to fire each one.
    // This is the most reliable way to ensure WhatsApp doesn't block the sender.
    
    const firstGuest = rsvps[0];
    if (firstGuest) {
      const text = encodeURIComponent(`${message}\n\nView Event: ${window.location.origin}/event/${event.slug}`);
      window.open(`https://wa.me/${firstGuest.guest_phone}?text=${text}`, '_blank');
      setSentCount(1);
      showSuccess(`Blast initiated. Continue sending to the rest of your ${rsvps.length} guests.`);
    }
    
    setSending(false);
  };

  const sendToGuest = (phone: string) => {
    const text = encodeURIComponent(`${message}\n\nView Event: ${window.location.origin}/event/${event.slug}`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    setSentCount(prev => prev + 1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
        >
          <div className="max-w-2xl w-full bg-[#0f0f0f] border border-white/10 p-10 md:p-16 rounded-none shadow-2xl">
            <div className="flex justify-between items-center mb-12">
              <div>
                <span className="text-[#25D366] text-[10px] font-bold tracking-[0.4em] uppercase block mb-2">Mass Communication</span>
                <h3 className="text-3xl font-serif italic text-white">WhatsApp Blast</h3>
              </div>
              <button 
                onClick={onClose}
                className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-10">
              <div className="bg-[#25D366]/5 border border-[#25D366]/20 p-6 flex items-center gap-6">
                <Users className="text-[#25D366] w-6 h-6" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white">Target Audience</p>
                  <p className="text-sm text-gray-500">{rsvps.length} Confirmed Guests for "{event.event_name}"</p>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Your Message</Label>
                <Textarea 
                  placeholder="e.g. The Buffet is now open! Please proceed to the dining hall."
                  className="min-h-[150px] bg-white/5 border-white/10 rounded-none focus:border-[#25D366]/50 text-lg font-light resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <p className="text-[8px] text-gray-600 uppercase tracking-widest">The event link will be automatically appended to your message.</p>
              </div>

              <div className="pt-6">
                {sentCount === 0 ? (
                  <Button 
                    onClick={handleBlast}
                    disabled={sending || rsvps.length === 0}
                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500"
                  >
                    {sending ? <Loader2 className="animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Initiate Blast</>}
                  </Button>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Progress: {sentCount} / {rsvps.length}</span>
                      <Button variant="ghost" onClick={() => setSentCount(0)} className="text-[8px] text-red-500 uppercase tracking-widest">Reset</Button>
                    </div>
                    <div className="max-h-[200px] overflow-y-auto space-y-2 custom-scrollbar pr-4">
                      {rsvps.map((rsvp, i) => (
                        <div key={rsvp.id} className="flex justify-between items-center p-4 bg-white/5 border border-white/5">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white">{rsvp.guest_name}</span>
                          <Button 
                            size="sm" 
                            onClick={() => sendToGuest(rsvp.guest_phone)}
                            className="bg-[#25D366] text-white text-[8px] font-black uppercase tracking-widest h-8 px-4"
                          >
                            Send
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppBlast;