"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, PlayCircle } from 'lucide-react';

interface EventGalleryProps {
  galleryUrls: string[];
  onOpenLightbox: (index: number) => void;
}

const EventGallery = ({ galleryUrls, onOpenLightbox }: EventGalleryProps) => {
  const isVideo = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.quicktime'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  if (!galleryUrls || galleryUrls.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <div className="flex justify-between items-end mb-12">
        <div>
          <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.4em] uppercase mb-2 block">The Memory Wall</span>
          <h2 className="text-3xl md:text-5xl font-serif italic">Captured <span className="text-[#D4AF37]">Moments</span></h2>
        </div>
        <ImageIcon className="text-gray-600 w-8 h-8" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {galleryUrls.map((url: string, i: number) => (
          <motion.div 
            key={i} 
            whileHover={{ scale: 1.02 }}
            onClick={() => onOpenLightbox(i)}
            className="aspect-[4/5] overflow-hidden border border-white/10 cursor-pointer group relative"
          >
            {isVideo(url) ? (
              <div className="w-full h-full relative">
                <video src={url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" muted />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <PlayCircle className="text-white/70 w-10 h-10" />
                </div>
              </div>
            ) : (
              <img src={url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default EventGallery;