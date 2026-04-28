"use client";

import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
}

const QRScanner = ({ onScanSuccess, onScanError }: QRScannerProps) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true
      },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        onScanSuccess(decodedText);
      },
      (error) => {
        // Ignore "NotFoundException" as it's just the scanner searching every frame
        if (error?.includes("NotFoundException")) {
          return;
        }
        
        // Only pass real errors (like camera access denied) to the parent
        if (onScanError) onScanError(error);
      }
    );

    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear scanner", error);
        });
      }
    };
  }, [onScanSuccess, onScanError]);

  return (
    <div className="w-full max-w-md mx-auto overflow-hidden rounded-3xl border-4 border-[#D4AF37]/20 bg-black">
      <div id="qr-reader" className="w-full" />
      <div className="p-4 bg-[#1a1a2e] text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
          Align QR code within the frame
        </p>
      </div>
    </div>
  );
};

export default QRScanner;