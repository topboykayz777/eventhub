"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showSuccess, showError } from "@/utils/toast";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Loader2, X, Upload, Plus, Camera, Sparkles, Crown, Gem, Sun, Moon, Flower2, Waves, Heart, Landmark, Star, PenTool, Diamond, Wine, Anchor, Cloud, Leaf, Flame, Bird, Shield, Coffee, Wind, TreePine, Mountain } from "lucide-react";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/ui/GlassCard";

const THEME_OPTIONS = [
  { id: 'modern', label: 'Midnight Noir', color: 'bg-black', icon: Sparkles },
  { id: 'traditional', label: 'Royal Heritage', color: 'bg-[#064e3b]', icon: Crown },
  { id: 'elegant', label: 'Pure Ivory', color: 'bg-white', icon: Gem },
  { id: 'sahara', label: 'Sahara Gold', color: 'bg-[#78350f]', icon: Sun },
  { id: 'velvet', label: 'Midnight Velvet', color: 'bg-[#4c1d95]', icon: Moon },
  { id: 'garden', label: 'Emerald Garden', color: 'bg-[#065f46]', icon: Flower2 },
  { id: 'oceanic', label: 'Oceanic Silk', color: 'bg-[#1e3a8a]', icon: Waves },
  { id: 'rose', label: 'Sunset Rose', color: 'bg-[#9d174d]', icon: Heart },
  { id: 'earth', label: 'Ancestral Earth', color: 'bg-[#7c2d12]', icon: Landmark },
  { id: 'silver', label: 'Celestial Silver', color: 'bg-[#374151]', icon: Star },
  { id: 'dynasty', label: 'Crimson Dynasty', color: 'bg-[#991b1b]', icon: Crown },
  { id: 'vintage', label: 'Vintage Parchment', color: 'bg-[#fef3c7]', icon: PenTool },
  { id: 'onyx', label: 'Onyx Black', color: 'bg-[#1a1a1a]', icon: Diamond },
  { id: 'champagne', label: 'Champagne Gold', color: 'bg-[#fdf2f8]', icon: Wine },
  { id: 'pearl', label: 'Pearl White', color: 'bg-[#0f172a]', icon: Anchor },
  { id: 'tuscan', label: 'Tuscan Sun', color: 'bg-[#fefce8]', icon: Sun },
  { id: 'frost', label: 'Arctic Frost', color: 'bg-[#f0f9ff]', icon: Cloud },
  { id: 'magenta', label: 'Royal Magenta', color: 'bg-[#fdf2f8]', icon: Heart },
  { id: 'jade', label: 'Imperial Jade', color: 'bg-[#f0fdf4]', icon: Leaf },
  { id: 'saffron', label: 'Saffron Spice', color: 'bg-[#fff7ed]', icon: Flame },
  { id: 'slate', label: 'Slate Grey', color: 'bg-[#f8fafc]', icon: Landmark },
  { id: 'lavender', label: 'Lavender Mist', color: 'bg-[#f5f3ff]', icon: Bird },
  { id: 'ruby', label: 'Ruby Red', color: 'bg-[#fff1f2]', icon: Wine },
  { id: 'golden', label: 'Golden Hour', color: 'bg-[#fffbeb]', icon: Sun },
  { id: 'birch', label: 'Birch Wood', color: 'bg-[#f9fafb]', icon: TreePine },
  { id: 'bronze', label: 'Antique Bronze', color: 'bg-[#fff7ed]', icon: Shield },
  { id: 'plum', label: 'Royal Plum', color: 'bg-[#faf5ff]', icon: Coffee },
  { id: 'teal', label: 'Deep Teal', color: 'bg-[#f0fdfa]', icon: Waves },
  { id: 'charcoal', label: 'Charcoal Smoke', color: 'bg-[#111827]', icon: Heart },
  { id: 'sand', label: 'Desert Sand', color: 'bg-[#fafaf9]', icon: Mountain },
  { id: 'forest', label: 'Deep Forest', color: 'bg-[#022c22]', icon: TreePine },
  { id: 'ember', label: 'Glowing Ember', color: 'bg-[#450a0a]', icon: Flame },
  { id: 'blossom', label: 'Cherry Blossom', color: 'bg-[#fff1f2]', icon: Flower2 },
  { id: 'solstice', label: 'Winter Solstice', color: 'bg-[#1e1b4b]', icon: Moon },
  { id: 'breeze', label: 'Ocean Breeze', color: 'bg-[#f0f9ff]', icon: Wind },
  { id: 'marble', label: 'Carrara Marble', color: 'bg-[#f3f4f6]', icon: Landmark },
  { id: 'copper', label: 'Polished Copper', color: 'bg-[#7c2d12]', icon: Flame },
  { id: 'indigo', label: 'Midnight Indigo', color: 'bg-[#312e81]', icon: Moon },
  { id: 'mint', label: 'Fresh Mint', color: 'bg-[#ecfdf5]', icon: Leaf },
  { id: 'coral', label: 'Sunset Coral', color: 'bg-[#fff1f2]', icon: Sun }
];

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState({
    event_name: "",
    event_date: "",
    venue: "",
    message: "",
    theme: "modern",
    photo_url: "",
    gallery_urls: [] as string[]
  });

  const [uploading, setUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        showError(error.message);
        return;
      }
      setEvent({
        ...data,
        gallery_urls: data.gallery_urls || []
      });
      setLoading(false);
    };
    fetchEvent();
  }, [id, navigate]);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    setUploading(true);
    const file = e.target.files[0];
    const fileName = `cover-${Math.random()}.${file.name.split(".").pop()}`;
    
    try {
      const { error: uploadError } = await supabase.storage
        .from("event-photos")
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from("event-photos")
        .getPublicUrl(fileName);
        
      setEvent(prev => ({ ...prev, photo_url: publicUrl }));
      showSuccess("Cover portrait updated.");
    } catch (err: any) {
      showError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    if (event.gallery_urls.length + e.target.files.length > 50) {
      showError("Maximum 50 images allowed in gallery.");
      return;
    }

    setGalleryUploading(true);
    const files = Array.from(e.target.files);
    const newUrls: string[] = [];

    try {
      for (const file of files) {
        const fileName = `gallery-${Math.random()}.${file.name.split(".").pop()}`;
        const { error: uploadError } = await supabase.storage
          .from("event-photos")
          .upload(fileName, file);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from("event-photos")
          .getPublicUrl(fileName);
        
        newUrls.push(publicUrl);
      }
      
      setEvent(prev => ({ 
        ...prev, 
        gallery_urls: [...prev.gallery_urls, ...newUrls] 
      }));
      showSuccess(`${newUrls.length} photos added to gallery.`);
    } catch (err: any) {
      showError(err.message);
    } finally {
      setGalleryUploading(false);
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setEvent(prev => ({
      ...prev,
      gallery_urls: prev.gallery_urls.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from("events")
        .update({
          event_name: event.event_name,
          event_date: event.event_date,
          venue: event.venue,
          message: event.message,
          theme: event.theme,
          photo_url: event.photo_url,
          gallery_urls: event.gallery_urls
        })
        .eq("id", id);

      if (error) throw error;
      showSuccess("Event masterpiece updated.");
      navigate('/dashboard');
    } catch (err: any) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto py-24 px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-20">
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block">The Atelier</span>
            <h1 className="text-5xl md:text-7xl font-serif italic mb-6">
              Refine Your <span className="text-[#D4AF37]">Event</span>
            </h1>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-12">
              <GlassCard className="p-12 border-white/5">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-10">Core Details</h2>
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Event Title</Label>
                    <Input
                      required
                      className="h-16 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light"
                      value={event.event_name}
                      onChange={(e) => setEvent(prev => ({ ...prev, event_name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Date & Time</Label>
                    <Input
                      type="datetime-local"
                      required
                      className="h-16 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light"
                      value={event.event_date.slice(0, 16)}
                      onChange={(e) => setEvent(prev => ({ ...prev, event_date: e.target.value }))}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Venue</Label>
                    <Input
                      required
                      className="h-16 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light"
                      value={event.venue}
                      onChange={(e) => setEvent(prev => ({ ...prev, venue: e.target.value }))}
                    />
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-12 border-white/5">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-10">Visual Identity</h2>
                <div className="space-y-10">
                  <div className="space-y-6">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Cover Portrait</Label>
                    {event.photo_url ? (
                      <div className="relative aspect-video w-full overflow-hidden border border-white/10">
                        <img src={event.photo_url} className="w-full h-full object-cover" alt="Preview" />
                        <button
                          type="button"
                          onClick={() => setEvent(prev => ({ ...prev, photo_url: "" }))}
                          className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-red-500 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <Label htmlFor="photo-upload" className="cursor-pointer">
                          <div className="h-64 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 hover:border-[#D4AF37]/30 transition-colors bg-white/5">
                            {uploading ? (
                              <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" />
                            ) : (
                              <>
                                <Upload className="text-gray-600 w-10 h-10" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Upload Cover Portrait</span>
                              </>
                            )}
                          </div>
                        </Label>
                        <Input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleCoverUpload}
                          disabled={uploading}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Live Gallery ({event.gallery_urls.length}/50)</Label>
                      <Label htmlFor="gallery-upload" className="cursor-pointer">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#D4AF37] hover:underline">
                          <Plus size={14} /> Add Photos
                        </div>
                      </Label>
                      <Input
                        id="gallery-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleGalleryUpload}
                        disabled={galleryUploading}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {galleryUploading && (
                        <div className="aspect-square border-2 border-dashed border-[#D4AF37]/30 flex items-center justify-center bg-white/5">
                          <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
                        </div>
                      )}
                      <AnimatePresence>
                        {event.gallery_urls.map((url, index) => (
                          <motion.div
                            key={url}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative aspect-square group overflow-hidden border border-white/10"
                          >
                            <img src={url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="" />
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(index)}
                              className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all"
                            >
                              <X size={14} />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-12 border-white/5">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-10">Aesthetic & Message</h2>
                <div className="space-y-10">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Host's Message</Label>
                    <textarea
                      className="w-full min-h-[150px] bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light p-6 resize-none"
                      value={event.message}
                      onChange={(e) => setEvent(prev => ({ ...prev, message: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-6">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Theme Selection</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {THEME_OPTIONS.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setEvent(prev => ({ ...prev, theme: t.id }))}
                          className={`relative p-6 border transition-all text-left overflow-hidden h-32 ${
                            event.theme === t.id 
                              ? 'border-[#D4AF37] bg-[#D4AF37]/5' 
                              : 'border-white/5 hover:border-white/20'
                          }`}
                        >
                          <div className="relative z-10 flex flex-col justify-between h-full">
                            <t.icon className={`w-5 h-5 ${event.theme === t.id ? 'text-[#D4AF37]' : 'text-gray-600'}`} />
                            <span className="text-[8px] font-bold uppercase tracking-widest">{t.label}</span>
                          </div>
                          <div className={`absolute top-0 right-0 w-12 h-12 ${t.color} opacity-20 -mr-6 -mt-6 rotate-45`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>

              <div className="pt-12">
                <Button
                  type="submit"
                  disabled={loading || uploading || galleryUploading}
                  className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500"
                >
                  {loading ? 'Synchronizing...' : 'Save All Changes'}
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default EditEvent;