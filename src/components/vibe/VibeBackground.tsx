"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VibeBackgroundProps {
  mediaUrls: string[];
  fallbackUrl: string;
}

const VibeBackground = ({ mediaUrls, fallbackUrl }: VibeBackgroundProps) => {
  const [index, setIndex] = useState(0);
  const items = mediaUrls.length > 0 ? mediaUrls : [fallbackUrl];

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [items.length]);

  const isVideo = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.quicktime'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={items[index]}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full gpu-accelerated"
        >
          {isVideo(items[index]) ? (
            <video 
              src={items[index]} 
              autoPlay 
              muted 
              loop 
              playsInline 
              preload="auto"
              className="w-full h-full object-cover gpu-accelerated"
              style={{ transform: 'translate3d(0,0,0)' }}
            />
          ) : (
            <motion.img 
              src={items[index]} 
              className="w-full h-full object-cover gpu-accelerated"
              animate={{ 
                scale: [1, 1.05],
              }}
              transition={{ 
                duration: 10, 
                ease: "linear",
                repeat: Infinity,
                repeatType: "reverse"
              }}
              style={{ transform: 'translate3d(0,0,0)' }}
            />
          )}
        </motion.div>
      </AnimatePresence>
      {/* Cinematic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
    </div>
  );
};

export default VibeBackground;