"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Users, CheckCircle2, Loader2, MessageSquare, CheckSquare, Square, Copy, Check } from 'lucide-react';
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
  const [isInitiated, setIsInitiated] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(rsvps.map(r => r.id));
      setIsInitiated(false);
    }
  }, [isOpen, rsvps]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === rsvps.length) setSelectedIds([]);
    else setSelectedIds(rsvps.map(r => r.id));
  };

  const handleInitiate = () => {
    if (!message.trim()) {
      showError("Please enter a message.");
      return;
    }
    if (selectedIds.length === 0) {
      showError("Please select at least one guest.");
      return;
    }
    setIsInitiated(true);
    showSuccess("Blast sequence ready.");
  };

  const copyAllNumbers = () => {
    const selectedGuests = rsvps.filter(r => selectedIds.includes(r.id));
    const numbers = selectedGuests.map(r => r.guest_phone).join(', ');
    navigator.clipboard.writeText(numbers);
    setCopied(true);
    showSuccess("All numbers copied. You can now paste them into a WhatsApp Broadcast List.");
    setTimeout(() => setCopied(false), 3000);
  };

  const copyMessage = () => {
    const fullMessage = `${message}\n\nView Event: ${window.location.origin}/event/${event.slug}`;
    navigator.clipboard.writeText(fullMessage);
    showSuccess("Message copied to clipboard.");
  };

  const sendToGuest = (phone: string) => {
    const text = encodeURIComponent(`${message}\n\nView Event: ${window.location.origin}/event/${event.slug}`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const selectedGuests = rsvps.filter(r => selectedIds.includes(r.id));

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

            <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 space-y-8">
              {!isInitiated ? (
                <>
                  <div className="bg-[#25D366]/5 border border-[#25D366]/20 p-6 mb-8">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#25D366] mb-2">Pro Tip: Instant Blasting</p>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      To message everyone at once, use the **"Copy All Numbers"** button below, then paste them into a **WhatsApp Broadcast List**.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Your Message</Label>
                    <Textarea 
                      placeholder="e.g. The Buffet is now open! Please proceed to the dining hall."
                      className="min-h-[120px] bg-white/5 border-white/10 rounded-none focus:border-[#25D366]/50 text-lg font-light resize-none"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Select Recipients ({selectedIds.length})</Label>
                      <button 
                        onClick={toggleSelectAll}
                        className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37] hover:opacity-70"
                      >
                        {selectedIds.length === rsvps.length ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                    
                    <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                      {rsvps.map((rsvp) => (
                        <div 
                          key={rsvp.id} 
                          onClick={() => toggleSelect(rsvp.id)}
                          className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${
                            selectedIds.includes(rsvp.id) ? 'bg-[#25D366]/10 border-[#25D366]/30' : 'bg-white/5 border-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            {selectedIds.includes(rsvp.id) ? <CheckSquare className="w-4 h-4 text-[#25D366]" /> : <Square className="w-4 h-4 text-gray-600" />}
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white">{rsvp.guest_name}</span>
                          </div>
                          <span className="text-[8px] text-gray-500 font-mono">{rsvp.guest_phone}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="bg-[#25D366]/5 border border-[#25D366]/20 p-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#25D366] mb-2">Blast Sequence Active</p>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Click "Send" for each guest to open a pre-filled chat. This is the safest way to avoid WhatsApp spam filters.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    {selectedGuests.map((rsvp) => (
                      <div key={rsvp.id} className="flex justify-between items-center p-4 bg-white/5 border border-white/5">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-white">{rsvp.guest_name}</p>
                          <p className="text-[8px] text-gray-500">{rsvp.guest_phone}</p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => sendToGuest(rsvp.guest_phone)}
                          className="bg-[#25D366] hover:bg-[#128C7E] text-white text-[8px] font-black uppercase tracking-widest h-10 px-6"
                        >
                          Send
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-8 shrink-0 space-y-4">
              {!isInitiated ? (
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={copyAllNumbers}
                    variant="outline"
                    className="border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] py-8 rounded-none text-[10px] font-bold tracking-[0.2em] uppercase"
                  >
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    Copy All Numbers
                  </Button>
                  <Button 
                    onClick={handleInitiate}
                    className="bg-[#25D366] hover:bg-[#128C7E] text-white py-8 rounded-none text-[10px] font-bold tracking-[0.2em] uppercase"
                  >
                    Personal Sequence
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline"
                    onClick={() => setIsInitiated(false)}
                    className="border-white/10 bg-white/5 text-white py-8 rounded-none text-[10px] font-bold tracking-[0.2em] uppercase"
                  >
                    Back to Edit
                  </Button>
                  <Button 
                    onClick={copyMessage}
                    className="bg-[#D4AF37] text-black py-8 rounded-none text-[10px] font-bold tracking-[0.2em] uppercase"
                  >
                    Copy Message
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