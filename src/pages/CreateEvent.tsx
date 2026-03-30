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
import { Palette, Sparkles, Calendar, MapPin, Type, Image as ImageIcon, ArrowRight, Check, Upload, X } from 'lucide-react';
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
      
      // Upload to 'event-photos' bucket
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
    { id: 'modern', label: 'Modern Noir', color: 'bg-[#0a0a1a]', text: 'text-white', accent: 'bg-[#e94560]' },
    { id: 'traditional', label: 'Royal Heritage', color: 'bg-[#fdfcf0]', text: 'text-[#5d4037]', accent: 'bg-[#b8860b]' },
    { id: 'elegant', label: 'Pure Ivory', color: 'bg-white', text: 'text-gray-900', accent: 'bg-black' }
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
                    <SelectItem value="Basic">Basic (₦10,000)</SelectItem>
                    <SelectItem value="Standard">Standard (₦15,000)</SelectItem>
                    <SelectItem value="Pro">Pro (₦20,000)</SelectItem>
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
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Venue Address</Label>
                <Input 
                  required 
                  placeholder="Eko Hotel & Suites, VI, Lagos"
                  className="h-16 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-12 border-white/5">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                <ImageIcon className="text-[#D4AF37] w-5 h-5" />
              </div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Cover Portrait</h2>
            </div>
            
            <div className="space-y-6">
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