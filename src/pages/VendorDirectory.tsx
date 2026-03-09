"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Phone, Instagram, Star } from 'lucide-react';

const VendorDirectory = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .order('is_featured', { ascending: false });

    if (!error) setVendors(data || []);
    setLoading(false);
  };

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.category.toLowerCase().includes(search.toLowerCase()) ||
    v.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-[#1a1a2e] mb-4">Vendor Directory</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Find the best caterers, decorators, and photographers for your next Owambe.</p>
        </div>

        <div className="relative max-w-2xl mx-auto mb-12">
          <Search className="absolute left-4 top-4 text-gray-400" />
          <Input 
            className="pl-12 h-14 rounded-2xl shadow-lg border-none text-lg"
            placeholder="Search by name, category, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center">Loading vendors...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {filteredVendors.map((vendor) => (
              <div key={vendor.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                <div className="h-48 bg-gray-200 relative">
                  <img 
                    src={`https://source.unsplash.com/featured/?${vendor.category.toLowerCase()},event`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={vendor.name}
                  />
                  {vendor.is_featured && (
                    <Badge className="absolute top-4 right-4 bg-[#e94560] text-white border-none">
                      <Star className="w-3 h-3 mr-1 fill-current" /> Featured
                    </Badge>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-[#1a1a2e]">{vendor.name}</h3>
                    <Badge variant="outline" className="text-[#e94560] border-[#e94560]/20 bg-[#e94560]/5">
                      {vendor.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                    <MapPin className="w-4 h-4" /> {vendor.location}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="rounded-xl border-gray-100 hover:bg-gray-50"
                      onClick={() => window.open(`tel:${vendor.phone}`)}
                    >
                      <Phone className="w-4 h-4 mr-2" /> Call
                    </Button>
                    <Button 
                      variant="outline" 
                      className="rounded-xl border-gray-100 hover:bg-gray-50"
                      onClick={() => window.open(`https://instagram.com/${vendor.instagram.replace('@', '')}`)}
                    >
                      <Instagram className="w-4 h-4 mr-2" /> Instagram
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDirectory;