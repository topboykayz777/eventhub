"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Sparkles, Users, Coins, Calendar, MapPin, Search, Award, Flame, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';

const CelebrationWall = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // SEO & AIO Semantic Injection
  useEffect(() => {
    document.title = "The Hall of Celebrations | Live Owambe & Event Gallery | EventHub NG";
    
    // Inject CollectionPage Schema for AI Search Engines
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "The Hall of Celebrations",
      "description": "A live, public showcase of Nigeria's most prestigious weddings, galas, and elite celebrations orchestrated on EventHub NG.",
      "url": "https://www.theeventhub.com.ng/celebrations",
      "publisher": {
        "@type": "Organization",
        "name": "EventHub NG",
        "logo": "https://www.theeventhub.com.ng/hub-icon.png"
      }
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Helper to generate a deterministic offset based on event ID
  const getDeterministicOffset = (id: string, max: number) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % max;
  };

  // Fetch public events with aggregated stats
  const { data: publicEvents = [], isLoading } = useQuery({
    queryKey: ['public-celebrations'],
    queryFn: async () => {
      // Fetch paid/public events
      const { data: eventsData, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_paid', true)
        .order('event_date', { ascending: false });

      if (error) throw error;
      if (!eventsData) return [];

      // Fetch RSVPs and Budget Items to aggregate stats
      const { data: allRSVPs } = await supabase.from('rsvps').select('id, event_id');
      const { data: allBudget } = await supabase.from('budget_items').select('event_id, amount, type, status').eq('status', 'approved');

      const rsvpsByEvent = (allRSVPs || []).reduce((acc: any, r: any) => {
        acc[r.event_id] = (acc[r.event_id] || 0) + 1;
        return acc;
      }, {});

      const spraysByEvent = (allBudget || []).reduce((acc: any, b: any) => {
        if (b.type === 'income') {
          acc[b.event_id] = (acc[b.event_id] || 0) + b.amount;
        }
        return acc;
      }, {});

      // Calculate thresholds based on spray totals
      const sortedSprays = eventsData
        .map(e => spraysByEvent[e.id] || 0)
        .sort((a, b) => a - b);

      const totalCount = sortedSprays.length;
      const p85Index = Math.floor(totalCount * 0.85);
      const p98Index = Math.floor(totalCount * 0.98);

      const p85Threshold = sortedSprays[p85Index] || 0;
      const p98Threshold = sortedSprays[p98Index] || 0;

      return eventsData.map(event => {
        const realCount = rsvpsByEvent[event.id] || 0;
        const sprayTotal = spraysByEvent[event.id] || 0;
        const offset = getDeterministicOffset(event.id, 1000);
        
        let extraGuests = 0;

        if (sprayTotal === 0) {
          // No money sprayed -> bottom 85% (under 120 guests)
          extraGuests = 15 + (offset % 101); // 15 to 115
        } else if (p98Threshold > 0 && sprayTotal >= p98Threshold) {
          // Top 2% of sprayers -> top tier (crossing 250 guests)
          extraGuests = 250 + (offset % 201); // 250 to 450
        } else if (p85Threshold > 0 && sprayTotal < p85Threshold) {
          // Bottom 85% of sprayers -> bottom tier (under 120 guests)
          extraGuests = 15 + (offset % 101); // 15 to 115
        } else {
          // Middle tier (120 to 249 guests)
          extraGuests = 120 + (offset % 130); // 120 to 249
        }

        return {
          ...event,
          guestCount: realCount + extraGuests,
          sprayTotal
        };
      });
    }
  });

  // Calculate global platform stats
  const totalEvents = publicEvents.length;
  const totalGuests = publicEvents.reduce((acc, curr) => acc + curr.guestCount, 0);
  const totalSprayed = publicEvents.reduce((acc, curr) => acc + curr.sprayTotal, 0);

  const filteredEvents = publicEvents.filter(event => 
    event.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isVideo = (url: string) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.quicktime'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-[#D4AF37] selection:text-black overflow-x-hidden transition-colors duration-500">
      <Navbar />

      {/* Cinematic Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 text-center flex flex-col items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#D4AF3708_0%,transparent_70%)] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl space-y-6"
        >
          <span className="text-[#D4AF37] text-[10px] md:text-xs font-black uppercase tracking-[0.6em] block">
            The Live Owambe Archive
          </span>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif italic leading-tight">
            Hall of <span className="text-[#D4AF37]">Celebrations</span>
          </h1>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
            Step into Nigeria's most exclusive digital monument. Witness live guest arrivals, verified digital spray milestones, and timeless memories captured in real-time.
          </p>
        </motion.div>
      </section>

      {/* Live Platform Stats Strip */}
      <section className="border-y border-border bg-secondary/30 py-12 px-6 mb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-2">
              <Flame className="text-[#D4AF37] w-5 h-5" />
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Active Celebrations</p>
            <p className="text-3xl md:text-4xl font-serif italic text-foreground">{totalEvents}</p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-2">
              <Users className="text-[#D4AF37] w-5 h-5" />
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Guests Welcomed</p>
            <p className="text-3xl md:text-4xl font-serif italic text-foreground">{totalGuests.toLocaleString()}</p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-2">
              <Coins className="text-[#D4AF37] w-5 h-5" />
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Sprayed</p>
            <p className="text-3xl md:text-4xl font-serif italic text-[#D4AF37]">₦{totalSprayed.toLocaleString()}</p>
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input 
            placeholder="Search celebrations by name or venue..." 
            className="pl-16 bg-secondary border-border h-16 rounded-full text-lg font-light focus-visible:ring-[#D4AF37]/30 text-foreground placeholder:text-muted-foreground/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Memory Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-[3rem]">
            <Sparkles className="w-12 h-12 text-muted-foreground/20 mx-auto mb-6" />
            <p className="text-muted-foreground font-light italic">No public celebrations found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/50 group"
              >
                <div className="aspect-[4/5] w-full overflow-hidden relative bg-black">
                  {isVideo(event.photo_url) ? (
                    <video 
                      src={event.photo_url} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105 pointer-events-none"
                      muted
                      loop
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <img 
                      src={event.photo_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80'} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                      alt={event.event_name}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                  
                  {/* Live Badge */}
                  <div className="absolute top-6 right-6">
                    {event.is_finished ? (
                      <span className="bg-white/10 backdrop-blur-md text-white text-[8px] font-black px-3 py-1.5 uppercase tracking-widest rounded-full border border-white/10">
                        Concluded
                      </span>
                    ) : (
                      <span className="bg-green-500 text-black text-[8px] font-black px-3 py-1.5 uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                        Live
                      </span>
                    )}
                  </div>

                  {/* Event Details Overlay */}
                  <div className="absolute bottom-8 left-8 right-8 space-y-4">
                    <span className="text-[#D4AF37] text-[8px] font-black uppercase tracking-[0.4em] block">
                      {event.theme} DNA
                    </span>
                    <h3 className="text-2xl md:text-3xl font-serif italic text-white leading-tight line-clamp-2">
                      {event.event_name}
                    </h3>
                    <div className="flex flex-col gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                        {new Date(event.event_date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Footer - Purely Informational */}
                <div className="p-8 bg-secondary/10 border-t border-border flex items-center justify-between mt-auto">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-[7px] font-black uppercase tracking-widest text-muted-foreground mb-1">Guests</p>
                      <p className="text-lg font-serif italic text-foreground">{event.guestCount}</p>
                    </div>
                    <div>
                      <p className="text-[7px] font-black uppercase tracking-widest text-muted-foreground mb-1">Sprayed</p>
                      <p className="text-lg font-serif italic text-[#D4AF37]">₦{event.sprayTotal.toLocaleString()}</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground border border-border px-3 py-1.5 rounded-full">
                    Archived
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CelebrationWall;