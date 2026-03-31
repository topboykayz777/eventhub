"use client";

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { CheckCircle2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TicketQRProps {
  reference: string;
  email: string;
}

const TicketQR = ({ reference, email }: TicketQRProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-8 rounded-[2.5rem] text-center shadow-2xl border-4 border-[#D4AF37]"
    >
      <div className="bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="text-green-500 w-8 h-8" />
      </div>
      
      <h2 className="text-2xl font-serif italic text-black mb-2">VIP Access Granted</h2>
      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-8">Reference: {reference}</p>
      
      <div className="bg-gray-50 p-6 rounded-3xl inline-block mb-8 border-2 border-dashed border-gray-200">
        <QRCodeSVG value={reference} size={180} />
      </div>
      
      <div className="space-y-4">
        <p className="text-xs text-gray-600 font-medium">A confirmation has been sent to<br/><span className="font-bold text-black">{email}</span></p>
        <Button className="w-full bg-black text-white rounded-none py-6 text-[10px] font-bold uppercase tracking-widest">
          <Download className="w-4 h-4 mr-2" /> Save to Wallet
        </Button>
      </div>
    </motion.div>
  );
};

export default TicketQR;