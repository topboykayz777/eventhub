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
  Trees as Palmtree, Cherry, ZapIcon, Palette, Loader2, ArrowRight, ArrowLeft
} from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion } from 'framer-motion';

const InfoButton = ({ text }: { text: string }) => (
  <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="inline-flex items-center justify-center ml-2 text-muted-foreground hover:text-[#D4AF37] transition-all hover:scale-110">
          <Info size={14} className="opacity-60" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="bg-popover border-border text-foreground text-[11px] font-medium leading-relaxed p-4 max-w-[240px] shadow-2xl rounded-2xl z-[200]">
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
          <h1 className="text-4xl md:text-7xl font-serif italic leading-tight">
            Create Your <span className="text-[#D4AF37]">Event</span>
          </h1>
          <p className="text-muted-foreground text-sm font-light mt-4 max-w-md leading-relaxed">
            Fill in the particulars of your celebration to begin the digital orchestration.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-12 md:space-y-20">
          {/* Card 01: Identity */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-card border border-border p-8 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden group"
          >
            <div className="flex flex-col items-center gap-4 border-b border-border pb-8 mb-12">
              <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                <span className="text-[#D4AF37] font-black text-xs">01</span>
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground">The Identity</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-3 flex flex-col items-center">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-center">
                  Event Title <InfoButton text="Enter the name of your event. This title will be the headline on your public page and printed on every guest's digital pass." />
                </Label>
                <input 
                  required 
                  placeholder="The Balogun Gala..." 
                  className="h-16 w-full px-0 bg-transparent border-b border-border rounded-none focus:border-[#D4AF37] text-2xl md:text-3xl font-serif italic outline-none transition-all placeholder:text-muted-foreground/30 text-foreground text-center placeholder:text-center" 
                  value={formData.eventName} 
                  onChange={(e) => setFormData({ ...formData, eventName: e.target.value })} 
                />
              </div>
              <div className="space-y-3 flex flex-col items-center">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-center">
                  Access Level <InfoButton text="Beta is our all-access pass. It unlocks everything from the live Vibe Screen for your ballroom to the industrial WhatsApp dispatcher." />
                </Label>
                <Select onValueChange={(v) => setFormData({ ...formData, plan: v })} defaultValue="beta">
                  <SelectTrigger className="h-16 bg-secondary border border-border rounded-[1.5rem] text-sm font-bold uppercase tracking-widest text-[#D4AF37] px-6 flex justify-center">
                    <SelectValue className="text-center" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border text-foreground rounded-2xl">
                    <SelectItem value="beta" className="justify-center">Free Beta Access (Full Suite)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          {/* Card 02: Logistics */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-card border border-border p-8 md:p-16 rounded-[3rem] shadow-2xl relative"
          >
            <div className="flex flex-col items-center gap-4 border-b border-border pb-8 mb-12">
              <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                <span className="text-[#D4AF37] font-black text-xs">02</span>
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground">The Logistics</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div className="space-y-3 flex flex-col items-center">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-center">
                  Date & Time <InfoButton text="Specify the start time. A live countdown will appear on your page, building anticipation for your guests until the moment you begin." />
                </Label>
                <input 
                  type="datetime-local" 
                  required 
                  className="h-16 w-full px-6 bg-secondary border border-border rounded-2xl focus:border-[#D4AF37] text-lg font-light outline-none transition-all text-foreground text-center" 
                  value={formData.eventDate} 
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })} 
                />
              </div>
              <div className="space-y-3 flex flex-col items-center">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-center">
                  Venue Name <InfoButton text="Where is the magic happening? This address will be clearly displayed for all guests to see on their invitations." />
                </Label>
                <input 
                  required 
                  placeholder="Eko Hotel & Suites..." 
                  className="h-16 w-full px-6 bg-secondary border border-border rounded-2xl focus:border-[#D4AF37] text-lg font-light outline-none transition-all text-foreground placeholder:text-muted-foreground/40 text-center placeholder:text-center" 
                  value={formData.venue} 
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })} 
                />
              </div>
            </div>

            <div className="space-y-3 flex flex-col items-center">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-center">
                Location GPS <InfoButton text="Copy the 'Share' link from Google Maps and paste it here. Guests will see a 'Navigate' button for one-tap directions to the gate." />
              </Label>
              <div className="relative w-full max-w-lg">
                <Navigation className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4AF37] w-4 h-4 opacity-50" />
                <input 
                  placeholder="Paste Google Maps 'Share' link here..." 
                  className="h-16 w-full pl-16 pr-6 bg-secondary border border-border rounded-2xl focus:border-[#D4AF37] text-sm font-light outline-none transition-all text-foreground placeholder:text-muted-foreground/40 text-center placeholder:text-center" 
                  value={formData.venue_map_url} 
                  onChange={(e) => setFormData({ ...formData, venue_map_url: e.target.value })} 
                />
              </div>
            </div>
          </motion.div>

          {/* Card 03: Presentation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-card border border-border p-8 md:p-16 rounded-[3.5rem] shadow-2xl relative"
          >
            <div className="flex flex-col items-center gap-4 border-b border-border pb-8 mb-12">
              <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                <span className="text-[#D4AF37] font-black text-xs">03</span>
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground">The Presentation</span>
            </div>
            
            <div className="space-y-8 flex flex-col items-center">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-center">
                Cover Portrait <InfoButton text="Choose a stunning image or a 15-second video. This cinematic backdrop is the first thing guests see when they open your link." />
              </Label>
              {formData.photo_url ? (
                <div className="relative aspect-video w-full overflow-hidden border border-border group rounded-[2.5rem] shadow-2xl">
                  <img src={formData.photo_url} className="w-full h-full object-cover" alt="Preview" />
                  <button 
                    type="button" 
                    onClick={() => setFormData({ ...formData, photo_url: '' })} 
                    className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest gap-2"
                  >
                    <X size={18} /> Discard Image
                  </button>
                </div>
              ) : (
                <Label htmlFor="photo-upload" className="cursor-pointer w-full">
                  <div className="h-72 border-2 border-dashed border-border flex flex-col items-center justify-center gap-6 hover:bg-secondary transition-all bg-secondary/50 group rounded-[2.5rem]">
                    {uploading ? (
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Processing Artwork...</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Upload className="text-muted-foreground w-8 h-8 group-hover:text-[#D4AF37] transition-all" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground">Upload Media</span>
                      </>
                    )}
                  </div>
                </Label>
              )}
              <input id="photo-upload" type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
            </div>

            <div className="mt-12 space-y-3 flex flex-col items-center">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-center">
                Guest Directive <InfoButton text="Share a personal welcome or dress code instructions. This appears in the 'Particulars' section of your page." />
              </Label>
              <Textarea 
                placeholder="Share dress code, parking info, or a warm welcome..." 
                className="min-h-[180px] bg-secondary border border-border rounded-[2rem] focus:border-[#D4AF37] text-lg font-light resize-none px-8 py-8 leading-relaxed outline-none transition-all text-foreground placeholder:text-muted-foreground/30 text-center placeholder:text-center" 
                value={formData.message} 
                onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
              />
            </div>
          </motion.div>

          {/* Card 04: The Aesthetic */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-card border border-border p-8 md:p-16 rounded-[3.5rem] shadow-2xl relative overflow-hidden"
          >
            <div className="flex flex-col items-center border-b border-border pb-8 mb-12">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                  <span className="text-[#D4AF37] font-black text-xs">04</span>
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground">The Aesthetic</span>
              </div>
              <div className="flex items-center text-[9px] font-black text-muted-foreground uppercase tracking-widest text-center">
                Swipe to explore <InfoButton text="Select a visual DNA. Each theme changes the typography, color palette, and atmosphere of your entire event page to match your prestige level." />
              </div>
            </div>
            
            <ScrollArea className="w-full whitespace-nowrap -mx-6 px-6 pb-12">
              <div className="flex gap-8">
                {themes.map((t) => (
                  <button 
                    key={t.id} 
                    type="button" 
                    onClick={() => setFormData({ ...formData, theme: t.id })} 
                    className={`relative w-64 h-48 shrink-0 border-2 transition-all text-center overflow-hidden group rounded-[2.5rem] ${
                      formData.theme === t.id ? 'border-[#D4AF37] scale-[1.05] shadow-[0_0_50px_rgba(212,175,55,0.3)]' : 'border-border opacity-60 hover:opacity-100 hover:border-[#D4AF37]/30'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${t.color}`} />
                    <div className="relative z-10 p-8 flex flex-col justify-between items-center h-full">
                      <t.icon className={`w-10 h-10 transition-transform duration-500 group-hover:scale-125 ${t.light ? 'text-black' : 'text-white'}`} />
                      <div className="flex flex-col items-center">
                        <span className={`text-[11px] font-black uppercase tracking-[0.2em] block mb-1 ${t.light ? 'text-black' : 'text-white'}`}>{t.label}</span>
                        {formData.theme === t.id && (
                          <motion.span 
                            layoutId="activeTheme"
                            className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37] bg-black/60 px-3 py-1.5 rounded-full"
                          >
                            Selected
                          </motion.span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="bg-secondary h-2 rounded-full" />
            </ScrollArea>
          </motion.div>

          <div className="pt-20 text-center flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full"
            >
              <Button 
                type="submit" 
                disabled={loading || uploading} 
                className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black h-24 rounded-[2.5rem] text-[14px] font-black tracking-[0.5em] uppercase transition-all duration-500 shadow-2xl group relative overflow-hidden"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <span className="flex items-center justify-center gap-4 relative z-10">
                    Initialize Orchestration <ArrowRight className="w-6 h-6 group-hover:translate-x-4 transition-transform" />
                  </span>
                )}
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Button>
            </motion.div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mt-12">
              Secure Entry Protocol • Part 01
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;