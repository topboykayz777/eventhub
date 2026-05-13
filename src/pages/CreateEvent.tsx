"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess, showError } from '@/utils/toast';
import { Palette, Sparkles, Calendar, MapPin, Type, Image as ImageIcon, ArrowRight, Check, Upload, X, Crown, Gem, Star, Heart, Flower2, Waves, Sun, Moon, Landmark, PenTool, Navigation, Zap, Cloud, Compass, GlassWater, Trees, Sunrise, Layers, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    venue: '',
    venue_map_url: '',
    message: '',
    plan: 'Basic',
    theme: 'modern',
    photo_url: ''
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('event-photos')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage.from('event-photos').getPublicUrl(fileName);
      setFormData(prev => ({ ...prev, photo_url: publicUrl }));
      showSuccess('Portrait uploaded successfully.');
    } catch (error: any) {
      showError('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.photo_url) {
      showError('Please upload a cover portrait.');
      return;
    }
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
      const lastName = profile?.full_name?.split(' ').pop()?.toLowerCase() || 'event';
      const slug = `${formData.eventName.toLowerCase().replace(/\s+/g, '-')}-${lastName}-${Math.floor(Math.random() * 1000)}`;

      const { data: event, error } = await supabase.from('events').insert({
        host_id: user.id,
        event_name: formData.eventName,
        event_date: new Date(formData.eventDate).toISOString(),
        venue: formData.venue,
        venue_map_url: formData.venue_map_url,
        message: formData.message,
        plan: formData.plan,
        theme: formData.theme,
        slug,
        photo_url: formData.photo_url
      }).select().single();

      if (error) throw error;

      showSuccess('Event created! Proceeding to activation.');
      navigate(`/payment/${event.id}`);
    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const themes = [
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
    { id: 'onyx', label: 'Onyx Cyber', color: 'bg-[#111111]', icon: Zap },
    { id: 'lavender', label: 'Lavender Mist', color: 'bg-[#ddd6fe]', icon: Cloud },
    { id: 'midnight', label: 'Midnight Sapphire', color: 'bg-[#0f172a]', icon: Compass },
    { id: 'champagne', label: 'Champagne Bubbles', color: 'bg-[#fafaf9]', icon: GlassWater },
    { id: 'forest', label: 'Forest Mystique', color: 'bg-[#064e3b]', icon: Trees },
    { id: 'sunset', label: 'Golden Hour', color: 'bg-[#ea580c]', icon: Sunrise },
    { id: 'marble', label: 'Carrara Marble', color: 'bg-[#e5e7eb]', icon: Layers },
    { id: 'platinum', label: 'Platinum Elite', color: 'bg-[#f3f4f6]', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      
      <div className="max-w-5xl mx-auto py-24 px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block"
          >
            The Creator Suite
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif italic mb-6"
          >
            Design Your <span className="text-[#D4AF37]">Masterpiece</span>
          </motion.h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          <GlassCard className="p-12 border-white/5">
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
                  placeholder="e.g. The Balogun Wedding"
                  className="h-16 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light"
                  value={formData.eventName}
                  onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Service Tier</Label>
                <Select onValueChange={(v) => setFormData({ ...formData, plan: v })} defaultValue="Basic">
                  <SelectTrigger className="h-16 bg-white/5 border-white/10 rounded-none text-lg font-light">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                    <SelectItem value="Basic">Basic (₦25,000)</SelectItem>
                    <SelectItem value="Standard">Standard (₦75,000)</SelectItem>
                    <SelectItem value="Pro">Pro (₦150,000)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-12 border-white/5">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                <Calendar className="text-[#D4AF37] w-5 h-5" />
              </div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Logistics</h2>
            </div>
            
            <div className="space-y-10">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Date & Time</Label>
                  <Input 
                    type="datetime-local" 
                    required 
                    className="h-16 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Venue Name</Label>
                  <Input 
                    required 
                    placeholder="Eko Hotel & Suites, VI, Lagos"
                    className="h-16 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Exact Location Pin (Google Maps Link)</Label>
                  <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-[8px] font-black text-[#D4AF37] uppercase tracking-widest hover:underline">Open Maps to get link</a>
                </div>
                <div className="relative">
                  <Navigation className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4AF37] w-4 h-4" />
                  <Input 
                    placeholder="Paste the 'Share' link from Google Maps here..."
                    className="h-16 pl-16 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light"
                    value={formData.venue_map_url}
                    onChange={(e) => setFormData({ ...formData, venue_map_url: e.target.value })}
                  />
                </div>
                <p className="text-[8px] text-gray-500 uppercase tracking-widest">This ensures guests are guided to the exact entrance, not just the general area.</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-12 border-white/5">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                <ImageIcon className="text-[#D4AF37] w-5 h-5" />
              </div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Visual Assets</h2>
            </div>
            
            <div className="space-y-10">
              <div className="space-y-6">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Cover Portrait</Label>
                {formData.photo_url ? (
                  <div className="relative aspect-video w-full overflow-hidden border border-white/10">
                    <img src={formData.photo_url} className="w-full h-full object-cover" alt="Preview" />
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, photo_url: '' })}
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
                          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Upload className="text-gray-600 w-10 h-10" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Upload High-Resolution Portrait</span>
                          </>
                        )}
                      </div>
                    </Label>
                    <Input 
                      id="photo-upload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden"
                      onChange={handleFileChange} 
                      disabled={uploading}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Host's Message</Label>
                <Textarea 
                  placeholder="A personal note to your guests (e.g. 'We can't wait to celebrate our special day with you!')"
                  className="min-h-[150px] bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-12 border-white/5">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                <Palette className="text-[#D4AF37] w-5 h-5" />
              </div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Aesthetic Theme</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {themes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, theme: t.id })}
                  className={`relative p-6 border transition-all text-left overflow-hidden h-32 ${
                    formData.theme === t.id 
                      ? 'border-[#D4AF37] bg-[#D4AF37]/5' 
                      : 'border-white/5 hover:border-white/20'
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
              disabled={loading || uploading}
              className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500"
            >
              {loading ? 'Processing...' : 'Finalize & Proceed'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;