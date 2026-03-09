"use client";

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { showSuccess, showError } from '@/utils/toast';
import { Copy, MessageCircle, Eye, Users, ExternalLink, Edit, Download, User, Wallet, Store, CreditCard } from 'lucide-react';
import DigitalInvite from '@/components/DigitalInvite';

const Dashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

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

  const exportToCSV = (event: any) => {
    if (event.rsvps.length === 0) {
      showError('No RSVPs to export');
      return;
    }
    const headers = ['Guest Name', 'Phone Number', 'Date'];
    const rows = event.rsvps.map((r: any) => [
      r.guest_name,
      r.guest_phone,
      new Date(r.created_at).toLocaleDateString()
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${event.event_name}_guests.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[#1a1a2e]">Host Dashboard</h1>
            <p className="text-gray-500">Manage your events and guest lists</p>
          </div>
          <div className="flex gap-3">
            <Link to="/profile">
              <Button variant="outline" className="rounded-xl">
                <User className="w-4 h-4 mr-2" /> My Profile
              </Button>
            </Link>
            <Link to="/create-event">
              <Button className="bg-[#e94560] hover:bg-[#d43d56] text-white rounded-xl">
                + Create New Event
              </Button>
            </Link>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-500 mb-4">You haven't created any events yet.</p>
            <Link to="/create-event">
              <Button variant="outline">Create Your First Event</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden rounded-3xl border-none shadow-lg bg-white">
                <div className="md:flex">
                  <div className="md:w-1/3 h-48 md:h-auto relative">
                    <img 
                      src={event.photo_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80'} 
                      className="w-full h-full object-cover"
                      alt={event.event_name}
                    />
                    {!event.is_paid && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Button onClick={() => navigate(`/payment/${event.id}`)} className="bg-[#e94560]">Activate Now</Button>
                      </div>
                    )}
                  </div>
                  <div className="md:w-2/3 p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-2xl font-bold text-[#1a1a2e]">{event.event_name}</h2>
                          <span className={`text-xs px-2 py-1 rounded-full ${event.is_paid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {event.is_paid ? 'Active' : 'Pending Payment'}
                          </span>
                        </div>
                        <p className="text-gray-500">{new Date(event.event_date).toLocaleDateString()} at {new Date(event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => copyLink(event.slug)} className="rounded-lg">
                          <Copy className="w-4 h-4 mr-2" /> Link
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/edit-event/${event.id}`)} className="rounded-lg">
                          <Edit className="w-4 h-4 mr-2" /> Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => window.open(`/event/${event.slug}`, '_blank')} className="rounded-lg">
                          <ExternalLink className="w-4 h-4 mr-2" /> View
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
                      <div className="flex justify-between items-center mb-4">
                        <TabsList className="bg-gray-100">
                          <TabsTrigger value="rsvps">Guest List</TabsTrigger>
                          <TabsTrigger value="tools">Tools</TabsTrigger>
                          <TabsTrigger value="invite">Invite Card</TabsTrigger>
                        </TabsList>
                        <Button variant="ghost" size="sm" onClick={() => exportToCSV(event)} className="text-gray-500">
                          <Download className="w-4 h-4 mr-2" /> Export CSV
                        </Button>
                      </div>
                      
                      <TabsContent value="rsvps">
                        <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                          {event.rsvps.length > 0 ? (
                            event.rsvps.map((rsvp: any) => (
                              <div key={rsvp.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="font-medium text-[#1a1a2e]">{rsvp.guest_name}</span>
                                <span className="text-gray-500 text-sm">{rsvp.guest_phone}</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-gray-400 italic">No RSVPs yet. Share your link!</div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="tools">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Button 
                            onClick={() => sendWhatsAppBlast(event)}
                            className="bg-[#25D366] hover:bg-[#128C7E] text-white py-8 rounded-2xl flex flex-col items-center gap-1"
                          >
                            <MessageCircle className="w-6 h-6" />
                            <span>WhatsApp Blast</span>
                          </Button>
                          
                          {(event.plan === 'Pro') && (
                            <>
                              <Button 
                                onClick={() => navigate(`/budget/${event.id}`)}
                                className="bg-[#1a1a2e] hover:bg-[#2a2a4e] text-white py-8 rounded-2xl flex flex-col items-center gap-1"
                              >
                                <Wallet className="w-6 h-6" />
                                <span>Budget Tracker</span>
                              </Button>
                              <Button 
                                onClick={() => navigate('/vendors')}
                                className="bg-white border-2 border-[#1a1a2e] text-[#1a1a2e] hover:bg-gray-50 py-8 rounded-2xl flex flex-col items-center gap-1"
                              >
                                <Store className="w-6 h-6" />
                                <span>Vendor Directory</span>
                              </Button>
                            </>
                          )}

                          {(event.plan === 'Standard') && (
                            <Button 
                              onClick={() => navigate(`/budget/${event.id}`)}
                              disabled
                              className="bg-gray-100 text-gray-400 py-8 rounded-2xl flex flex-col items-center gap-1 cursor-not-allowed"
                            >
                              <Wallet className="w-6 h-6" />
                              <span>Budget (Pro Only)</span>
                            </Button>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="invite">
                        {(event.plan === 'Standard' || event.plan === 'Pro') ? (
                          <DigitalInvite event={event} />
                        ) : (
                          <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                            <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-bold mb-2">Upgrade Required</h3>
                            <p className="text-gray-500 mb-6">Digital Invite Cards are available on Standard and Pro plans.</p>
                            <Button onClick={() => navigate(`/payment/${event.id}`)} className="bg-[#e94560]">Upgrade Plan</Button>
                          </div>
                        )}
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