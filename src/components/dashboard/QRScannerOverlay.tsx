"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ScanLine } from 'lucide-react';
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
          className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-2xl flex flex-col"
        >
          {/* Navigation Header */}
          <div className="p-6 md:p-8 flex items-center justify-between border-b border-white/5 bg-black/40">
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="text-gray-400 hover:text-white rounded-full h-12 px-6 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> 
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Button>
            
            <div className="flex items-center gap-3">
              <ScanLine className="text-[#D4AF37] w-5 h-5" />
              <span className="text-white text-[10px] font-black uppercase tracking-[0.4em]">Entry Verification</span>
            </div>

            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-white rounded-full w-12 h-12"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col items-center justify-center">
            <div className="max-w-md w-full space-y-12">
              <div className="text-center">
                <h3 className="text-3xl md:text-4xl font-serif italic text-white mb-2">Guest Check-in</h3>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.3em]">Align the guest QR pass within the scanning frame</p>
              </div>
              
              <QRScanner 
                onScanSuccess={(id) => {
                  onScan(id);
                  onClose();
                }} 
              />
              
              <div className="pt-8 border-t border-white/5 text-center">
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-600 mb-6">Manual Registry Entry</p>
                <div className="flex gap-4">
                  <Input 
                    placeholder="Enter Pass ID..." 
                    className="bg-white/5 border-white/10 rounded-none h-16 text-lg font-light placeholder:text-gray-800 focus-visible:ring-[#D4AF37]/30"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onScan(e.currentTarget.value);
                        onClose();
                      }
                    }}
                  />
                  <Button className="bg-[#D4AF37] text-black rounded-none h-16 px-10 text-[10px] font-black uppercase tracking-widest">
                    Verify
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QRScannerOverlay;