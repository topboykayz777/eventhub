"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { showSuccess, showError } from '@/utils/toast';
import { Copy, MessageCircle, Eye, Users, ExternalLink } from 'lucide-react';

const Dashboard = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('events')
      .select('*, rsvps(*)')
      .eq('host_id', user.id)
      .order('created_at', { ascending: false });

    if (error) showError(error.message);
    else setEvents(data || []);
    setLoading(false);
  };

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/event/${slug}`;
    navigator.clipboard.writeText(url);
    showSuccess('Link copied to clipboard!');
  };

  const sendWhatsAppBlast = (event: any) => {
    const guestList = event.rsvps.map((r: any) => r.guest_name).join(', ');
    const message = `Hello everyone! Here is the guest list for ${event.event_name}: ${guestList}. See you all soon!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-[#1a1a2e]">Your Events</h1>
          <Button onClick={() => window.location.href = '/create-event'} className="bg-[#e94560] hover:bg-[#d43d56] text-white">
            + Create New Event
          </Button>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-500 mb-4">You haven't created any events yet.</p>
            <Button onClick={() => window.location.href = '/create-event'} variant="outline">Create Your First Event</Button>
          </div>
        ) : (
          <div className="grid gap-8">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden rounded-3xl border-none shadow-lg">
                <div className="md:flex">
                  <div className="md:w-1/3 h-48 md:h-auto relative">
                    <img 
                      src={event.photo_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80'} 
                      className="w-full h-full object-cover"
                      alt={event.event_name}
                    />
                    {!event.is_paid && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Button onClick={() => window.location.href = `/payment/${event.id}`} className="bg-[#e94560]">Activate Now</Button>
                      </div>
                    )}
                  </div>
                  <div className="md:w-2/3 p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-[#1a1a2e] mb-1">{event.event_name}</h2>
                        <p className="text-gray-500">{new Date(event.event_date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => copyLink(event.slug)}>
                          <Copy className="w-4 h-4 mr-2" /> Copy Link
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => window.open(`/event/${event.slug}`, '_blank')}>
                          <ExternalLink className="w-4 h-4 mr-2" /> View Page
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="bg-gray-50 p-4 rounded-2xl text-center">
                        <Eye className="w-5 h-5 mx-auto mb-1 text-[#e94560]" />
                        <div className="text-xl font-bold">{event.view_count}</div>
                        <div className="text-xs text-gray-500 uppercase">Views</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-2xl text-center">
                        <Users className="w-5 h-5 mx-auto mb-1 text-[#e94560]" />
                        <div className="text-xl font-bold">{event.rsvps.length}</div>
                        <div className="text-xs text-gray-500 uppercase">RSVPs</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-2xl text-center">
                        <div className="text-xl font-bold text-[#e94560]">{event.plan}</div>
                        <div className="text-xs text-gray-500 uppercase">Plan</div>
                      </div>
                    </div>

                    <Tabs defaultValue="rsvps">
                      <TabsList className="mb-4">
                        <TabsTrigger value="rsvps">Guest List</TabsTrigger>
                        <TabsTrigger value="actions">Actions</TabsTrigger>
                      </TabsList>
                      <TabsContent value="rsvps">
                        <div className="max-h-40 overflow-y-auto space-y-2">
                          {event.rsvps.length > 0 ? (
                            event.rsvps.map((rsvp: any) => (
                              <div key={rsvp.id} className="flex justify-between p-3 bg-gray-50 rounded-xl">
                                <span className="font-medium">{rsvp.guest_name}</span>
                                <span className="text-gray-500">{rsvp.guest_phone}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-400 text-sm italic">No RSVPs yet.</p>
                          )}
                        </div>
                      </TabsContent>
                      <TabsContent value="actions">
                        <Button 
                          onClick={() => sendWhatsAppBlast(event)}
                          className="bg-[#25D366] hover:bg-[#128C7E] text-white w-full py-6 rounded-xl"
                        >
                          <MessageCircle className="w-5 h-5 mr-2" /> Send WhatsApp Blast to Guests
                        </Button>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;