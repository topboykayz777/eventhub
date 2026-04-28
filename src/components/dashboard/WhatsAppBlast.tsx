"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Play, SkipForward, Save, FileText, ArrowRight, Sparkles, Car, Camera, Gift, Shirt, Phone, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess, showError } from '@/utils/toast';

interface WhatsAppBlastProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  rsvps: any[];
}

const DEFAULT_TEMPLATES = [
  { id: 'welcome', name: 'Welcome Message', content: "Hello {{guest_name}}! We are so excited to have you join us for {{event_name}}. See you soon!" },
  { id: 'reminder', name: 'Event Reminder', content: "Hi {{guest_name}}, just a reminder that {{event_name}} is happening on {{event_date}} at {{venue}}. Can't wait!" },
  { id: 'buffet', name: 'Buffet Open', content: "Attention {{guest_name}}! The buffet is now open. Please proceed to the dining area. Enjoy!" },
  { id: 'cake', name: 'Cake Cutting', content: "Hi {{guest_name}}, we are about to cut the cake! Please join us at the main stage now." },
  { id: 'dance', name: 'First Dance', content: "The first dance is about to begin! {{guest_name}}, please join us at the dance floor." },
  { id: 'thankyou', name: 'Thank You', content: "Thank you {{guest_name}} for being part of our special day. We hope you had a wonderful time!" },
  // New templates for luxury events
  { id: 'dresscode', name: 'Dress Code', content: "Hello {{guest_name}}! Quick reminder about the dress code for {{event_name}}: [BLACK TIE/TRADITIONAL/CASUAL]. We can't wait to see you shine!" },
  { id: 'parking', name: 'Parking Info', content: "Hi {{guest_name}}, here's your parking info for {{event_name}} at {{venue}}: [PARKING DETAILS]. Valet service available!" },
  { id: 'photosession', name: 'Photo Session', content: "{{guest_name}}, the photo session for {{event_name}} begins at [TIME]. Please meet at the main entrance for group photos!" },
  { id: 'lastcall', name: 'Last Call RSVP', content: "Hi {{guest_name}}, final call to confirm your attendance for {{event_name}}! Please reply CONFIRM if you haven't already. See you there!" },
  { id: 'transport', name: 'Shuttle Service', content: "Hello {{guest_name}}! Shuttle service for {{event_name}} runs from [PICKUP POINT] to {{venue}} starting at [TIME]. See you!" },
  { id: 'afterparty', name: 'After Party', content: "The celebration continues! {{guest_name}}, join us for the after party at [LOCATION] right after {{event_name}}. Let's keep the vibes going!" },
  { id: 'giftregistry', name: 'Gift Info', content: "Hi {{guest_name}}! For those asking about gifts for {{event_name}}, here's our registry: [LINK]. Your presence is our greatest gift!" },
  { id: 'emergency', name: 'Emergency Contact', content: "{{guest_name}}, save this for {{event_name}}: Emergency contact [PHONE] - [NAME]. We're here to help throughout the celebration!" },
  { id: 'weather', name: 'Weather Update', content: "Hi {{guest_name}}! Weather update for {{event_name}} at {{venue}}: [SUNNY/RAINY/CLOUDY]. Please plan accordingly. See you soon!" },
  { id: 'program', name: 'Event Program', content: "{{guest_name}}, here's the program schedule for {{event_name}}:\n🎵 [TIME1] - Arrival & Drinks\n🍽️ [TIME2] - Dinner\n💃 [TIME3] - Dancing\nWe can't wait to celebrate with you!" },
  { id: 'specialrequest', name: 'Special Arrangement', content: "Hello {{guest_name}}! We've noted your special request for {{event_name}}. Our team will ensure everything is set up perfectly for you at {{venue}}!" },
  { id: 'vendorthankyou', name: 'Vendor Appreciation', content: "Hi {{guest_name}}! We want to thank our amazing vendors who made {{event_name}} possible. Your dedication and excellence shine through. Thank you for being part of our story!" },
  { id: 'countdown', name: 'Countdown Hype', content: "{{guest_name}}, only [X DAYS] left until {{event_name}}! The excitement is building, the venue is ready at {{venue}}, and we can't wait to celebrate with you!" },
  { id: 'plusone', name: 'Plus One Reminder', content: "Hi {{guest_name}}! Just confirming - are you bringing a plus one to {{event_name}}? Please let us know so we can prepare their seat at {{venue}}. Thank you!" },
  { id: 'livestream', name: 'Live Stream Link', content: "Can't make it {{guest_name}}? No worries! Watch {{event_name}} live at [STREAM LINK]. Join the celebration virtually at {{event_date}}. We'll miss you!" }
];

const WhatsAppBlast = ({ isOpen, onClose, event, rsvps }: WhatsAppBlastProps) => {
  const [message, setMessage] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLooping, setIsLooping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(rsvps.map(r => r.id));
      setIsLooping(false);
      setCurrentIndex(0);
      const saved = localStorage.getItem('eventhub_wa_templates');
      if (saved) setTemplates([...DEFAULT_TEMPLATES, ...JSON.parse(saved)]);
    }
  }, [isOpen, rsvps]);

  const formatPhone = (phone: string) => {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) cleaned = '234' + cleaned.substring(1);
    if (cleaned.length === 10) cleaned = '234' + cleaned;
    return cleaned;
  };

  const replaceVariables = (content: string, guest: any) => {
    return content
      .replace(/{{guest_name}}/g, guest.guest_name)
      .replace(/{{event_name}}/g, event.event_name)
      .replace(/{{event_date}}/g, new Date(event.event_date).toLocaleDateString())
      .replace(/{{venue}}/g, event.venue);
  };

  const handleSaveTemplate = () => {
    if (!message.trim()) return;
    const name = prompt("Enter template name:");
    if (!name) return;
    const newTemplate = { id: Date.now().toString(), name, content: message };
    const updated = [...templates, newTemplate];
    setTemplates(updated);
    const customOnly = updated.filter(t => !DEFAULT_TEMPLATES.some(dt => dt.id === t.id));
    localStorage.setItem('eventhub_wa_templates', JSON.stringify(customOnly));
    showSuccess("Template saved to library.");
  };

  const selectedGuests = rsvps.filter(r => selectedIds.includes(r.id));
  const currentGuest = selectedGuests[currentIndex];

  const sendAndNext = () => {
    if (!currentGuest) return;
    const personalizedMessage = replaceVariables(message, currentGuest);
    const formattedPhone = formatPhone(currentGuest.guest_phone);
    const text = encodeURIComponent(`${personalizedMessage}\n\nView Event: ${window.location.origin}/event/${event.slug}`);
    window.open(`https://api.whatsapp.com/send?phone=${formattedPhone}&text=${text}`, '_blank');
    if (currentIndex < selectedGuests.length - 1) setCurrentIndex(prev => prev + 1);
    else {
      showSuccess("Blast Sequence Complete!");
      setIsLooping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-6">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-3xl w-full bg-[#0f0f0f] border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-8 shrink-0">
              <div>
                <span className="text-[#25D366] text-[10px] font-bold tracking-[0.4em] uppercase block mb-2">Mass Communication</span>
                <h3 className="text-2xl md:text-3xl font-serif italic text-white">WhatsApp Blast</h3>
              </div>
              <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all"><X size={20} /></button>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
              {!isLooping ? (
                <div className="space-y-10">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Template Library</Label>
                        <button onClick={handleSaveTemplate} className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37] flex items-center gap-2"><Save size={12} /> Save Current</button>
                      </div>
                      <Select onValueChange={(v) => {
                        const template = templates.find(t => t.id === v);
                        if (template) setMessage(template.content);
                      }}>
                        <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-none"><SelectValue placeholder="Select a template" /></SelectTrigger>
                        <SelectContent className="bg-[#1a1a1a] border-white/10 text-white max-h-[300px]">
                          <div className="px-2 py-1 text-[8px] font-bold uppercase tracking-widest text-gray-500">Default Templates</div>
                          {DEFAULT_TEMPLATES.map(t => (
                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                          ))}
                          {templates.length > DEFAULT_TEMPLATES.length && (
                            <>
                              <div className="px-2 py-1 text-[8px] font-bold uppercase tracking-widest text-gray-500 mt-2">Custom Templates</div>
                              {templates.filter(t => !DEFAULT_TEMPLATES.some(dt => dt.id === t.id)).map(t => (
                                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                              ))}
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Variables</Label>
                      <div className="flex flex-wrap gap-2">
                        {['guest_name', 'event_name', 'event_date', 'venue'].map(v => (
                          <button key={v} onClick={() => setMessage(prev => prev + ` {{${v}}}`)} className="px-3 py-1.5 bg-white/5 border border-white/10 text-[8px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all">{v.replace('_', ' ')}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Message Content</Label>
                    <Textarea 
                      placeholder="Compose your message... Use {{guest_name}}, {{event_name}}, etc. for personalization." 
                      className="min-h-[180px] bg-white/5 border-white/10 rounded-none focus:border-[#25D366]/50 text-lg font-light resize-none" 
                      value={message} 
                      onChange={(e) => setMessage(e.target.value)} 
                    />
                    <p className="text-[8px] text-gray-500 uppercase tracking-widest">
                      Tip: Use [BRACKETS] for details you'll fill in manually for each guest
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Recipients ({selectedIds.length})</Label>
                      <button onClick={() => setSelectedIds(selectedIds.length === rsvps.length ? [] : rsvps.map(r => r.id))} className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">{selectedIds.length === rsvps.length ? 'Deselect All' : 'Select All'}</button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                      {rsvps.map((rsvp) => (
                        <div 
                          key={rsvp.id} 
                          onClick={() => setSelectedIds(prev => prev.includes(rsvp.id) ? prev.filter(i => i !== rsvp.id) : [...prev, rsvp.id])} 
                          className={`p-4 border cursor-pointer transition-all ${selectedIds.includes(rsvp.id) ? 'bg-[#25D366]/10 border-[#25D366]/30' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                        >
                          <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1 ${selectedIds.includes(rsvp.id) ? 'text-white' : 'text-gray-500'}`}>{rsvp.guest_name}</p>
                          <p className="text-[8px] text-gray-600 font-mono">{rsvp.guest_phone}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-full bg-white/5 h-1.5 mb-16 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-[#25D366] h-full shadow-[0_0_15px_rgba(37,211,102,0.5)]" 
                      initial={{ width: 0 }} 
                      animate={{ width: `${((currentIndex + 1) / selectedGuests.length) * 100}%` }} 
                    />
                  </div>
                  <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block">Guest {currentIndex + 1} of {selectedGuests.length}</span>
                  <h2 className="text-5xl md:text-7xl font-serif italic text-white mb-6">{currentGuest?.guest_name}</h2>
                  <div className="glass-premium p-10 mb-16 max-w-xl w-full text-left border-[#25D366]/20">
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#25D366] mb-4 flex items-center gap-2"><FileText size={12} /> Preview Message</p>
                    <p className="text-lg font-light text-gray-300 leading-relaxed italic">"{replaceVariables(message, currentGuest)}"</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-10 shrink-0">
              {!isLooping ? (
                <Button 
                  onClick={() => { if (!message.trim() || selectedIds.length === 0) return; setIsLooping(true); }} 
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase shadow-2xl shadow-[#25D366]/10"
                >
                  <Play className="w-4 h-4 mr-2" /> Initialize Blast Sequence
                </Button>
              ) : (
                <div className="grid grid-cols-4 gap-6">
                  <Button variant="outline" onClick={() => setIsLooping(false)} className="col-span-1 border-white/10 bg-white/5 text-white py-10 rounded-none text-[10px] font-bold tracking-[0.2em] uppercase">Abort</Button>
                  <Button onClick={sendAndNext} className="col-span-2 bg-[#25D366] hover:bg-[#128C7E] text-white py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase">Send & Next <ArrowRight className="ml-2 w-4 h-4" /></Button>
                  <Button variant="ghost" onClick={() => currentIndex < selectedGuests.length - 1 && setCurrentIndex(prev => prev + 1)} className="col-span-1 text-gray-500 hover:text-white py-10 rounded-none text-[10px] font-bold tracking-[0.2em] uppercase">Skip <SkipForward className="ml-2 w-3 h-3" /></Button>
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