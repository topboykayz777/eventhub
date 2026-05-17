"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import GlassCard from '@/components/ui/GlassCard';
import { showSuccess, showError } from '@/utils/toast';
import { ArrowLeft, Upload, X, Palette, Sparkles, Calendar, MapPin, Type, Image as ImageIcon, Save, Loader2, Crown, Gem, Star, Heart, Flower2, Waves, Sun, Moon, Landmark, PenTool, Clock, Zap, Cloud, Compass, GlassWater, Trees, Sunrise, Layers, Shield, PlayCircle, ZapIcon, Cherry, Trees as PalmTree, Tent, Ghost, Palette as ColorPalette, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [eventPlan, setEventPlan] = useState('Basic');
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    venue: '',
    message: '',
    theme: 'modern',
    photo_url: '',
    gallery_urls: [] as string[]
  });

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      showError('Event not found');
      navigate('/dashboard');
      return;
    }

    setEventPlan(data.plan || 'Basic');
    setFormData({
      eventName: data.event_name,
      eventDate: data.event_date,
      venue: data.venue,
      message: data.message || '',
      theme: data.theme || 'modern',
      photo_url: data.photo_url || '',
      gallery_urls: data.gallery_urls || []
    });
    setLoading(false);
  };

  const isVideo = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.quicktime'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];

    if (file.size > 50 * 1024 * 1024) {
      showError("File is too large. Maximum size is 50MB.");
      return;
    }

    if (isGallery) {
      const limit = eventPlan === 'Pro' ? 50 : eventPlan === 'Standard' ? 10 : 0;
      if ((formData.gallery_urls?.length || 0) >= limit) {
        showError(`Your ${eventPlan} plan is limited to ${limit} gallery items. Upgrade for more.`);
        return;
      }
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    setUploading(true);
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('event-photos')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage.from('event-photos').getPublicUrl(fileName);
      
      if (isGallery) {
        setFormData(prev => ({ ...prev, gallery_urls: [...(prev.gallery_urls || []), publicUrl] }));
      } else {
        setFormData(prev => ({ ...prev, photo_url: publicUrl }));
      }
      showSuccess('Media uploaded to the vault.');
    } catch (error: any) {
      showError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryPhoto = (url: string) => {
    setFormData(prev => ({
      ...prev,
      gallery_urls: (prev.gallery_urls || []).filter(u => u !== url)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('events')
        .update({
          event_name: formData.eventName,
          venue: formData.venue,
          message: formData.message,
          theme: formData.theme,
          photo_url: formData.photo_url,
          gallery_urls: formData.gallery_urls || []
        })
        .eq('id', id);

      if (error) throw error;
      showSuccess('Masterpiece refined successfully.');
      navigate('/dashboard');
    } catch (error: any) {
      showError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const themes = [
    // 1-12 (Retained as requested)
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
    // 13-20 (8 Unique New Themes)
    { id: 'neon', label: 'Electric Pulse', color: 'bg-[#00f3ff]', icon: ZapIcon },
    { id: 'royal', label: 'Royal Amethyst', color: 'bg-[#3b0764]', icon: Crown },
    { id: 'blossom', label: 'Sakura Spring', color: 'bg-[#fff1f2]', icon: Cherry },
    { id: 'tropic', label: 'Tropical Jungle', color: 'bg-[#0d9488]', icon: PalmTree },
    { id: 'desert', label: 'Oasis Blue', color: 'bg-[#d97706]', icon: Tent },
    { id: 'glitch', label: 'Glitch Noir', color: 'bg-[#ef4444]', icon: Ghost },
    { id: 'minimal', label: 'Bauhaus Minimal', color: 'bg-[#2563eb]', icon: ColorPalette },
    { id: 'noir', label: 'Noir Cinema', color: 'bg-white', icon: Camera }
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f] text-white">
      <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#D4AF37]/5 blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto py-12 md:py-24 px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')} 
            className="text-gray-400 hover:text-[#D4AF37] transition-colors p-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
          <div className="text-left md:text-right">
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.4em] uppercase block mb-2">The Edit Suite</span>
            <h1 className="text-4xl md:text-5xl font-serif italic">Refine Your Masterpiece</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          <GlassCard className="p-8 md:p-12 border-white/5">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                <Type className="text-[#D4AF37] w-5 h-5" />
              </div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Event Identity</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Event Title</Label>
                <Input 
                  required 
                  className="h-16 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light"
                  value={formData.eventName}
                  onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Venue Address</Label>
                <Input 
                  required 
                  className="h-16 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-8 md:p-12 border-white/5">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                <Calendar className="text-[#D4AF37] w-5 h-5" />
              </div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Event Schedule</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Scheduled Date & Time</Label>
                <div className="min-h-16 bg-white/5 border border-white/10 flex items-center px-6 py-4 text-lg font-light text-gray-400">
                  <div className="flex items-center gap-4">
                    <Clock className="w-5 h-5 text-[#D4AF37]" />
                    <span>
                      {new Date(formData.eventDate).toLocaleString('en-NG', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                <p className="text-[8px] text-[#D4AF37] font-bold uppercase tracking-widest mt-2">
                  Contact support to reschedule this event.
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-8 md:p-12 border-white/5">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                <ImageIcon className="text-[#D4AF37] w-5 h-5" />
              </div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Visual Assets</h2>
            </div>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Cover Portrait</Label>
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  {formData.photo_url && (
                    <div className="w-full sm:w-32 h-48 sm:h-32 border border-white/10 overflow-hidden">
                      {isVideo(formData.photo_url) ? (
                        <video src={formData.photo_url} className="w-full h-full object-cover" muted />
                      ) : (
                        <img src={formData.photo_url} className="w-full h-full object-cover" alt="Cover" />
                      )}
                    </div>
                  )}
                  <Label htmlFor="cover-upload" className="cursor-pointer h-32 w-full flex-1 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 hover:border-[#D4AF37]/30 transition-colors bg-white/5">
                    {uploading ? <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" /> : <Upload className="w-5 h-5 text-gray-600" />}
                    <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-500">Change Cover Portrait</span>
                    <input id="cover-upload" type="file" className="hidden" onChange={(e) => handleFileUpload(e)} />
                  </Label>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Host's Message</Label>
                <Textarea 
                  placeholder="A personal note to your guests..."
                  className="min-h-[150px] bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Media Gallery ({eventPlan})</Label>
                  <span className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">
                    {(formData.gallery_urls?.length || 0)} / {eventPlan === 'Pro' ? '50' : eventPlan === 'Standard' ? '10' : '0'} Items
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {(formData.gallery_urls || []).map((url, i) => (
                    <div key={i} className="relative aspect-square border border-white/10 group overflow-hidden">
                      {isVideo(url) ? (
                        <div className="w-full h-full relative">
                          <video src={url} className="w-full h-full object-cover" muted />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <PlayCircle className="text-white/70 w-8 h-8" />
                          </div>
                        </div>
                      ) : (
                        <img src={url} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                      )}
                      <button 
                        type="button"
                        onClick={() => removeGalleryPhoto(url)}
                        className="absolute top-2 right-2 bg-black/50 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 z-10"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {(eventPlan === 'Standard' || eventPlan === 'Pro') && (
                    <Label htmlFor="gallery-upload" className="cursor-pointer aspect-square border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 hover:border-[#D4AF37]/30 transition-colors bg-white/5">
                      <Upload className="w-4 h-4 text-gray-600" />
                      <span className="text-[7px] font-bold uppercase tracking-[0.1em] text-gray-500">Add Media</span>
                      <input id="gallery-upload" type="file" className="hidden" onChange={(e) => handleFileUpload(e, true)} />
                    </Label>
                  )}
                </div>
                <p className="text-[8px] text-gray-500 uppercase tracking-widest">Max 50MB per file. Images and Videos supported.</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-8 md:p-12 border-white/5">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                <Palette className="text-[#D4AF37] w-5 h-5" />
              </div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Aesthetic Theme</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {themes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, theme: t.id })}
                  className={`relative p-6 border transition-all text-left overflow-hidden h-32 ${
                    formData.theme === t.id 
                      ? 'border-[#D4AF37] bg-[#D4AF37]/5' 
                      : 'border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <t.icon className={`w-5 h-5 ${formData.theme === t.id ? 'text-[#D4AF37]' : 'text-gray-600'}`} />
                    <span className="text-[8px] font-bold uppercase tracking-widest">{t.label}</span>
                  </div>
                  <div className={`absolute top-0 right-0 w-12 h-12 ${t.color} opacity-20 -mr-6 -mt-6 rotate-45`} />
                </button>
              ))}
            </div>
          </GlassCard>

          <div className="pt-12">
            <Button 
              type="submit" 
              disabled={saving || uploading}
              className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500"
            >
              {saving ? 'Refining Masterpiece...' : 'Save Changes'} <Save className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;