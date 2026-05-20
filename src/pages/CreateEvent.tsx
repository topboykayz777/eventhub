"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess, showError } from '@/utils/toast';
import { 
  Info, Sparkles, Calendar, Type, Image as ImageIcon, 
  Upload, X, Crown, Gem, Sun, Moon, Flower2, Waves, Heart, 
  Landmark, Star, PenTool, Navigation, Camera, Ghost, Tent, 
  Trees as Palmtree, Cherry, ZapIcon, Palette, Loader2, ArrowRight
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const InfoButton = ({ text }: { text: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="inline-flex items-center justify-center ml-2 text-gray-500 hover:text-[#D4AF37] transition-colors">
          <Info size={14} className="opacity-50" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="bg-white/10 backdrop-blur-xl border-white/10 text-white text-[10px] font-medium uppercase tracking-widest p-4 max-w-[200px]">
        {text}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

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
    plan: 'beta',
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
      const { error: uploadError } = await supabase.storage.from('event-photos').upload(fileName, file);
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
      if (!user) { navigate('/login'); return; }

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
    { id: 'neon', label: 'Electric Pulse', color: 'bg-[#00f3ff]', icon: ZapIcon },
    { id: 'royal', label: 'Royal Amethyst', color: 'bg-[#3b0764]', icon: Crown },
    { id: 'blossom', label: 'Sakura Spring', color: 'bg-[#fff1f2]', icon: Cherry },
    { id: 'tropic', label: 'Tropical Jungle', color: 'bg-[#0d9488]', icon: Palmtree },
    { id: 'desert', label: 'Oasis Blue', color: 'bg-[#d97706]', icon: Tent },
    { id: 'glitch', label: 'Glitch Noir', color: 'bg-[#ef4444]', icon: Ghost },
    { id: 'minimal', label: 'Bauhaus Minimal', color: 'bg-[#2563eb]', icon: Palette },
    { id: 'noir', label: 'Noir Cinema', color: 'bg-white', icon: Camera }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-black">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-24 md:py-32 px-6">
        <div className="mb-20">
          <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">The Studio</span>
          <h1 className="text-4xl md:text-6xl font-serif italic leading-tight">
            New <span className="text-[#D4AF37]">Celebration</span>
          </h1>
          <p className="text-gray-500 text-sm font-light mt-4 max-w-md">Design the digital heart of your event. Simple details, stunning results.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-16">
          {/* Section: The Basics */}
          <div className="space-y-10">
            <div className="flex items-center gap-4 border-b border-white/5 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">01. The Basics</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-500 flex items-center">
                  Event Title <InfoButton text="Give your celebration a name that guests will recognize." />
                </Label>
                <input 
                  required 
                  placeholder="The Balogun Gala..." 
                  className="h-16 w-full px-0 bg-transparent border-b border-white/10 rounded-none focus:border-[#D4AF37] text-2xl font-serif italic outline-none transition-all placeholder:text-gray-800" 
                  value={formData.eventName} 
                  onChange={(e) => setFormData({ ...formData, eventName: e.target.value })} 
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-500 flex items-center">
                  Access Level <InfoButton text="Beta access is currently free and includes all premium features." />
                </Label>
                <Select onValueChange={(v) => setFormData({ ...formData, plan: v })} defaultValue="beta">
                  <SelectTrigger className="h-16 bg-white/5 border-white/10 rounded-none text-base font-light">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                    <SelectItem value="beta" className="text-[#D4AF37] font-bold">Free Beta Access (Full Suite)</SelectItem>
                    <SelectItem value="Basic" disabled className="opacity-30">Basic Tier (Coming Soon)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section: Details */}
          <div className="space-y-10">
            <div className="flex items-center gap-4 border-b border-white/5 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">02. Details</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-500 flex items-center">
                  When is it? <InfoButton text="Set the start date and time for your event." />
                </Label>
                <input 
                  type="datetime-local" 
                  required 
                  className="h-16 w-full px-6 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37] text-lg font-light outline-none" 
                  value={formData.eventDate} 
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })} 
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-500 flex items-center">
                  Where is it? <InfoButton text="The name of the venue or hall." />
                </Label>
                <input 
                  required 
                  placeholder="Eko Hotel & Suites..." 
                  className="h-16 w-full px-6 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37] text-lg font-light outline-none" 
                  value={formData.venue} 
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })} 
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-500 flex items-center">
                Location Pin <InfoButton text="Paste a Google Maps link so guests can get directions easily." />
              </Label>
              <div className="relative">
                <Navigation className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4AF37] w-4 h-4 opacity-50" />
                <input 
                  placeholder="Paste Google Maps 'Share' link..." 
                  className="h-16 w-full pl-16 px-6 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37] text-base font-light outline-none" 
                  value={formData.venue_map_url} 
                  onChange={(e) => setFormData({ ...formData, venue_map_url: e.target.value })} 
                />
              </div>
            </div>
          </div>

          {/* Section: Visuals */}
          <div className="space-y-10">
            <div className="flex items-center gap-4 border-b border-white/5 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">03. Visuals</span>
            </div>
            
            <div className="space-y-6">
              <Label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-500 flex items-center">
                Cover Portrait <InfoButton text="This image will be the face of your event page." />
              </Label>
              {formData.photo_url ? (
                <div className="relative aspect-video w-full overflow-hidden border border-white/10 group">
                  <img src={formData.photo_url} className="w-full h-full object-cover" alt="Preview" />
                  <button 
                    type="button" 
                    onClick={() => setFormData({ ...formData, photo_url: '' })} 
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2"
                  >
                    <X size={20} /> Remove Image
                  </button>
                </div>
              ) : (
                <Label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="h-64 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 hover:border-[#D4AF37]/50 transition-all bg-white/5 group">
                    {uploading ? (
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" />
                        <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500">Uploading Artwork...</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="text-gray-700 w-10 h-10 group-hover:text-[#D4AF37] transition-colors" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Upload High-Res Portrait</span>
                      </>
                    )}
                  </div>
                </Label>
              )}
              <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-500 flex items-center">
                A Note to Guests <InfoButton text="A personal welcome message or dress code instructions." />
              </Label>
              <Textarea 
                placeholder="Write something heartfelt..." 
                className="min-h-[150px] bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37] text-lg font-light resize-none px-6 py-6" 
                value={formData.message} 
                onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
              />
            </div>
          </div>

          {/* Section: The Vibe */}
          <div className="space-y-10">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">04. The Vibe</span>
              <div className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Scroll to see all <InfoButton text="Pick a color palette and style that fits your event's character." />
              </div>
            </div>
            
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-6 pb-6">
                {themes.map((t) => (
                  <button 
                    key={t.id} 
                    type="button" 
                    onClick={() => setFormData({ ...formData, theme: t.id })} 
                    className={`relative w-48 h-32 shrink-0 border transition-all text-left overflow-hidden ${
                      formData.theme === t.id ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                      <t.icon className={`w-5 h-5 ${formData.theme === t.id ? 'text-[#D4AF37]' : 'text-gray-700'}`} />
                      <span className="text-[8px] font-bold uppercase tracking-widest">{t.label}</span>
                    </div>
                    <div className={`absolute top-0 right-0 w-12 h-12 ${t.color} opacity-10 -mr-6 -mt-6 rotate-45`} />
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="bg-white/5" />
            </ScrollArea>
          </div>

          <div className="pt-16">
            <Button 
              type="submit" 
              disabled={loading || uploading} 
              className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black h-24 rounded-none text-[12px] font-black tracking-[0.5em] uppercase transition-all duration-500 shadow-2xl group"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <span className="flex items-center gap-4">
                  Finalize & Create <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </span>
              )}
            </Button>
            <p className="text-center text-[8px] font-bold text-gray-600 uppercase tracking-[0.4em] mt-8">
              Step 1 of 2: Orchestration Activation
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;