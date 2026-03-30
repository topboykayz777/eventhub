"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GlassCard from '@/components/ui/GlassCard';
import { Search, MapPin, Phone, Instagram, Star, ArrowRight, Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { showSuccess, showError } from '@/utils/toast';

const categories = ["All", "Catering", "Decor", "Photography", "Music", "Venues"];

const VendorDirectory = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [shortlisted, setShortlisted] = useState<string[]>([]);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .order('is_featured', { ascending: false });

    if (error) {
      console.error("Error fetching vendors:", error);
    } else {
      setVendors(data || []);
    }
    setLoading(false);
  };

  const toggleShortlist = (vendorId: string) => {
    if (shortlisted.includes(vendorId)) {
      setShortlisted(prev => prev.filter(id => id !== vendorId));
      showSuccess("Removed from your shortlist");
    } else {
      setShortlisted(prev => [...prev, vendorId]);
      showSuccess("Added to your shortlist");
    }
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
      
      <div className="max-w-7xl mx-auto py-12 md:py-24 px-4 md:px-6">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-20">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#D4AF37] text-[8px] md:text-[10px] font-bold tracking-[0.3em] md:tracking-[0.5em] uppercase mb-4 md:mb-8 block"
          >
            The Elite Concierge
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-8xl font-serif italic text-white mb-6 md:mb-10 leading-tight tracking-tight"
          >
            The <span className="text-[#D4AF37]">Directory</span>
          </motion.h1>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed font-light tracking-wide px-4">
            A curated selection of Nigeria's most prestigious event professionals, from master caterers to world-class venues.
          </p>
        </div>

        {/* Marketplace Advertising Slot */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-16 md:mb-24 p-1 border border-[#D4AF37]/30 bg-gradient-to-r from-[#D4AF37]/5 to-transparent mx-2 md:mx-0"
        >
          <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-8 gap-6 md:gap-8">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                <ExternalLink className="text-[#D4AF37] w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <span className="text-[8px] font-black tracking-[0.2em] md:tracking-[0.3em] text-[#D4AF37] uppercase mb-1 md:mb-2 block">Sponsored Spotlight</span>
                <h4 className="text-lg md:text-xl font-serif italic text-white">Luxury Marketplace NG</h4>
                <p className="text-[10px] md:text-xs text-gray-500 tracking-wide">Exclusive access to premium event rentals and decor.</p>
              </div>
            </div>
            <Button className="w-full md:w-auto bg-[#D4AF37] text-black rounded-none px-8 md:px-10 py-5 md:py-6 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-white transition-all">
              Visit Marketplace
            </Button>
          </div>
        </motion.div>

        {/* Search & Filter Section */}
        <div className="mb-16 md:mb-24 space-y-8 md:space-y-12">
          <div className="relative max-w-3xl mx-auto px-2 md:px-0">
            <Search className="absolute left-6 md:left-6 top-1/2 -translate-y-1/2 text-[#D4AF37] w-5 h-5" />
            <Input 
              className="pl-14 md:pl-16 h-16 md:h-20 rounded-none bg-white/5 border-white/10 text-lg md:text-xl font-light tracking-wide focus:border-[#D4AF37]/50 transition-all"
              placeholder="Search by name, category, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3 md:gap-6 px-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] px-4 md:px-8 py-3 md:py-4 border transition-all duration-500 ${
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 px-2 md:px-0">
            <AnimatePresence mode="popLayout">
              {filteredVendors.length > 0 ? (
                filteredVendors.map((vendor, index) => (
                  <GlassCard key={vendor.id} delay={index * 0.05} className="group relative flex flex-col h-full">
                    <div className="h-64 md:h-72 bg-gray-900 relative overflow-hidden">
                      <img 
                        src={vendor.photo_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80'} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                        alt={vendor.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent opacity-80" />
                      
                      <button 
                        onClick={() => toggleShortlist(vendor.id)}
                        className="absolute top-4 left-4 md:top-6 md:left-6 z-20 p-2 md:p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
                      >
                        {shortlisted.includes(vendor.id) ? <BookmarkCheck className="w-4 h-4 md:w-5 md:h-5" /> : <Bookmark className="w-4 h-4 md:w-5 md:h-5" />}
                      </button>

                      {vendor.is_featured && (
                        <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-[#D4AF37] text-black px-3 md:px-4 py-1 text-[7px] md:text-[8px] font-black tracking-[0.2em] uppercase flex items-center gap-2 z-20">
                          <Star className="w-3 h-3 fill-current" /> Elite Partner
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 md:p-10 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-4 md:mb-6">
                        <div>
                          <h3 className="text-xl md:text-2xl font-serif italic text-white mb-1 md:mb-2">{vendor.name}</h3>
                          <div className="flex items-center gap-2 text-gray-500 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.1em] md:tracking-[0.2em]">
                            <MapPin className="w-3 h-3 text-[#D4AF37]" /> {vendor.location}
                          </div>
                        </div>
                        <span className="text-[7px] md:text-[8px] font-black tracking-[0.1em] md:tracking-[0.2em] uppercase text-[#D4AF37] border border-[#D4AF37]/30 px-2 md:px-3 py-1 shrink-0">
                          {vendor.category}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6 md:mb-8 mt-auto">
                        <button 
                          className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] text-gray-400 hover:text-[#D4AF37] transition-colors flex items-center gap-2"
                          onClick={() => window.open(`tel:${vendor.phone}`)}
                        >
                          <Phone className="w-3 h-3" /> Call
                        </button>
                        <button 
                          className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] text-gray-400 hover:text-[#D4AF37] transition-colors flex items-center gap-2"
                          onClick={() => window.open(`https://instagram.com/${vendor.instagram?.replace('@', '')}`)}
                        >
                          <Instagram className="w-3 h-3" /> Instagram
                        </button>
                      </div>

                      <Button className="w-full bg-white/5 hover:bg-[#D4AF37] hover:text-black text-white border border-white/10 rounded-none py-5 md:py-6 text-[8px] md:text-[10px] font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase transition-all duration-500">
                        View Portfolio <ArrowRight className="w-3 h-3 ml-2" />
                      </Button>
                    </div>
                  </GlassCard>
                ))
              ) : (
                <div className="col-span-full text-center py-20 border border-dashed border-white/10">
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">No professionals found in this category.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDirectory;