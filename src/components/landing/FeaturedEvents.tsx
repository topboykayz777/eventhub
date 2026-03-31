"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Calendar, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DEFAULT_FEATURED = [
  {
    id: 'f1',
    event_name: 'The Grand Lagos Gala',
    slug: 'lagos-gala-2025',
    venue: 'Eko Hotel & Suites',
    event_date: '2025-12-15',
    photo_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80'
  },
  {
    id: 'f2',
    event_name: 'Afolayan Wedding',
    slug: 'afolayan-wedding-2026',
    venue: 'The Monarch Event Center',
    event_date: '2026-01-20',
    photo_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80'
  },
  {
    id: 'f3',
    event_name: 'Heritage Night',
    slug: 'heritage-night-2026',
    venue: 'Transcorp Hilton, Abuja',
    event_date: '2026-03-10',
    photo_url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80'
  }
];

const FeaturedEvents = () => {
  const { data: featuredEvents, isLoading } = useQuery({
    queryKey: ['featured-events'],
    queryFn: async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('is_featured', true)
        .limit(3);
      return data && data.length > 0 ? data : DEFAULT_FEATURED;
    }
  });

  if (isLoading) return null;

  return (
    <section className="py-32 px-6 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div>
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">Spotlight</span>
            <h2 className="text-4xl md:text-6xl font-serif italic text-white">Featured <span className="text-[#D4AF37]">Celebrations</span></h2>
          </div>
          <Link to="/signup" className="w-full md:w-auto">
            <Button variant="link" className="text-[#D4AF37] text-[10px] font-bold tracking-[0.2em] uppercase p-0">
              Promote Your Event <ArrowRight className="ml-2 w-3 h-3" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {(featuredEvents || DEFAULT_FEATURED).map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative"
            >
              <Link to={`/event/${event.slug}`}>
                <div className="aspect-[4/5] overflow-hidden border border-white/10 relative">
                  <img 
                    src={event.photo_url} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                    alt={event.event_name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  <div className="absolute top-6 right-6 bg-[#D4AF37] text-black px-3 py-1 text-[8px] font-black tracking-[0.2em] uppercase flex items-center gap-2">
                    <Sparkles className="w-3 h-3 fill-current" /> Featured
                  </div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-2xl font-serif italic text-white mb-4">{event.event_name}</h3>
                    <div className="flex flex-col gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                      <div className="flex items-center gap-2"><Calendar className="w-3 h-3 text-[#D4AF37]" /> {new Date(event.event_date).toLocaleDateString()}</div>
                      <div className="flex items-center gap-2"><MapPin className="w-3 h-3 text-[#D4AF37]" /> {event.venue}</div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;