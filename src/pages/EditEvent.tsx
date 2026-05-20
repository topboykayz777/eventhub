"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess, showError } from '@/utils/toast';
import { 
  ArrowLeft, Upload, X, Palette, Sparkles, Calendar, MapPin, 
  Type, Image as ImageIcon, Save, Loader2, Crown, Gem, Star, 
  Heart, Flower2, Waves, Sun, Moon, Landmark, PenTool, Clock, 
  PlayCircle, ZapIcon, Cherry, Trees as PalmTree, Tent, Ghost, 
  Palette as ColorPalette, Camera, Info, ArrowRight, Navigation
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
        <button type="button" className="inline-flex items-center justify-center ml-2 text-gray-500 hover:text-[#D4AF37] transition-all hover:scale-110">
          <Info size={14} className="opacity-60" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="bg-[#1a1a1a] border-[#D4AF37]/20 text-white text-[11px] font-medium leading-relaxed p-4 max-w-[240px] shadow-2xl rounded-2xl">
        {text}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

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
    const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
    if (error) { showError('Event not found'); navigate('/dashboard'); return; }
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
    if (file.size > 50 * 1024 * 1024) { showError("File is too large. Max 50MB."); return; }

    if (isGallery) {
      const limit = (eventPlan === 'Pro' || eventPlan === 'beta') ? 50 : eventPlan === 'Standard' ? 10 : 0;
      if ((formData.gallery_urls?.length || 0) >= limit) {
        showError(`Your ${eventPlan} plan is limited to ${limit} items. Upgrade for more.`);
        return;
      }
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    setUploading(true);
    
    try {
      const { error: uploadError } = await supabase.storage.from('event-photos').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('event-photos').getPublicUrl(fileName);
      if (isGallery) setFormData(prev => ({ ...prev, gallery_urls: [...(prev.gallery_urls || []), publicUrl] }));
      else setFormData(prev => ({ ...prev, photo_url: publicUrl }));
      showSuccess('Media uploaded successfully.');
    } catch (error: any) {
      showError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryPhoto = (url: string) => {
    setFormData(prev => ({ ...prev, gallery_urls: (prev.gallery_urls || []).filter(u => u !== url) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.from('events').update({
        event_name: formData.eventName, venue: formData.venue, message: formData.message,
        theme: formData.theme, photo_url: formData.photo_url, gallery_urls: formData.gallery_urls || []
      }).eq('id', id);
      if (error) throw error;
      showSuccess('Refined successfully.');
      navigate('/dashboard');
    } catch (error: any) {
      showError(error.message);
    } finally {
      setSaving(false);
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
    { id: 'tropic', label: 'Tropical Jungle', color: 'from-green-600 to-teal-900', icon: PalmTree },
    { id: 'desert', label: 'Oasis Blue', color: 'from-sky-400 to-indigo-800', icon: Tent },
    { id: 'glitch', label: 'Glitch Noir', color: 'from-red-600 to-black', icon: Ghost },
    { id: 'minimal', label: 'Bauhaus Minimal', color: 'from-blue-600 to-slate-900', icon: Palette },
    { id: 'noir', label: 'Noir Cinema', color: 'from-gray-100 to-gray-400', icon: Camera, light: true }
  ];

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#050505]"><div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-black">
      <Navbar />
      <div className="max-w-4xl mx-auto py-24 md:py-32 px-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-24"
        >
          <div>
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-[#D4AF37] p-0 mb-6 group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </Button>
            <span className="text-[#D4AF37] text-[10px] font-black tracking-[0.5em] uppercase mb-4 block">The Edit Suite</span>
            <h1 className="text-4xl md:text-6xl font-serif italic leading-tight">Refine Your <span className="text-[#D4AF37]">Masterpiece</span></h1>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-12 md:space-y-20">
          {/* Card 01: Identity */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white/[0.02] backdrop-blur-2xl border border-white/5 p-8 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden group"
          >
            <div className="flex items-center gap-4 border-b border-white/5 pb-8 mb-12">
              <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                <span className="text-[#D4AF37] font-black text-xs">01</span>
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Event Identity</span>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 flex items-center">
                  Event Title <InfoButton text="Update the name of your event. This changes the headline on your public page immediately." />
                </Label>
                <input required className="h-16 w-full px-0 bg-transparent border-b border-white/10 rounded-none focus:border-[#D4AF37] text-2xl md:text-3xl font-serif italic outline-none transition-all" value={formData.eventName} onChange={(e) => setFormData({ ...formData, eventName: e.target.value })} />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 flex items-center">
                  Venue Address <InfoButton text="Specify where the celebration is held. This will be updated on all guest invitations." />
                </Label>
                <input required className="h-16 w-full px-6 bg-white/5 border border-white/10 rounded-2xl focus:border-[#D4AF37] text-lg font-light outline-none" value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} />
              </div>
            </div>
          </motion.div>

          {/* Card 02: Visual Assets */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-2xl border border-white/5 p-8 md:p-16 rounded-[3rem] shadow-2xl relative"
          >
            <div className="flex items-center gap-4 border-b border-white/5 pb-8 mb-12">
              <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                <span className="text-[#D4AF37] font-black text-xs">02</span>
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Visual Assets</span>
            </div>
            <div className="space-y-12">
              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 flex items-center">
                  Cover Portrait <InfoButton text="Your primary backdrop. Use a high-quality image or video to set the mood for your guests." />
                </Label>
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  {formData.photo_url && (
                    <div className="w-full sm:w-48 h-48 border border-white/10 overflow-hidden rounded-[2rem] shadow-xl">
                      {isVideo(formData.photo_url) ? <video src={formData.photo_url} className="w-full h-full object-cover" muted /> : <img src={formData.photo_url} className="w-full h-full object-cover" alt="Cover" />}
                    </div>
                  )}
                  <Label htmlFor="cover-upload" className="cursor-pointer h-48 w-full flex-1 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 hover:border-[#D4AF37]/50 transition-all bg-white/5 rounded-[2rem] group">
                    {uploading ? <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" /> : <Upload className="w-8 h-8 text-gray-700 group-hover:text-[#D4AF37] transition-colors" />}
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Swap Cover Portrait</span>
                    <input id="cover-upload" type="file" className="hidden" onChange={(e) => handleFileUpload(e)} />
                  </Label>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 flex items-center">
                    Media Vault <InfoButton text="Add more photos or videos to your event's digital gallery. Your plan allows for up to 50 items." />
                  </Label>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37]">{(formData.gallery_urls?.length || 0)} / {(eventPlan === 'Pro' || eventPlan === 'beta') ? '50' : eventPlan === 'Standard' ? '10' : '0'}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {(formData.gallery_urls || []).map((url, i) => (
                    <div key={i} className="relative aspect-square border border-white/10 group overflow-hidden rounded-2xl">
                      {isVideo(url) ? <video src={url} className="w-full h-full object-cover" muted /> : <img src={url} className="w-full h-full object-cover" alt="" />}
                      <button type="button" onClick={() => removeGalleryPhoto(url)} className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"><X size={18} /></button>
                    </div>
                  ))}
                  {(eventPlan === 'Standard' || eventPlan === 'Pro' || eventPlan === 'beta') && (
                    <Label htmlFor="gallery-upload" className="cursor-pointer aspect-square border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 hover:border-[#D4AF37]/50 transition-all bg-white/5 rounded-2xl group">
                      <Upload className="w-5 h-5 text-gray-700 group-hover:text-[#D4AF37]" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-gray-600">Add</span>
                      <input id="gallery-upload" type="file" className="hidden" onChange={(e) => handleFileUpload(e, true)} />
                    </Label>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 03: Guest Directive */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[#0A0A0A] border border-white/10 p-8 md:p-16 rounded-[3.5rem] shadow-2xl relative"
          >
            <div className="flex items-center gap-4 border-b border-white/5 pb-8 mb-12">
              <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                <span className="text-[#D4AF37] font-black text-xs">03</span>
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Guest Directive</span>
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 flex items-center">
                Refine Welcome Message <InfoButton text="Update your instructions, dress code, or warm welcome message for your guests." />
              </Label>
              <Textarea 
                className="min-h-[220px] bg-white/5 border-white/10 rounded-[2.5rem] focus:border-[#D4AF37] text-lg font-light resize-none px-8 py-8 leading-relaxed outline-none" 
                value={formData.message} 
                onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
              />
            </div>
          </motion.div>

          {/* Card 04: Aesthetic Theme */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5 p-8 md:p-16 rounded-[3.5rem] shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-8 mb-12">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                  <span className="text-[#D4AF37] font-black text-xs">04</span>
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Aesthetic DNA</span>
              </div>
              <div className="flex items-center text-[9px] font-black text-gray-600 uppercase tracking-widest">
                Swipe to change <InfoButton text="Update the visual style. Each theme transforms the colors and typography of your event page." />
              </div>
            </div>
            <ScrollArea className="w-full whitespace-nowrap -mx-6 px-6 pb-12">
              <div className="flex gap-8">
                {themes.map((t) => (
                  <button 
                    key={t.id} 
                    type="button" 
                    onClick={() => setFormData({ ...formData, theme: t.id })} 
                    className={`relative w-64 h-48 shrink-0 border-2 transition-all text-left overflow-hidden group rounded-[2.5rem] ${
                      formData.theme === t.id ? 'border-[#D4AF37] scale-[1.05] shadow-[0_0_50px_rgba(212,175,55,0.3)]' : 'border-white/5 opacity-60 hover:opacity-100 hover:border-white/20'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${t.color}`} />
                    <div className="relative z-10 p-8 flex flex-col justify-between h-full">
                      <t.icon className={`w-10 h-10 transition-transform duration-500 group-hover:scale-125 ${t.light ? 'text-black' : 'text-white'}`} />
                      <div>
                        <span className={`text-[11px] font-black uppercase tracking-[0.2em] block mb-1 ${t.light ? 'text-black' : 'text-white'}`}>{t.label}</span>
                        {formData.theme === t.id && (
                          <motion.span layoutId="activeThemeEdit" className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37] bg-black/60 px-3 py-1.5 rounded-full">Active</motion.span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="bg-white/5 h-2 rounded-full" />
            </ScrollArea>
          </motion.div>

          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button 
              type="submit" 
              disabled={saving || uploading} 
              className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black h-24 rounded-[3rem] text-[14px] font-black tracking-[0.5em] uppercase transition-all duration-500 shadow-2xl group relative overflow-hidden"
            >
              {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <span className="flex items-center justify-center gap-4 relative z-10">
                  Save Changes <Save className="w-6 h-6 group-hover:scale-125 transition-transform" />
                </span>
              )}
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;