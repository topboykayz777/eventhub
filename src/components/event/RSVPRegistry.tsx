"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface RSVPRegistryProps {
  rsvpData: any;
  setRsvpData: (data: any) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  config: any;
}

const RSVPRegistry = ({ rsvpData, setRsvpData, isSubmitting, onSubmit, config }: RSVPRegistryProps) => {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={`${config.rsvpCard} p-12 md:p-16 rounded-[3.5rem] shadow-2xl sticky top-32 border border-black/5`}>
      <h2 className="text-3xl md:text-4xl font-serif italic tracking-tight mb-10">The Registry</h2>
      <form onSubmit={onSubmit} className="space-y-10">
        <div className="space-y-2">
          <Label className="text-[8px] font-bold uppercase tracking-widest opacity-50">Full Name</Label>
          <Input 
            required 
            className="bg-black/5 border-none h-16 rounded-none text-xl px-6" 
            placeholder="e.g. Chidi Benson" 
            value={rsvpData.name} 
            onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })} 
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[8px] font-bold uppercase tracking-widest opacity-50">WhatsApp Number</Label>
          <Input 
            required 
            className="bg-black/5 border-none h-16 rounded-none text-xl px-6" 
            placeholder="080..." 
            value={rsvpData.phone} 
            onChange={(e) => setRsvpData({ ...rsvpData, phone: e.target.value })} 
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[8px] font-bold uppercase tracking-widest opacity-50">Song Request (Optional)</Label>
          <Input 
            className="bg-black/5 border-none h-16 rounded-none text-xl px-6" 
            placeholder="Your favorite vibe..." 
            value={rsvpData.songRequest} 
            onChange={(e) => setRsvpData({ ...rsvpData, songRequest: e.target.value })} 
          />
        </div>
        <div className="flex items-center justify-between p-6 bg-black/5">
          <Label className="text-[10px] font-bold uppercase tracking-widest">Bringing a Plus One?</Label>
          <Switch 
            checked={rsvpData.hasPlusOne} 
            onCheckedChange={(v) => setRsvpData({ ...rsvpData, hasPlusOne: v })} 
          />
        </div>
        
        <AnimatePresence>
          {rsvpData.hasPlusOne && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2 overflow-hidden"
            >
              <Label className="text-[8px] font-bold uppercase tracking-widest opacity-50">Plus One Name</Label>
              <Input 
                required 
                className="bg-black/5 border-none h-16 rounded-none text-xl px-6" 
                placeholder="e.g. Sarah Benson" 
                value={rsvpData.plusOneName} 
                onChange={(e) => setRsvpData({ ...rsvpData, plusOneName: e.target.value })} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className={`w-full ${config.button} h-24 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase shadow-2xl`}
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : 'Confirm Attendance'}
        </Button>
      </form>
    </motion.div>
  );
};

export default RSVPRegistry;