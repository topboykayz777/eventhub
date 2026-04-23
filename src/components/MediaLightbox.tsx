"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';

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

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = mediaUrls[currentIndex];
    link.download = `event_media_${currentIndex}`;
    link.target = "_blank";
    link.click();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10"
        >
          {/* Controls */}
          <div className="absolute top-6 right-6 flex items-center gap-4 z-[210]">
            <button 
              onClick={handleDownload}
              className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all"
              title="Download Original"
            >
              <Download size={20} />
            </button>
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all"
            >
              <X size={24} />
            </button>
          </div>

          {mediaUrls.length > 1 && (
            <>
              <button 
                onClick={() => onNavigate((currentIndex - 1 + mediaUrls.length) % mediaUrls.length)}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all z-[210]"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => onNavigate((currentIndex + 1) % mediaUrls.length)}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all z-[210]"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Media Content */}
          <motion.div 
            key={currentIndex}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative max-w-5xl w-full max-h-full flex items-center justify-center"
          >
            {isVideo(mediaUrls[currentIndex]) ? (
              <video 
                src={mediaUrls[currentIndex]} 
                controls 
                autoPlay 
                className="max-w-full max-h-[80vh] shadow-2xl"
              />
            ) : (
              <img 
                src={mediaUrls[currentIndex]} 
                className="max-w-full max-h-[80vh] object-contain shadow-2xl"
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