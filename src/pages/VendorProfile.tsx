"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/ui/GlassCard';
import { MapPin, Phone, Instagram, Star, ArrowLeft, ExternalLink, ShieldCheck, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const VendorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        // Fallback to mock data if not in DB
        const mockVendors = [
          { id: 'v1', name: 'The Gourmet Atelier', category: 'Catering', location: 'Victoria Island, Lagos', photo_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80', phone: '08012345678', instagram: '@gourmet_atelier', is_featured: true },
          { id: 'v2', name: 'Royal Blooms Decor', category: 'Decor', location: 'Maitama, Abuja', photo_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80', phone: '08023456789', instagram: '@royalblooms', is_featured: true },
          { id: 'v3', name: 'Lumina Studios', category: 'Photography', location: 'Lekki Phase 1, Lagos', photo_url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80', phone: '08034567890', instagram: '@lumina_studios', is_featured: true }
        ];
        const found = mockVendors.find(v => v.id === id);
        if (found) setVendor(found);
      } else {
        setVendor(data);
      }
      setLoading(false);
    };
    fetchVendor();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white">Loading Portfolio...</div>;
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
                most prestigious celebrations. Their approach combines traditional heritage with modern 
                sophistication, ensuring every event is a masterpiece.
              </p>
            </section>

            <section>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] mb-8">Portfolio Highlights</h2>
              <div className="grid grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-white/5 border border-white/10 overflow-hidden group">
                    <img 
                      src={`https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&q=80`} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      alt="Work sample"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = vendor.photo_url;
                      }}
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="md:col-span-4">
            <GlassCard className="p-10 sticky top-32 border-white/5">
              <h3 className="text-xl font-serif italic mb-8">Contact Details</h3>
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                    <MapPin className="text-[#D4AF37] w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-500">Location</p>
                    <p className="text-sm font-medium">{vendor.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                    <Phone className="text-[#D4AF37] w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-500">WhatsApp</p>
                    <p className="text-sm font-medium">{vendor.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                    <Instagram className="text-[#D4AF37] w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-500">Instagram</p>
                    <p className="text-sm font-medium">{vendor.instagram}</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-12 border-t border-white/5 space-y-4">
                <Button className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-none py-8 text-[10px] font-bold tracking-[0.3em] uppercase">
                  Book Consultation
                </Button>
                <div className="flex items-center justify-center gap-2 text-gray-500">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[8px] font-bold uppercase tracking-widest">Verified Professional</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;