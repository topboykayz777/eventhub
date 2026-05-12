"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import QRScanner from '@/components/QRScanner';

interface QRScannerOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (id: string) => void;
}

const QRScannerOverlay = ({ isOpen, onClose, onScan }: QRScannerOverlayProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-6 overflow-y-auto"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="max-w-md w-full bg-[#0f0f0f] border border-white/10 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-2xl my-auto flex flex-col max-h-[90vh]"
          >
            <div className="flex justify-between items-center mb-6 md:mb-8 shrink-0">
              <h3 className="text-xl md:text-2xl font-serif italic text-white">Guest Check-in</h3>
              <button onClick={onClose} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all"><X size={20} /></button>
            </div>
            
            <QRScanner 
              onScanSuccess={(id) => {
                onScan(id);
                onClose();
              }} 
            />
            
            <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-white/5 space-y-6">
              <div className="text-center">
                <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-4">Manual Entry</p>
                <div className="flex gap-2 md:gap-3">
                  <Input 
                    id="manual-rsvp"
                    placeholder="Enter RSVP ID" 
                    className="bg-white/5 border-white/10 h-12 md:h-14 rounded-none text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const input = document.getElementById('manual-rsvp') as HTMLInputElement;
                        if (input) onScan(input.value);
                        onClose();
                      }
                    }}
                  />
                  <Button onClick={() => { const input = document.getElementById('manual-rsvp') as HTMLInputElement; if (input) onScan(input.value); onClose(); }} className="bg-[#D4AF37] text-black rounded-none h-12 md:h-14 px-6 md:px-8 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em]">
                    Verify
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QRScannerOverlay;