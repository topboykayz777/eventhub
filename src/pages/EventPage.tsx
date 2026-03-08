"use client";

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Countdown from '@/components/Countdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';
import { MapPin, Calendar, MessageSquare, Share2, Image as ImageIcon } from 'lucide-react';

const EventPage = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpData, setRsvpData] = useState({ name: '', phone: '' });

  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*, profiles(full_name)')
        .eq('slug', slug)
        .eq('is_paid', true)
        .single();

      if (error) {
        setLoading(false);
        return;
      }

      setEvent(data);
      setLoading(false);

      // Increment view count
      await supabase.rpc('increment_view_count', { event_id: data.id });
    };
    fetchEvent();
  }, [slug]);

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('rsvps').insert({
      event_id: event.id,
      guest_name: rsvpData.name,
      guest_phone: rsvpData.phone
    });

    if (error) {
      showError('Failed to submit RSVP');
    } else {
      showSuccess('RSVP submitted! See you there.');
      setRsvpData({ name: '', phone: '' });
    }
  };

  const shareOnWhatsApp = () => {
    const text = `You're invited to ${event.event_name}! Check out the details and RSVP here: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#1a1a2e]">Loading...</div>;
  if (!event) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a2e] text-white p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
      <p className="text-gray-400 mb-8">This event page might be inactive or pending payment.</p>
      <Link to="/"><Button className="bg-[#e94560]">Go Home</Button></Link>
    </div>
  );

  const hasGallery = (event.plan === 'Standard' || event.plan === 'Pro') && event.gallery_urls?.length > 0;

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white">
      {/* Hero Section */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <img 
          src={event.photo_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80'} 
          className="w-full h-full object-cover opacity-60"
          alt={event.event_name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter uppercase italic">{event.event_name}</h1>
          <Countdown targetDate={event.event_date} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-5 gap-12">
          {/* Details Column */}
          <div className="md:col-span-3 space-y-12">
            <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 backdrop-blur-sm">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Calendar className="text-[#e94560] w-8 h-8" /> Event Details
              </h2>
              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="bg-[#e94560]/20 p-3 rounded-2xl">
                    <MapPin className="text-[#e94560]" />
                  </div>
                  <div>
                    <p className="font-bold text-xl mb-1">Where</p>
                    <p className="text-gray-400 text-lg">{event.venue}</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="bg-[#e94560]/20 p-3 rounded-2xl">
                    <MessageSquare className="text-[#e94560]" />
                  </div>
                  <div>
                    <p className="font-bold text-xl mb-1">Host's Note</p>
                    <p className="text-gray-400 text-lg italic leading-relaxed">"{event.message}"</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery Section */}
            {hasGallery && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <ImageIcon className="text-[#e94560] w-8 h-8" /> Photo Gallery
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {event.gallery_urls.map((url: string, i: number) => (
                    <img 
                      key={i} 
                      src={url} 
                      className="w-full aspect-square object-cover rounded-3xl hover:scale-[1.02] transition-transform cursor-pointer" 
                      alt={`Gallery ${i}`} 
                    />
                  ))}
                </div>
              </div>
            )}

            <Button 
              onClick={shareOnWhatsApp}
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-10 rounded-[2rem] text-2xl font-black flex items-center justify-center gap-4 shadow-2xl shadow-[#25D366]/20"
            >
              <Share2 className="w-8 h-8" /> SHARE ON WHATSAPP
            </Button>
          </div>

          {/* RSVP Column */}
          <div className="md:col-span-2">
            <div className="bg-white text-[#1a1a2e] p-10 rounded-[2.5rem] shadow-2xl sticky top-24">
              <h2 className="text-3xl font-black mb-2">RSVP NOW</h2>
              <p className="text-gray-500 mb-8">Let the host know you're coming!</p>
              <form onSubmit={handleRSVP} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-bold uppercase tracking-wider text-gray-400">Your Full Name</Label>
                  <Input 
                    id="name" 
                    required 
                    className="bg-gray-50 border-none h-14 rounded-2xl text-lg"
                    placeholder="John Doe"
                    value={rsvpData.name}
                    onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-bold uppercase tracking-wider text-gray-400">WhatsApp Number</Label>
                  <Input 
                    id="phone" 
                    required 
                    className="bg-gray-50 border-none h-14 rounded-2xl text-lg"
                    placeholder="08012345678"
                    value={rsvpData.phone}
                    onChange={(e) => setRsvpData({ ...rsvpData, phone: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full bg-[#e94560] hover:bg-[#d43d56] text-white h-16 rounded-2xl text-xl font-bold shadow-xl shadow-[#e94560]/30">
                  CONFIRM ATTENDANCE
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-white/5 py-20 px-6 text-center mt-20 border-t border-white/5">
        <p className="text-2xl mb-8 text-gray-300">Want a beautiful page for your own event?</p>
        <Link to="/">
          <Button className="bg-[#e94560] hover:bg-[#d43d56] text-white px-12 py-8 rounded-full text-xl font-bold">
            CREATE YOUR EVENT PAGE
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EventPage;