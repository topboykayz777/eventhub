"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import InfoButton from '@/components/InfoButton';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess, showError } from '@/utils/toast';
import { 
  Sparkles, Calendar, Type, Image as ImageIcon, 
  Upload, X, Crown, Gem, Sun, Moon, Flower2, Waves, Heart, 
  Landmark, Star, PenTool, Navigation, Camera, Ghost, Tent, 
  Trees as Palmtree, Cherry, ZapIcon, Palette, Loader2, ArrowRight, ArrowLeft, Plus, Trash2
} from 'lucide-react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from 'framer-motion';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    venue: '',
    venue_map_url: '',
    message: '',
    plan: 'beta',
    theme: 'modern',
    photo_url: '',
    gallery_urls: [] as string[]
  });

  useEffect(() => {
    const savedDraft = localStorage.getItem('eventhub_pending_draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setFormData(prev => ({ ...prev, ...draft }));
        showSuccess("We've restored your progress.");
      } catch (e) {
        console.error("Failed to restore draft", e);
      }
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      localStorage.setItem('eventhub_pending_draft', JSON.stringify(formData));
      showError("Please sign up first to upload portraits and save your event.");
      navigate('/signup');
      return;
    }

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

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      localStorage.setItem('eventhub_pending_draft', JSON.stringify(formData));
      showError("Please sign up first to add images to your gallery.");
      navigate('/signup');
      return;
    }

    if (formData.gallery_urls.length >= 30) {
      showError('Maximum limit of 30 gallery items reached.');
      return;
    }

    setGalleryUploading(true);
    const newUrls: string[] = [];
    try {
      const remainingSlots = 30 - formData.gallery_urls.length;
      const filesToUpload = Array.from(e.target.files).slice(0, remainingSlots);

      for (const file of filesToUpload) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('event-photos').upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('event-photos').getPublicUrl(fileName);
        newUrls.push(publicUrl);
      }
      setFormData(prev => ({ ...prev, gallery_urls: [...prev.gallery_urls, ...newUrls].slice(0, 30) }));
      showSuccess(`${newUrls.length} file(s) added to gallery.`);
    } catch (error: any) {
      showError('Gallery upload failed: ' + error.message);
    } finally {
      setGalleryUploading(false);
    }
  };

  const removeGalleryItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery_urls: prev.gallery_urls.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      localStorage.setItem('eventhub_pending_draft', JSON.stringify(formData));
      showSuccess("Draft saved. Join the elite to finalize your celebration.");
      navigate('/signup');
      return;
    }

    if (!formData.photo_url) {
      showError('Please upload a cover portrait.');
      return;
    }
    
    setLoading(true);

    try {
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
        photo_url: formData.photo_url,
        gallery_urls: formData.gallery_urls.slice(0, 30)
      }).select().single();

      if (error) throw error;
      
      localStorage.removeItem('eventhub_pending_draft');
      showSuccess('Event created! Proceeding to activation.');
      navigate(`/payment/${event.id}`);
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

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-24 md:py-32 px-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-24 text-center flex flex-col items-center"
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-8 text-muted-foreground hover:text-[#D4AF37] p-0 flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
          </Button>
          <span className="text-[#D4AF37] text-[10px] font-black tracking-[0.5em] uppercase mb-4 block">The Studio</span>
          <h1 className="text-4xl md:text-7xl font-serif italic leading-tight text-center">
            Create Your <span className="text-[#D4AF37]">Event</span>
          </h1>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-12 md:space-y-20">
          <motion.div className="bg-card border border-border p-8 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="flex flex-col items-center gap-4 border-b border-border pb-8 mb-12">
              <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                <span className="text-[#D4AF37] font-black text-xs">01</span>
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground text-center flex items-center justify-center gap-2">
                The Identity <InfoButton text="Define the core details of your celebration, including its public title and access tier." />
              </span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-3 flex flex-col items-center">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-center text-center">
                  Event Title <InfoButton text="Enter the name of your event. This title will be the headline on your public page." />
                </Label>
                <input required className="h-16 w-full px-4 bg-transparent border-b border-border rounded-none focus:border-[#D4AF37] text-2xl md:text-3xl font-serif italic outline-none transition-all placeholder:text-muted-foreground/30 text-foreground text-center" value={formData.eventName} onChange={(e) => setFormData({ ...formData, eventName: e.target.value })} />
              </div>
              <div className="space-y-3 flex flex-col items-center">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-center text-center">
                  Access Level <InfoButton text="Select your orchestration tier. The Free Beta tier unlocks all premium features." />
                </Label>
                <Select onValueChange={(v) => setFormData({ ...formData, plan: v })} defaultValue={formData.plan}>
                  <SelectTrigger className="h-16 bg-secondary border border-border rounded-[1.5rem] text-sm font-bold uppercase tracking-widest text-[#D4AF37] px-6">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border text-foreground rounded-2xl">
                    <SelectItem value="beta">Free Beta Access (Full Suite)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          <motion.div className="bg-card border border-border p-8 md:p-16 rounded-[3rem] shadow-2xl relative">
            <div className="flex flex-col items-center gap-4 border-b border-border pb-8 mb-12">
              <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                <span className="text-[#D4AF37] font-black text-xs">02</span>
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground text-center flex items-center justify-center gap-2">
                The Logistics <InfoButton text="Specify when and where your guests should gather. You can also link a Google Maps URL for seamless navigation." />
              </span>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12 mb-12">
              <div className="space-y-3 flex flex-col items-center">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-center text-center">
                  Date & Time <InfoButton text="Set the official date and start time for your celebration." />
                </Label>
                <input type="datetime-local" required className="h-16 w-full px-6 bg-secondary border-border rounded-2xl focus:border-[#D4AF37] text-lg font-light text-foreground text-center" value={formData.eventDate} onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })} />
              </div>
              <div className="space-y-3 flex flex-col items-center">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-center text-center">
                  Venue Name <InfoButton text="Enter the name of the hall, garden, or estate hosting your event." />
                </Label>
                <input required className="h-16 w-full px-6 bg-secondary border-border rounded-2xl focus:border-[#D4AF37] text-lg font-light text-foreground text-center" value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} />
              </div>
              <div className="space-y-3 flex flex-col items-center">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-center text-center">
                  Location GPS <InfoButton text="Paste a Google Maps share link to give guests one-tap navigation." />
                </Label>
                <input className="h-16 w-full px-6 bg-secondary border-border rounded-2xl focus:border-[#D4AF37] text-lg font-light text-foreground text-center" placeholder="Google Maps Link" value={formData.venue_map_url} onChange={(e) => setFormData({ ...formData, venue_map_url: e.target.value })} />
              </div>
            </div>
          </motion.div>

          <motion.div className="bg-card border border-border p-8 md:p-16 rounded-[3.5rem] shadow-2xl relative">
            <div className="flex flex-col items-center gap-4 border-b border-border pb-8 mb-12">
              <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                <span className="text-[#D4AF37] font-black text-xs">03</span>
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground text-center flex items-center justify-center gap-2">
                The Presentation <InfoButton text="Upload a cinematic cover portrait or video loop, and curate a memory wall gallery of captured moments." />
              </span>
            </div>
            
            <div className="space-y-8 flex flex-col items-center">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-center text-center">
                Cover Portrait <InfoButton text="Upload the primary visual backdrop of your event page." />
              </Label>
              {formData.photo_url ? (
                <div className="relative aspect-video w-full overflow-hidden border border-border group rounded-[2.5rem]">
                  <img src={formData.photo_url} className="w-full h-full object-cover" alt="" />
                  <button type="button" onClick={() => setFormData({ ...formData, photo_url: '' })} className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest gap-2">
                    <X size={18} /> Discard Image
                  </button>
                </div>
              ) : (
                <Label htmlFor="photo-upload" className="cursor-pointer w-full">
                  <div className="h-72 border-2 border-dashed border-border flex flex-col items-center justify-center gap-6 hover:bg-secondary transition-all bg-secondary/50 rounded-[2.5rem]">
                    {uploading ? <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" /> : <Upload className="text-muted-foreground w-8 h-8 group-hover:text-[#D4AF37]" />}
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground">Upload Media</span>
                  </div>
                </Label>
              )}
              <input id="photo-upload" type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
            </div>

            {/* Gallery Section */}
            <div className="space-y-8 pt-12 mt-12 border-t border-border w-full">
              <div className="flex justify-between items-end">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center">
                  Memory Wall Gallery <InfoButton text="Upload multiple photos or videos to showcase moments from the event. These will appear in a grid on your live page." />
                </Label>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  {formData.gallery_urls.length} / 30 Files Max
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <AnimatePresence>
                  {formData.gallery_urls.slice(0, 30).map((url, i) => (
                    <motion.div key={url} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative aspect-square rounded-2xl overflow-hidden border border-border group">
                      <img src={url} className="w-full h-full object-cover" alt="" />
                      <button type="button" onClick={() => removeGalleryItem(i)} className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={12} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {formData.gallery_urls.length < 30 && (
                  <Label htmlFor="gallery-upload" className="cursor-pointer">
                    <div className="aspect-square border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:bg-secondary transition-all bg-secondary/50 rounded-2xl">
                      {galleryUploading ? <Loader2 className="w-6 h-6 animate-spin text-[#D4AF37]" /> : <Plus className="text-muted-foreground w-6 h-6" />}
                      <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground text-center px-2">Add Gallery Image</span>
                    </div>
                  </Label>
                )}
              </div>
              <input id="gallery-upload" type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleGalleryUpload} disabled={galleryUploading} />
            </div>

            {/* Guest Directive Section */}
            <div className="space-y-3 pt-12 mt-12 border-t border-border w-full">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center">
                Guest Directive <InfoButton text="Write a personalized invitation message or special instructions for your attendees." />
              </Label>
              <Textarea 
                className="min-h-[180px] bg-secondary border-border rounded-[2rem] focus:border-[#D4AF37] text-lg font-light resize-none px-8 py-8 text-foreground" 
                placeholder="Write your invitation message here..."
                value={formData.message} 
                onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
              />
            </div>
          </motion.div>

          <motion.div className="bg-card border border-border p-8 md:p-16 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
            <div className="flex flex-col items-center border-b border-border pb-8 mb-12">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                  <span className="text-[#D4AF37] font-black text-xs">04</span>
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground text-center flex items-center justify-center gap-2">
                  The Aesthetic <InfoButton text="Select a visual DNA theme that perfectly matches the atmosphere and prestige of your celebration." />
                </span>
              </div>
            </div>
            
            <ScrollArea className="w-full whitespace-nowrap -mx-6 px-6 pb-12">
              <div className="flex gap-8">
                {themes.map((t) => (
                  <button key={t.id} type="button" onClick={() => setFormData({ ...formData, theme: t.id })} className={`relative w-64 h-48 shrink-0 border-2 transition-all rounded-[2.5rem] overflow-hidden ${formData.theme === t.id ? 'border-[#D4AF37] scale-[1.05] shadow-xl' : 'border-border opacity-60 hover:opacity-100'}`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${t.color}`} />
                    <div className="relative z-10 p-8 flex flex-col justify-between items-center h-full">
                      <t.icon className={`w-10 h-10 ${t.light ? 'text-black' : 'text-white'}`} />
                      <span className={`text-[11px] font-black uppercase tracking-[0.2em] block ${t.light ? 'text-black' : 'text-white'}`}>{t.label}</span>
                    </div>
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="bg-secondary h-2" />
            </ScrollArea>
          </motion.div>

          <div className="pt-20 text-center">
            <Button type="submit" disabled={loading || uploading || galleryUploading} className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black h-24 rounded-[2.5rem] text-[12px] md:text-[14px] font-black tracking-[0.5em] uppercase transition-all duration-500 shadow-2xl group relative overflow-hidden">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <span className="flex items-center justify-center gap-4 relative z-10">Initialize Orchestration <ArrowRight className="w-5 h-5 group-hover:translate-x-4 transition-transform" /></span>}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;