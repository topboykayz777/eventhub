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
          try {
            await qrCodeInstance.current.stop();
          } catch (e) {}
        }

        const html5QrCode = new Html5Qrcode("qr-reader-container");
        qrCodeInstance.current = html5QrCode;

        const config = { 
          fps: 30, // Maximum frame processing
          // By NOT defining qrbox, the engine scans the ENTIRE viewable area
          // This allows tiny codes anywhere in the frame to be picked up instantly.
          aspectRatio: 1.0,
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true // Uses native OS hardware acceleration
          },
          videoConstraints: {
            facingMode: "environment",
            // We request high detail so the AI can see modules of distant codes
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };

        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            // Instant capture and stop
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
        {/* Full-frame container for maximum sensitivity */}
        <div id="qr-reader-container" className="w-full h-full [&_video]:object-cover" />
        
        {/* Modern scanning line animation to show it's active */}
        {isCameraReady && (
          <div className="absolute inset-0 pointer-none overflow-hidden rounded-[2.2rem]">
            <div className="w-full h-[2px] bg-[#D4AF37] absolute top-0 animate-[scan_3s_linear_infinite] opacity-50 shadow-[0_0_15px_#D4AF37]" />
          </div>
        )}

        {!isCameraReady && !error && !isProcessingImage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
            <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37] mb-4" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Opening Gate...</p>
          </div>
        )}

        {isProcessingImage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37] mb-4" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Verifying Pass...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10 p-8 text-center">
            <CameraOff className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-2">Camera Access Denied</p>
            <p className="text-[8px] text-gray-500 uppercase tracking-widest">{error}</p>
          </div>
        )}
      </div>

      <div className="text-center px-4">
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
          <ImageIcon className="w-4 h-4 mr-2" /> Select from Gallery
        </Button>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}} />
    </div>
  );
};

export default QRScanner;