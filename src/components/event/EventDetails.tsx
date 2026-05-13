"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Sparkles, Navigation, ExternalLink, Quote } from 'lucide-react';

interface EventDetailsProps {
  event: any;
  config: any;
}

const EventDetails = ({ event, config }: EventDetailsProps) => {
  return (
    <div className="space-y-16 md:space-y-24">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`${config.card} p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] border`}>
        <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-12 flex items-center gap-4">
          <Calendar className="w-4 h-4" /> The Particulars
        </h2>
        <div className="space-y-12">
          <div className="flex items-start gap-8 group">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#D4AF37]/10 transition-colors shrink-0">
              <Sparkles className="text-[#D4AF37] w-6 h-6" />
            </div>
            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-1">The Celebration</p>
              <h1 className="text-3xl md:text-5xl font-serif italic leading-tight">{event.event_name}</h1>
            </div>
          </div>
          <div className="flex items-start gap-8 group">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#D4AF37]/10 transition-colors shrink-0">
              <MapPin className="text-[#D4AF37] w-6 h-6" />
            </div>
            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-1">The Venue</p>
              <p className="text-xl md:text-3xl font-light leading-relaxed mb-2">{event.venue}</p>
              {event.venue_map_url && (
                <a 
                  href={event.venue_map_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#D4AF37] hover:underline"
                >
                  <Navigation size={10} /> View on Google Maps <ExternalLink size={8} />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {event.message && (
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative">
          <Quote className="absolute -top-4 -left-4 w-16 h-16 text-[#D4AF37]/10" />
          <div className={`${config.card} p-10 md:p-16 rounded-[2rem] md:rounded-[3rem] border italic text-xl md:text-3xl font-light leading-relaxed text-center`}>
            "{event.message}"
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EventDetails;