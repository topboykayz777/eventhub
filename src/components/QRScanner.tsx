"use client";

import React, { useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Loader2, Camera, Image as ImageIcon, Zap, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { showError } from '@/utils/toast';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
}

const QRScanner = ({ onScanSuccess, onScanError }: QRScannerProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      // We create a temporary container-less instance for file-based decoding
      const html5QrCode = new Html5Qrcode("qr-file-decoder-dummy");
      
      const result = await html5QrCode.scanFileV2(file, false);
      
      if (result && result.decodedText) {
        onScanSuccess(result.decodedText);
      } else {
        showError("The lens couldn't find a legitimate pass. Try zooming in more.");
      }
    } catch (err: any) {
      console.error("Decoding Error:", err);
      showError("Optical Error: Ensure the QR code is clear and not obstructed.");
      if (onScanError) onScanError(err.toString());
    } finally {
      setIsProcessing(false);
      // Reset inputs so the same file can be captured again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      {/* Hidden dummy element required by the library for initialization */}
      <div id="qr-file-decoder-dummy" className="hidden" />

      <div className="w-full max-w-md mx-auto relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37]/20 to-transparent rounded-[3rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <div className="relative aspect-square rounded-[3rem] border-2 border-white/10 bg-white/[0.02] backdrop-blur-3xl overflow-hidden flex flex-col items-center justify-center p-12 text-center shadow-2xl">
          {isProcessing ? (
            <div className="space-y-6">
              <Loader2 className="w-16 h-16 animate-spin text-[#D4AF37] mx-auto" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Analyzing Optics</p>
                <p className="text-[8px] text-gray-500 uppercase tracking-widest mt-2">Extracting High-Res Data...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="w-24 h-24 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto border border-[#D4AF37]/20 group-hover:scale-110 transition-transform duration-500">
                <Camera className="text-[#D4AF37] w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-serif italic text-white mb-3">Hardware Capture</h3>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[200px] mx-auto">
                  Uses native autofocus & zoom for small or distant registry passes.
                </p>
              </div>
            </div>
          )}
          
          {/* Animated corner accents */}
          <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-[#D4AF37]/30 rounded-tl-xl" />
          <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-[#D4AF37]/30 rounded-tr-xl" />
          <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-[#D4AF37]/30 rounded-bl-xl" />
          <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-[#D4AF37]/30 rounded-br-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* The Native Camera Trigger */}
        <input 
          type="file" 
          accept="image/*" 
          capture="environment" // This attribute triggers the native camera app on mobile
          className="hidden" 
          ref={fileInputRef}
          onChange={(e) => handleCapture(e)}
        />
        <Button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black h-20 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl group transition-all"
        >
          <Zap className="w-4 h-4 mr-3 group-hover:scale-125 transition-transform" /> 
          Launch Native Scanner
        </Button>

        <div className="flex gap-4">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={galleryInputRef}
            onChange={(e) => handleCapture(e, true)}
          />
          <Button 
            variant="outline" 
            onClick={() => galleryInputRef.current?.click()}
            disabled={isProcessing}
            className="flex-1 border-white/10 bg-white/5 text-white h-14 rounded-2xl text-[9px] font-bold uppercase tracking-[0.2em]"
          >
            <ImageIcon className="w-3 h-3 mr-2" /> Gallery
          </Button>
          
          <div className="flex-1 flex items-center justify-center gap-2 px-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
            <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Verified AI</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;