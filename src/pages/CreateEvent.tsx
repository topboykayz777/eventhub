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
import { Palette, Sparkles, Calendar, MapPin, Type, Image as ImageIcon, ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    venue: '',
    message: '',
    plan: 'Basic',
    theme: 'modern',
    photo: null as File | null
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, photo: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
      const lastName = profile?.full_name?.split(' ').pop()?.toLowerCase() || 'event';
      const slug = `${formData.eventName.toLowerCase().replace(/\s+/g, '-')}-${lastName}`;

      let photoUrl = '';
      if (formData.photo) {
        const fileExt = formData.photo.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('event-photos')
          .upload(fileName, formData.photo);
        
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('event-photos').getPublicUrl(fileName);
        photoUrl = publicUrl;
      }

      const { data: event, error } = await supabase.from('events').insert({
        host_id: user.id,
        event_name: formData.eventName,
        event_date: new Date(formData.eventDate).toISOString(),
        venue: formData.venue,
        message: formData.message,
        plan: formData.plan,
        theme: formData.theme,
        slug,
        photo_url: photoUrl
      }).select().single();

      if (error) throw error;

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
      
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#D4AF37]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#e94560]/5 blur-[120px]" />
      </div>

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
          <p className="text-gray-400 max-w-xl mx-auto font-light tracking-wide">
            Every detail matters. Fill in the details below to create an unforgettable digital experience for your guests.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section 1: Identity */}
          <GlassCard className="p-12 border-white/5">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                <Type className="text-[#D4AF37] w-5 h-5" />
              </div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Event Identity</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <Label htmlFor="eventName" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Event Title</Label>
                <Input 
                  id="eventName" 
                  required 
                  placeholder="e.g. The Balogun Wedding"
                  className="h-16 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light"
                  value={formData.eventName}
                  onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="plan" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Service Tier</Label>
                <Select onValueChange={(v) => setFormData({ ...formData, plan: v })} defaultValue="Basic">
                  <SelectTrigger className="h-16 bg-white/5 border-white/10 rounded-none text-lg font-light">
                    <SelectValue placeholder="Select a plan" />
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

          {/* Section 2: Logistics */}
          <GlassCard className="p-12 border-white/5">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                <Calendar className="text-[#D4AF37] w-5 h-5" />
              </div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Logistics & Venue</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <Label htmlFor="eventDate" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Date & Time</Label>
                <Input 
                  id="eventDate" 
                  type="datetime-local" 
                  required 
                  className="h-16 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="venue" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Venue Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] w-5 h-5" />
                  <Input 
                    id="venue" 
                    required 
                    placeholder="Eko Hotel & Suites, VI, Lagos"
                    className="h-16 pl-14 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Section 3: Aesthetic */}
          <GlassCard className="p-12 border-white/5">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                <Palette className="text-[#D4AF37] w-5 h-5" />
              </div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Visual Aesthetic</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {themes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, theme: t.id })}
                  className={`relative p-8 border transition-all duration-500 text-left group ${
                    formData.theme === t.id 
                      ? 'border-[#D4AF37] bg-[#D4AF37]/5' 
                      : 'border-white/5 hover:border-white/20 bg-white/5'
                  }`}
                >
                  <div className="flex justify-between items-start mb-8">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${formData.theme === t.id ? 'text-[#D4AF37]' : 'text-gray-500'}`}>
                      {t.label}
                    </span>
                    {formData.theme === t.id && <Check className="text-[#D4AF37] w-4 h-4" />}
                  </div>
                  <div className="flex gap-2">
                    <div className={`w-8 h-8 ${t.accent} border border-white/10`} />
                    <div className={`w-8 h-8 ${t.color} border border-white/10`} />
                  </div>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <Label htmlFor="photo" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Cover Portrait</Label>
              <div className="relative group">
                <div className="h-40 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 group-hover:border-[#D4AF37]/30 transition-colors">
                  <ImageIcon className="text-gray-600 w-8 h-8" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                    {formData.photo ? formData.photo.name : 'Upload High-Resolution Image'}
                  </span>
                </div>
                <Input 
                  id="photo" 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileChange} 
                />
              </div>
            </div>
          </GlassCard>

          {/* Section 4: Message */}
          <GlassCard className="p-12 border-white/5">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                <Sparkles className="text-[#D4AF37] w-5 h-5" />
              </div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Host's Message</h2>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="message" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Personal Note to Guests</Label>
              <Textarea 
                id="message" 
                placeholder="Share a few words about your celebration..."
                className="min-h-[150px] bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light leading-relaxed"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
          </GlassCard>

          <div className="pt-12">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500 group"
            >
              {loading ? 'Processing...' : (
                <span className="flex items-center justify-center gap-4">
                  Finalize & Proceed to Payment <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;