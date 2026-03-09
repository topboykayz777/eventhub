"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import GlassCard from '@/components/ui/GlassCard';
import { Search, MapPin, Phone, Instagram, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = ["All", "Catering", "Decor", "Photography", "Music", "Venues"];

const VendorDirectory = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

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

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
                         v.category.toLowerCase().includes(search.toLowerCase()) ||
                         v.location.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || v.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-24 px-6">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-8 block"
          >
            The Elite Concierge
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-serif italic text-white mb-10 leading-tight tracking-tight"
          >
            The <span className="text-[#D4AF37]">Directory</span>
          </motion.h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed font-light tracking-wide">
            A curated selection of Nigeria's most prestigious event professionals. 
            Where excellence meets your celebration.
          </p>
        </div>

        {/* Search & Filter Section */}
        <div className="mb-24 space-y-12">
          <div className="relative max-w-3xl mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4AF37] w-5 h-5" />
            <Input 
              className="pl-16 h-20 rounded-none bg-white/5 border-white/10 text-xl font-light tracking-wide focus:border-[#D4AF37]/50 transition-all"
              placeholder="Search by name, category, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[10px] font-bold uppercase tracking-[0.3em] px-8 py-4 border transition-all duration-500 ${
                  activeCategory === cat 
                    ? 'bg-[#D4AF37] text-black border-[#D4AF37]' 
                    : 'bg-transparent text-gray-500 border-white/10 hover:border-[#D4AF37]/30 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Vendor Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-500 tracking-[0.3em] uppercase text-[10px] font-bold animate-pulse">
            Curating Excellence...
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-12">
            {filteredVendors.map((vendor, index) => (
              <GlassCard key={vendor.id} delay={index * 0.1} className="group">
                <div className="h-72 bg-gray-900 relative overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&category=${vendor.category.toLowerCase()}`} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                    alt={vendor.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent opacity-80" />
                  {vendor.is_featured && (
                    <div className="absolute top-6 right-6 bg-[#D4AF37] text-black px-4 py-1 text-[8px] font-black tracking-[0.2em] uppercase flex items-center gap-2">
                      <Star className="w-3 h-3 fill-current" /> Elite Partner
                    </div>
                  )}
                </div>
                <div className="p-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-serif italic text-white mb-2">{vendor.name}</h3>
                      <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                        <MapPin className="w-3 h-3 text-[#D4AF37]" /> {vendor.location}
                      </div>
                    </div>
                    <span className="text-[8px] font-black tracking-[0.2em] uppercase text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-1">
                      {vendor.category}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <button 
                      className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-[#D4AF37] transition-colors flex items-center gap-2"
                      onClick={() => window.open(`tel:${vendor.phone}`)}
                    >
                      <Phone className="w-3 h-3" /> Call
                    </button>
                    <button 
                      className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-[#D4AF37] transition-colors flex items-center gap-2"
                      onClick={() => window.open(`https://instagram.com/${vendor.instagram?.replace('@', '')}`)}
                    >
                      <Instagram className="w-3 h-3" /> Instagram
                    </button>
                  </div>

                  <Button className="w-full bg-white/5 hover:bg-[#D4AF37] hover:text-black text-white border border-white/10 rounded-none py-6 text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-500">
                    View Portfolio <ArrowRight className="w-3 h-3 ml-2" />
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredVendors.length === 0 && (
          <div className="text-center py-40 border border-dashed border-white/10">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">No vendors found in this category.</p>
          </div>
        )}
      </div>

      {/* Final CTA */}
      <section className="py-40 px-6 text-center bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-serif italic text-white mb-10 leading-tight">
            Are You an <br /> <span className="text-[#D4AF37]">Elite Vendor?</span>
          </h2>
          <p className="text-lg text-gray-400 mb-16 font-light tracking-widest uppercase">
            Join Nigeria's most exclusive event network.
          </p>
          <Button className="bg-[#D4AF37] text-black px-16 py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-[#B8860B] transition-all duration-500">
            Apply to Join
          </Button>
        </div>
      </section>
    </div>
  );
};

export default VendorDirectory;