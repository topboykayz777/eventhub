"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Loader2, Camera, CameraOff, Image as ImageIcon, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { showError } from '@/utils/toast';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
}

const QRScanner = ({ onScanSuccess, onScanError }: QRScannerProps) => {
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const qrCodeInstance = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const startScanner = async () => {
      try {
        if (qrCodeInstance.current) {
          await qrCodeInstance.current.stop().catch(() => {});
        }

        const html5QrCode = new Html5Qrcode("qr-reader-container");
        qrCodeInstance.current = html5QrCode;

        const config = { fps: 10, qrbox: { width: 250, height: 250 } };

        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            html5QrCode.stop().then(() => {
              onScanSuccess(decodedText);
            }).catch(err => console.error("Stop error", err));
          },
          () => {}
        );
        
        setIsCameraReady(true);
      } catch (err: any) {
        console.error("Scanner Start Error:", err);
        setError(err.message || "Could not access camera.");
        if (onScanError) onScanError(err.message);
      }
    };

    const timer = setTimeout(startScanner, 500);

    return () => {
      clearTimeout(timer);
      if (qrCodeInstance.current && qrCodeInstance.current.isScanning) {
        qrCodeInstance.current.stop().catch(err => console.error("Cleanup error", err));
      }
    };
  }, [onScanSuccess, onScanError]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingImage(true);
    try {
      const html5QrCode = new Html5Qrcode("qr-reader-container");
      const result = await html5QrCode.scanFileV2(file, false);
      if (result && result.decodedText) {
        onScanSuccess(result.decodedText);
      } else {
        showError("No QR code found in this image.");
      }
    } catch (err) {
      showError("Could not read QR code from image.");
    } finally {
      setIsProcessingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="w-full max-w-md mx-auto overflow-hidden rounded-[2.5rem] border-4 border-[#D4AF37]/20 bg-black relative aspect-square">
        <div id="qr-reader-container" className="w-full h-full" />
        
        {!isCameraReady && !error && !isProcessingImage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
            <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37] mb-4" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Initializing Lens...</p>
          </div>
        )}

        {isProcessingImage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37] mb-4" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Analyzing Image...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10 p-8 text-center">
            <CameraOff className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-2">Camera Access Denied</p>
            <p className="text-[8px] text-gray-500 uppercase tracking-widest">{error}</p>
          </div>
        )}

        {isCameraReady && (
          <div className="absolute bottom-6 left-0 right-0 text-center z-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white">Lens Active</span>
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
        <Button 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-white/10 bg-white/5 text-white rounded-none h-14 text-[10px] font-bold uppercase tracking-[0.2em]"
        >
          <ImageIcon className="w-4 h-4 mr-2" /> Scan from Gallery
        </Button>
      </div>
    </div>
  );
};

export default QRScanner;