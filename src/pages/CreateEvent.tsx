"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';
import { Sparkles, Upload, X, Crown, Gem, Sun, Loader2, ArrowLeft, ArrowRight, Moon, Flower2, Waves, Heart, Landmark, Star, PenTool, ZapIcon, Cherry, Trees as PalmTree, Tent, Ghost, Palette as ColorPalette, Camera } from 'lucide-react';
import InfoButton from '@/components/dashboard/InfoButton';

const DRAFT_KEY = 'eventhub_creation_draft';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    return saved ? JSON.parse(saved) : {
      eventName: '', eventDate: '', venue: '', venue_map_url: '',
      message: '', plan: 'beta', theme: 'modern', photo_url: ''
    };
  });

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
  }, [formData]);

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
      showSuccess('Portrait Uploaded.');
    } catch (error: any) { 
      showError("Please sign in to upload media."); 
    } finally { setUploading(false); }
  };

  const handleSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/signup'); return; }
    setLoading(true);
    try {
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
      const lastName = profile?.full_name?.split(' ').pop()?.toLowerCase() || 'event';
      const slug = `${formData.eventName.toLowerCase().replace(/\s+/g, '-')}-${lastName}-${Math.floor(Math.random() * 1000)}`;
      const { data: event, error } = await supabase.from('events').insert({
        host_id: user.id, event_name: formData.eventName,
        event_date: new Date(formData.eventDate).toISOString(),
        venue: formData.venue, venue_map_url: formData.venue_map_url,
        message: formData.message, plan: formData.plan,
        theme: formData.theme, slug, photo_url: formData.photo_url
      }).select().single();
      if (error) throw error;
      localStorage.removeItem(DRAFT_KEY);
      showSuccess('Masterpiece Created.');
      navigate(`/payment/${event.id}`);
    } catch (error: any) { showError(error.message); } finally { setLoading(false); }
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
    { id: 'tropic', label: 'Tropical Jungle', color: 'bg-[#0d9488]', icon: PalmTree },
    { id: 'desert', label: 'Oasis Blue', color: 'bg-[#d97706]', icon: Tent },
    { id: 'glitch', label: 'Glitch Noir', color: 'bg-[#ef4444]', icon: Ghost },
    { id: 'minimal', label: 'Bauhaus Minimal', color: 'bg-[#2563eb]', icon: ColorPalette },
    { id: 'noir', label: 'Noir Cinema', color: 'bg-white', icon: Camera }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto py-24 px-6">
        <div className="text-center mb-16">
          <div className="flex justify-center gap-4 mb-8">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step >= s ? 'bg-[#D4AF37]' : 'bg-white/10'}`} />
            ))}
          </div>
          <h1 className="text-4xl md:text-6xl font-serif italic mb-4">
            {step === 1 ? 'The Identity' : step === 2 ? 'The Logistics' : step === 3 ? 'The Aesthetic' : 'Finalize'}
          </h1>
        </div>

        <div className="glass-premium p-8 md:p-16 rounded-[4rem] border-white/10 shadow-2xl">
          {step === 1 && (
            <div className="space-y-12 animate-silk-reveal">
              <div className="space-y-4">
                <div className="flex justify-between items-center"><Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Event Title</Label><InfoButton text="What are we celebrating? (e.g. The Balogun Wedding)" /></div>
                <input required placeholder="Enter Title..." className="w-full bg-white/5 border-b border-white/10 h-16 px-0 text-3xl font-light outline-none focus:border-[#D4AF37] transition-all" value={formData.eventName} onChange={(e) => setFormData({ ...formData, eventName: e.target.value })} />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center"><Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Cover Portrait</Label><InfoButton text="Upload the best photo of the host; this is the first thing guests will see on their invitation." /></div>
                {formData.photo_url ? (
                  <div className="relative h-80 rounded-[3rem] overflow-hidden border border-white/10"><img src={formData.photo_url} className="w-full h-full object-cover" alt="" /><button onClick={() => setFormData({ ...formData, photo_url: '' })} className="absolute top-6 right-6 bg-black/50 p-3 rounded-full text-white backdrop-blur-md"><X size={20} /></button></div>
                ) : (
                  <label htmlFor="p" className="cursor-pointer h-80 border-2 border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center gap-4 hover:bg-white/5 transition-all">
                    {uploading ? <Loader2 className="animate-spin text-[#D4AF37]" size={32} /> : <><Upload className="text-gray-600" size={32} /><span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Select Portrait</span></>}
                    <input id="p" type="file" className="hidden" onChange={handleFileChange} />
                  </label>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-12 animate-silk-reveal">
              <div className="space-y-4">
                <div className="flex justify-between items-center"><Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Date & Time</Label><InfoButton text="When does the magic happen? This will be displayed on the Digital IV and Digital Pass." /></div>
                <input type="datetime-local" className="w-full bg-white/5 border-b border-white/10 h-16 px-0 text-3xl font-light outline-none" value={formData.eventDate} onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })} />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center"><Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Venue Address</Label><InfoButton text="The physical location of the event. Please be as precise as possible." /></div>
                <input placeholder="Eko Hotel, Victoria Island..." className="w-full bg-white/5 border-b border-white/10 h-16 px-0 text-3xl font-light outline-none" value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center"><Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Google Maps Link</Label><InfoButton text="Paste the Maps URL from Google. This allows guests to get driving directions with one tap." /></div>
                <input placeholder="https://maps.google.com/..." className="w-full bg-white/5 border-b border-white/10 h-16 px-0 text-sm font-light outline-none text-gray-400" value={formData.venue_map_url} onChange={(e) => setFormData({ ...formData, venue_map_url: e.target.value })} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10 animate-silk-reveal">
              <div className="flex justify-between items-center">
                <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Aesthetic Palette</Label>
                  <p className="text-[10px] text-[#D4AF37] font-bold mt-1">Swipe to explore 20 elite themes</p>
                </div>
                <InfoButton text="Select the visual tone of your event. This controls the colors and style of the guest invitation and Vibe Screen." />
              </div>
              
              <div ref={carouselRef} className="flex gap-4 overflow-x-auto pb-8 scrollbar-thin scrollbar-thumb-[#D4AF37]/20 snap-x">
                {themes.map(t => (
                  <button 
                    key={t.id} 
                    onClick={() => setFormData({ ...formData, theme: t.id })} 
                    className={`flex-shrink-0 w-48 h-48 rounded-[2.5rem] border transition-all text-left p-6 relative overflow-hidden snap-start ${formData.theme === t.id ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/5 bg-white/[0.02]'}`}
                  >
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <t.icon size={24} className={formData.theme === t.id ? 'text-[#D4AF37]' : 'text-gray-600'} />
                      <span className="text-[9px] font-black uppercase tracking-widest">{t.label}</span>
                    </div>
                    <div className={`absolute top-0 right-0 w-16 h-16 ${t.color} opacity-20 rotate-45 -mr-8 -mt-8`} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-12 animate-silk-reveal text-center py-10">
              <div className="w-24 h-24 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#D4AF37]/20">
                <Sparkles className="text-[#D4AF37] w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-serif italic">The Orchestration is Ready</h3>
                <p className="text-gray-400 font-light leading-relaxed max-w-sm mx-auto">Click below to finalize your account and activate your celebration dashboard.</p>
              </div>
            </div>
          )}

          <div className="mt-16 flex gap-4">
            {step > 1 && <Button variant="ghost" onClick={() => setStep(step - 1)} className="flex-1 py-9 rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all"><ArrowLeft size={16} className="mr-2" /> Back</Button>}
            {step < 4 ? (
              <Button onClick={() => setStep(step + 1)} disabled={step === 1 && (!formData.eventName || !formData.photo_url)} className="flex-[2] bg-[#D4AF37] hover:bg-[#B8860B] text-black py-9 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#D4AF37]/10">Next Stage <ArrowRight size={16} className="ml-2" /></Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading} className="flex-[2] bg-[#D4AF37] hover:bg-[#B8860B] text-black py-9 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#D4AF37]/10">{loading ? 'Creating...' : 'Finalize & Launch'}</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;