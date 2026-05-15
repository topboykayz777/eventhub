"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, PlayCircle, Loader2 } from 'lucide-react';

interface GalleryItemProps {
  url: string;
  index: number;
  onClick: () => void;
}

const GalleryItem = ({ url, index, onClick }: GalleryItemProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const isVideo = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.quicktime'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  const video = isVideo(url);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 6) * 0.1 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="aspect-[4/5] overflow-hidden border border-white/10 cursor-pointer group relative bg-white/5"
    >
      {/* Loading Skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#D4AF37]/30" />
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <ImageIcon className="w-8 h-8 text-gray-700 mb-2" />
          <span className="text-[8px] font-bold uppercase tracking-widest text-gray-600">Media Unavailable</span>
        </div>
      )}

      {video ? (
        <div className="w-full h-full relative">
          <video 
            src={url} 
            className={`w-full h-full object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            muted 
            preload="metadata"
            onLoadedData={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
          />
          {isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
              <PlayCircle className="text-white/70 w-10 h-10" />
            </div>
          )}
        </div>
      ) : (
        <img 
          src={url} 
          loading="lazy"
          className={`w-full h-full object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          alt="" 
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      )}
    </motion.div>
  );
};

interface EventGalleryProps {
  galleryUrls: string[];
  onOpenLightbox: (index: number) => void;
}

const EventGallery = ({ galleryUrls, onOpenLightbox }: EventGalleryProps) => {
  if (!galleryUrls || galleryUrls.length === 0) return null;

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.4em] uppercase mb-2 block">The Memory Wall</span>
          <h2 className="text-3xl md:text-5xl font-serif italic">Captured <span className="text-[#D4AF37]">Moments</span></h2>
        </div>
        <div className="flex items-center gap-3 text-gray-600">
          <span className="text-[10px] font-bold uppercase tracking-widest">{galleryUrls.length} Files</span>
          <ImageIcon className="w-6 h-6" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {galleryUrls.map((url: string, i: number) => (
          <GalleryItem 
            key={`${url}-${i}`} 
            url={url} 
            index={i} 
            onClick={() => onOpenLightbox(i)} 
          />
        ))}
      </div>
    </div>
  );
};

export default EventGallery;