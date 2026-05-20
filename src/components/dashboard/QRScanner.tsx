"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, X, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QRScannerProps {
  eventId: string;
}

const QRScanner = ({ eventId }: QRScannerProps) => {
  const navigate = useNavigate();
  const [active, setActive] = React.useState(false);

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center bg-black/40 border border-white/10 rounded-[3rem] p-12 relative overflow-hidden">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 p-3 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all z-20 group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
      </button>

      <div className="absolute inset-0 bg-[#D4AF37]/5 pointer-events-none" />
      
      {!active ? (
        <div className="text-center relative z-10">
          <div className="w-24 h-24 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#D4AF37]/20">
            <Camera size={40} className="text-[#D4AF37]" />
          </div>
          <h2 className="text-2xl font-serif italic text-white mb-4">Ready to Verify?</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-12 max-w-sm mx-auto leading-relaxed">
            Scan guest entry passes to instantly validate identity and track live attendance.
          </p>
          <Button 
            onClick={() => setActive(true)}
            className="bg-[#D4AF37] hover:bg-[#B8962E] text-black font-black uppercase tracking-[0.3em] text-[10px] px-12 py-7 rounded-2xl"
          >
            Activate Camera
          </Button>
        </div>
      ) : (
        <div className="w-full max-w-md relative z-10">
          <div className="aspect-square bg-black border-2 border-dashed border-[#D4AF37]/50 rounded-[2rem] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4AF37]/10 to-transparent animate-scan" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">Scanning for Passes...</p>
            
            <button 
              onClick={() => setActive(false)}
              className="absolute top-4 right-4 p-2 bg-black/60 rounded-full text-white hover:bg-black"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-center mt-8 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            Position the QR code within the frame
          </p>
        </div>
      )}
    </div>
  );
};

export default QRScanner;