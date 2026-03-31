"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import GlassCard from '@/components/ui/GlassCard';
import { showSuccess, showError } from '@/utils/toast';
import { Briefcase, MapPin, Phone, Instagram, Star, LayoutDashboard, Settings, ExternalLink, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [vendor, setVendor] = useState<any>(null);

  useEffect(() => {
    fetchVendorData();
  }, []);

  const fetchVendorData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) setVendor(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const vendorData = {
      name: e.currentTarget.vendorName.value,
      category: e.currentTarget.category.value,
      location: e.currentTarget.location.value,
      phone: e.currentTarget.phone.value,
      instagram: e.currentTarget.instagram.value,
      user_id: user?.id
    };

    const { error } = vendor?.id 
      ? await supabase.from('vendors').update(vendorData).eq('id', vendor.id)
      : await supabase.from('vendors').insert(vendorData);

    if (error) showError(error.message);
    else {
      showSuccess("Listing updated successfully.");
      fetchVendorData();
    }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white">Accessing Atelier...</div>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-24 px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20">
          <div>
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">Professional Suite</span>
            <h1 className="text-5xl md:text-7xl font-serif italic">Vendor <span className="text-[#D4AF37]">Dashboard</span></h1>
          </div>
          <div className="flex gap-4">
            {vendor && (
              <Button variant="outline" onClick={() => navigate(`/vendor/${vendor.id}`)} className="border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-widest py-6 px-8">
                <ExternalLink className="w-4 h-4 mr-2" /> View Public Profile
              </Button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-8">
            <GlassCard className="p-10 border-white/5">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                  <Star className="text-[#D4AF37] w-5 h-5" />
                </div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em]">Listing Status</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Visibility</span>
                  <span className={`text-[8px] font-black px-3 py-1 uppercase tracking-widest ${vendor ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
                    {vendor ? 'Live' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Tier</span>
                  <span className="text-[8px] font-black px-3 py-1 uppercase tracking-widest bg-white/10">Standard</span>
                </div>
              </div>

              {!vendor && (
                <div className="mt-10 p-6 bg-[#D4AF37]/5 border border-[#D4AF37]/20">
                  <p className="text-[10px] text-[#D4AF37] font-bold uppercase leading-relaxed">
                    Complete your profile to appear in the directory and start receiving leads.
                  </p>
                </div>
              )}
            </GlassCard>
          </div>

          <div className="lg:col-span-8">
            <GlassCard className="p-12 border-white/5">
              <form onSubmit={handleSave} className="space-y-10">
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Business Name</Label>
                    <Input 
                      name="vendorName"
                      required 
                      defaultValue={vendor?.name}
                      className="h-16 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Category</Label>
                    <Select name="category" defaultValue={vendor?.category || "Catering"}>
                      <SelectTrigger className="h-16 bg-white/5 border-white/10 rounded-none text-lg font-light">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                        <SelectItem value="Catering">Catering</SelectItem>
                        <SelectItem value="Decor">Decor</SelectItem>
                        <SelectItem value="Photography">Photography</SelectItem>
                        <SelectItem value="Music">Music</SelectItem>
                        <SelectItem value="Venues">Venues</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Location</Label>
                    <Input 
                      name="location"
                      required 
                      defaultValue={vendor?.location}
                      placeholder="e.g. Victoria Island, Lagos"
                      className="h-16 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">WhatsApp Number</Label>
                    <Input 
                      name="phone"
                      required 
                      defaultValue={vendor?.phone}
                      className="h-16 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Instagram Handle</Label>
                  <Input 
                    name="instagram"
                    defaultValue={vendor?.instagram}
                    placeholder="@your_business"
                    className="h-16 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light"
                  />
                </div>

                <div className="pt-8">
                  <Button 
                    type="submit" 
                    disabled={saving}
                    className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500"
                  >
                    {saving ? 'Processing...' : 'Update Listing'}
                  </Button>
                </div>
              </form>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;