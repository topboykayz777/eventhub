"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import InfoButton from '@/components/InfoButton';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { showSuccess, showError } from '@/utils/toast';
import { 
  Sparkles, Image as ImageIcon, Upload, X, Crown, Gem, Sun, Moon, 
  Flower2, Waves, Heart, Landmark, Star, PenTool, Navigation, Camera, 
  Ghost, Tent, Trees as Palmtree, Cherry, ZapIcon, Palette, Loader2, ArrowLeft, Save
} from 'lucide-react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion } from 'framer-motion';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    venue: '',
    venue_map_url: '',
    message: '',
    theme: 'modern',
    photo_url: ''
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
        if (error) throw error;
        setFormData({
          eventName: data.event_name,
          venue: data.venue,
          venue_map_url: data.venue_map_url || '',
          message: data.message || '',
          theme: data.theme || 'modern',
          photo_url: data.photo_url || ''
        });
      } catch (err: any) {
        showError(err.message);
        navigate('/dashboard');
      } finally {
        setFetching(false);
      }
    };
    fetchEvent();
  }, [id, navigate]);

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
      showSuccess('Portrait updated.');
    } catch (error: any) {
      showError('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // FIX: Changed .eq(id, 'id') to .eq('id', id) to fix the "column does not exist" error
      const { error } = await supabase.from('events').update({
        event_name: formData.eventName,
        venue: formData.venue,
        venue_map_url: formData.venue_map_url,
        message: formData.message,
        theme: formData.theme,
        photo_url: formData.photo_url
      }).eq('id', id);

      if (error) throw error;
      showSuccess('Event orchestrated successfully.');
      navigate('/dashboard');
    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const themes = [
    { id: 'modern', label: 'Midnight Noir', color: 'from-gray-900 to-black', icon: Sparkles },
    { id: 'traditional', label: 'Royal Heritage', color: 'from-emerald-900 to-green-950', icon: Crown },
    { id: 'elegant', label: 'Pure Ivory', color: 'from-slate-50 to-slate-200', icon: Gem, light: true },
    { id: 'sahara', label: 'Sahara Gold', color: 'from-amber-600 to-orange-900', icon: Sun },
    { id: 'velvet', label: 'Midnight Velvet', color: 'from-purple-900 to-indigo-950', icon: Moon },
    { id: 'garden', label: 'Emerald Garden', color: 'from-teal-800 to-emerald-950', icon: Flower2 },
    { id: 'oceanic', label: 'Oceanic Silk', color: 'from-blue-800 to-blue-950', icon: Waves },
    { id: 'rose', label: 'Sunset Rose', color: 'from-rose-700 to-rose-950', icon: Heart },
    { id: 'earth', label: 'Ancestral Earth', color: 'from-orange-900 to-stone-950', icon: Landmark },
    { id: 'silver', label: 'Celestial Silver', color: 'from-slate-400 to-slate-600', icon: Star },
    { id: 'dynasty', label: 'Crimson Dynasty', color: 'from-red-800 to-red-950', icon: Crown },
    { id: 'vintage', label: 'Vintage Parchment', color: 'from-amber-50 to-orange-100', icon: PenTool, light: true },
    { id: 'neon', label: 'Electric Pulse', color: 'from-cyan-400 to-blue-600', icon: ZapIcon },
    { id: 'royal', label: 'Royal Amethyst', color: 'from-purple-700 to-fuchsia-950', icon: Crown },
    { id: 'blossom', label: 'Sakura Spring', color: 'from-pink-50 to-rose-100', icon: Cherry, light: true },
    { id: 'tropic', label: 'Tropical Jungle', color: 'from-green-600 to-teal-900', icon: Palmtree },
    { id: 'desert', label: 'Oasis Blue', color: 'from-sky-400 to-indigo-800', icon: Tent },
    { id: 'glitch', label: 'Glitch Noir', color: 'from-red-600 to-black', icon: Ghost },
    { id: 'minimal', label: 'Bauhaus Minimal', color: 'from-blue-600 to-slate-900', icon: Palette },
    { id: 'noir', label: 'Noir Cinema', color: 'from-gray-100 to-gray-400', icon: Camera, light: true }
  ];

  if (fetching) {
    return <div className="flex items-center justify-center min-h-screen bg-background"><Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" /></div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-24 md:py-32 px-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')} 
            className="mb-8 text-muted-foreground hover:text-[#D4AF37] p-0 flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </Button>
          <span className="text-[#D4AF37] text-[10px] font-black tracking-[0.5em] uppercase mb-4 block">The Atelier</span>
          <h1 className="text-4xl md:text-7xl font-serif italic leading-tight">
            Refine Your <span className="text-[#D4AF37]">Presence</span>
          </h1>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="bg-card border border-border p-8 md:p-16 rounded-[3rem] shadow-2xl space-y-12">
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center">
                Event Title <InfoButton text="Update the name of your event. This changes instantly on the live page." />
              </Label>
              <input 
                required 
                className="h-16 w-full px-0 bg-transparent border-b border-border rounded-none focus:border-[#D4AF37] text-2xl md:text-3xl font-serif italic outline-none transition-all placeholder:text-muted-foreground/30 text-foreground" 
                value={formData.eventName} 
                onChange={(e) => setFormData({ ...formData, eventName: e.target.value })} 
              />
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center">
                  Venue Name <InfoButton text="Adjust the location title for your guests." />
                </Label>
                <Input 
                  required 
                  className="h-16 px-6 bg-secondary border-border rounded-2xl focus:border-[#D4AF37] text-lg font-light text-foreground" 
                  value={formData.venue} 
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })} 
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center">
                  Location GPS <InfoButton text="Update the Google Maps link for navigation." />
                </Label>
                <div className="relative">
                  <Navigation className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4AF37] w-4 h-4 opacity-50" />
                  <Input 
                    className="h-16 pl-16 bg-secondary border-border rounded-2xl focus:border-[#D4AF37] text-sm font-light text-foreground" 
                    value={formData.venue_map_url} 
                    onChange={(e) => setFormData({ ...formData, venue_map_url: e.target.value })} 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center">
                Cover Portrait <InfoButton text="Change the primary visual backdrop of your event." />
              </Label>
              {formData.photo_url ? (
                <div className="relative aspect-video w-full overflow-hidden border border-border group rounded-[2.5rem] shadow-2xl">
                  <img src={formData.photo_url} className="w-full h-full object-cover" alt="Preview" />
                  <button 
                    type="button" 
                    onClick={() => setFormData({ ...formData, photo_url: '' })} 
                    className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest gap-2"
                  >
                    <X size={18} /> Update Media
                  </button>
                </div>
              ) : (
                <Label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="h-72 border-2 border-dashed border-border flex flex-col items-center justify-center gap-6 hover:bg-secondary transition-all bg-secondary/50 group rounded-[2.5rem]">
                    {uploading ? <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" /> : <Upload className="text-muted-foreground w-8 h-8 group-hover:text-[#D4AF37]" />}
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground">Change Media</span>
                  </div>
                </Label>
              )}
              <input id="photo-upload" type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center">
                Guest Directive <InfoButton text="Update the personalized message for your attendees." />
              </Label>
              <Textarea 
                className="min-h-[180px] bg-secondary border-border rounded-[2rem] focus:border-[#D4AF37] text-lg font-light resize-none px-8 py-8 text-foreground" 
                value={formData.message} 
                onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
              />
            </div>
          </div>

          <div className="bg-card border border-border p-8 md:p-16 rounded-[3.5rem] shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-8 mb-12">
              <div className="flex items-center">
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground">Update DNA</span>
                <InfoButton text="Select a new visual theme. Each choice instantly transforms the atmosphere of your event page." />
              </div>
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Swipe Themes</span>
            </div>
            
            <ScrollArea className="w-full whitespace-nowrap -mx-6 px-6 pb-12">
              <div className="flex gap-8">
                {themes.map((t) => (
                  <button 
                    key={t.id} 
                    type="button" 
                    onClick={() => setFormData({ ...formData, theme: t.id })} 
                    className={`relative w-64 h-48 shrink-0 border-2 transition-all text-left overflow-hidden group rounded-[2.5rem] ${
                      formData.theme === t.id ? 'border-[#D4AF37] scale-[1.05] shadow-[0_0_50px_rgba(212,175,55,0.3)]' : 'border-border opacity-60 hover:opacity-100 hover:border-[#D4AF37]/30'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${t.color}`} />
                    <div className="relative z-10 p-8 flex flex-col justify-between h-full">
                      <t.icon className={`w-10 h-10 ${t.light ? 'text-black' : 'text-white'}`} />
                      <span className={`text-[11px] font-black uppercase tracking-[0.2em] block ${t.light ? 'text-black' : 'text-white'}`}>{t.label}</span>
                    </div>
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="bg-secondary h-2 rounded-full" />
            </ScrollArea>
          </div>

          <div className="pt-12">
            <Button 
              type="submit" 
              disabled={loading || uploading} 
              className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black h-24 rounded-[2.5rem] text-[14px] font-black tracking-[0.5em] uppercase transition-all duration-500 shadow-2xl group"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <span className="flex items-center gap-4">Save Orchestration <Save size={20} /></span>}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;