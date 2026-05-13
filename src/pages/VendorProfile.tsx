"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import GlassCard from '@/components/ui/GlassCard';
import { MapPin, Phone, Instagram, Star, ArrowLeft, ExternalLink, ShieldCheck, Award, Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { showSuccess, showError } from '@/utils/toast';

const VendorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userEvents, setUserEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [sendingInquiry, setSendingInquiry] = useState(false);

  useEffect(() => {
    fetchVendorAndEvents();
  }, [id]);

  const fetchVendorAndEvents = async () => {
    const { data: vendorData } = await supabase.from('vendors').select('*').eq('id', id).single();
    setVendor(vendorData);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: events } = await supabase.from('events').select('id, event_name').eq('host_id', user.id);
      setUserEvents(events || []);
    }
    setLoading(false);
  };

  const handleInquiry = async () => {
    if (!selectedEvent) {
      showError("Please select an event to link this inquiry.");
      return;
    }

    setSendingInquiry(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase.from('vendor_inquiries').insert({
      vendor_id: id,
      host_id: user?.id,
      event_id: selectedEvent,
      message: `Inquiry for ${vendor.name} regarding my event.`
    });

    if (error) showError(error.message);
    else showSuccess(`Inquiry sent to ${vendor.name}. They will contact you shortly.`);
    setSendingInquiry(false);
  };

  if (loading) return <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white"><Loader2 className="animate-spin" /></div>;
  if (!vendor) return <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white">Vendor not found.</div>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img src={vendor.photo_url} className="w-full h-full object-cover grayscale opacity-50" alt={vendor.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />
        <div className="absolute bottom-12 left-0 right-0 px-6 max-w-7xl mx-auto">
          <Button variant="ghost" onClick={() => navigate('/vendors')} className="mb-8 text-gray-400 hover:text-[#D4AF37]">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
          </Button>
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <div>
              <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">{vendor.category}</span>
              <h1 className="text-5xl md:text-8xl font-serif italic leading-tight">{vendor.name}</h1>
            </div>
            {vendor.is_featured && (
              <div className="bg-[#D4AF37] text-black px-6 py-3 text-[10px] font-black tracking-[0.3em] uppercase flex items-center gap-3">
                <Award className="w-5 h-5" /> Elite Partner
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-24 px-6">
        <div className="grid md:grid-cols-12 gap-16">
          <div className="md:col-span-8 space-y-16">
            <section>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-8">About the Professional</h2>
              <p className="text-xl md:text-2xl font-light leading-relaxed text-gray-300">
                {vendor.name} is a premier {vendor.category.toLowerCase()} service based in {vendor.location}. 
                With a reputation for excellence and an eye for detail, they have curated some of Nigeria's 
                most prestigious celebrations.
              </p>
            </section>
          </div>

          <div className="md:col-span-4">
            <GlassCard className="p-10 sticky top-32 border-white/5">
              <h3 className="text-xl font-serif italic mb-8">Book Consultation</h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[8px] font-bold uppercase tracking-widest text-gray-500">Select Your Event</label>
                  <Select onValueChange={setSelectedEvent}>
                    <SelectTrigger className="bg-white/5 border-white/10 rounded-none h-14">
                      <SelectValue placeholder="Choose an event" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                      {userEvents.map(e => (
                        <SelectItem key={e.id} value={e.id}>{e.event_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleInquiry}
                  disabled={sendingInquiry || userEvents.length === 0}
                  className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-none py-8 text-[10px] font-bold tracking-[0.3em] uppercase"
                >
                  {sendingInquiry ? <Loader2 className="animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Send Inquiry</>}
                </Button>
                
                {userEvents.length === 0 && (
                  <p className="text-[8px] text-center text-gray-500 uppercase tracking-widest">You must create an event first.</p>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;