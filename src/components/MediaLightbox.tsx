"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ArrowDown } from 'lucide-react';

interface MediaLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrls: string[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

const MediaLightbox = ({ isOpen, onClose, mediaUrls, currentIndex, onNavigate }: MediaLightboxProps) => {
  const isVideo = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Click backdrop to close
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 md:p-10 cursor-pointer select-none"
        >
          {/* Top Helper Instruction */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 pointer-events-none flex items-center gap-2">
            <ArrowDown size={10} className="animate-bounce" /> Swipe up/down or tap background to close
          </div>

          {/* Close Button */}
          <div className="absolute top-6 right-6 flex items-center gap-4 z-[210]">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation Controls */}
          {mediaUrls.length > 1 && (
            <>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate((currentIndex - 1 + mediaUrls.length) % mediaUrls.length);
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all z-[210] cursor-pointer"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate((currentIndex + 1) % mediaUrls.length);
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all z-[210] cursor-pointer"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Media Content with Drag-to-Dismiss */}
          <motion.div 
            key={currentIndex}
            initial={{ scale: 0.9, opacity: 0, y: 0 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.6}
            onDragEnd={(event, info) => {
              // If dragged up or down past threshold, close the lightbox
              if (Math.abs(info.offset.y) > 120) {
                onClose();
              }
            }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the media itself
            className="relative max-w-5xl w-full max-h-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
          >
            {isVideo(mediaUrls[currentIndex]) ? (
              <video 
                src={mediaUrls[currentIndex]} 
                controls 
                autoPlay 
                className="max-w-full max-h-[75vh] shadow-2xl rounded-2xl pointer-events-auto"
              />
            ) : (
              <img 
                src={mediaUrls[currentIndex]} 
                className="max-w-full max-h-[75vh] object-contain shadow-2xl rounded-2xl pointer-events-none"
                alt="Event Media"
              />
            )}
            
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">
              {currentIndex + 1} / {mediaUrls.length}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MediaLightbox;