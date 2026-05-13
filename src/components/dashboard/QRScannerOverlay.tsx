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
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
        >
          <div className="max-w-md w-full">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-2xl font-serif italic text-white">Guest Check-in</h3>
              <button 
                onClick={onClose}
                className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all"
              >
                <X size={24} />
              </button>
            </div>
            
            <QRScanner 
              onScanSuccess={(id) => {
                onScan(id);
                onClose();
              }} 
            />
            
            <div className="mt-12 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-4">Manual Entry</p>
              <div className="flex gap-4">
                <Input 
                  placeholder="Enter RSVP ID" 
                  className="bg-white/5 border-white/10 rounded-none h-14 text-[10px] font-bold uppercase tracking-[0.2em]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onScan(e.currentTarget.value);
                      onClose();
                    }
                  }}
                />
                <Button className="bg-[#D4AF37] text-black rounded-none h-14 px-8 text-[10px] font-bold uppercase tracking-[0.2em]">
                  Verify
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QRScannerOverlay;