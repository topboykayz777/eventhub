"use client";

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Countdown from '@/components/Countdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';
import { MapPin, Calendar, MessageSquare, Share2 } from 'lucide-react';

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

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!event) return <div className="flex flex-center justify-center min-h-screen">Event not found or not active.</div>;

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img 
          src={event.photo_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80'} 
          className="w-full h-full object-cover opacity-60"
          alt={event.event_name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight">{event.event_name}</h1>
          <Countdown targetDate={event.event_date} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">
        {/* Details */}
        <div className="space-y-8">
          <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="text-[#e94560]" /> Event Details
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="text-[#e94560] mt-1" />
                <div>
                  <p className="font-bold text-lg">Venue</p>
                  <p className="text-gray-400">{event.venue}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MessageSquare className="text-[#e94560] mt-1" />
                <div>
                  <p className="font-bold text-lg">Host Message</p>
                  <p className="text-gray-400 italic">"{event.message}"</p>
                </div>
              </div>
            </div>
          </div>

          <Button 
            onClick={shareOnWhatsApp}
            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-8 rounded-2xl text-xl font-bold flex items-center justify-center gap-3"
          >
            <Share2 /> Share on WhatsApp
          </Button>
        </div>

        {/* RSVP Form */}
        <div className="bg-white text-[#1a1a2e] p-8 rounded-3xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-6">Will you be attending?</h2>
          <form onSubmit={handleRSVP} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Full Name</Label>
              <Input 
                id="name" 
                required 
                className="bg-gray-50"
                value={rsvpData.name}
                onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">WhatsApp Number</Label>
              <Input 
                id="phone" 
                required 
                className="bg-gray-50"
                placeholder="08012345678"
                value={rsvpData.phone}
                onChange={(e) => setRsvpData({ ...rsvpData, phone: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full bg-[#e94560] hover:bg-[#d43d56] text-white py-6 rounded-xl text-lg">
              Confirm Attendance
            </Button>
          </form>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-white/5 py-12 px-6 text-center mt-12">
        <p className="text-xl mb-6">Want to create your own event page?</p>
        <Link to="/">
          <Button className="bg-[#e94560] hover:bg-[#d43d56] text-white px-8 py-6 rounded-full">
            Get Started for Free
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EventPage;