"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { showSuccess, showError } from '@/utils/toast';
import { Sparkles, Calendar, Type, Image as ImageIcon, Upload, X, Crown, Gem, Sun, Moon, Flower2, Waves, Heart, Landmark, Star, PenTool, Navigation, Camera, ZapIcon, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import InfoButton from '@/components/dashboard/InfoButton';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '', eventDate: '', venue: '', venue_map_url: '',
    message: '', plan: 'beta', theme: 'modern', photo_url: ''
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
      showSuccess('Portrait Uploaded.');
    } catch (error: any) { showError(error.message); } finally { setUploading(false); }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/login'); return; }
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
      showSuccess('Masterpiece Created.');
      navigate(`/payment/${event.id}`);
    } catch (error: any) { showError(error.message); } finally { setLoading(false); }
  };

  const themes = [
    { id: 'modern', label: 'Midnight Noir', color: 'bg-black', icon: Sparkles },
    { id: 'traditional', label: 'Royal Heritage', color: 'bg-[#064e3b]', icon: Crown },
    { id: 'elegant', label: 'Pure Ivory', color: 'bg-white', icon: Gem },
    { id: 'sahara', label: 'Sahara Gold', color: 'bg-[#78350f]', icon: Sun }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto py-24 px-6">
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

        <div className="glass-premium p-10 md:p-16 rounded-[3rem] border-white/10 shadow-2xl">
          {step === 1 && (
            <div className="space-y-8 animate-silk-reveal">
              <div className="space-y-4">
                <div className="flex justify-between items-center"><Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Event Title</Label><InfoButton text="What are we celebrating? (e.g. The Balogun Wedding)" /></div>
                <input required placeholder="Enter Title..." className="w-full bg-white/5 border-b border-white/10 h-16 px-0 text-2xl font-light outline-none focus:border-[#D4AF37] transition-all" value={formData.eventName} onChange={(e) => setFormData({ ...formData, eventName: e.target.value })} />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center"><Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Cover Portrait</Label><InfoButton text="Upload the best photo of the host; this is the first thing guests will see." /></div>
                {formData.photo_url ? (
                  <div className="relative h-64 rounded-3xl overflow-hidden border border-white/10"><img src={formData.photo_url} className="w-full h-full object-cover" alt="" /><button onClick={() => setFormData({ ...formData, photo_url: '' })} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white"><X size={20} /></button></div>
                ) : (
                  <label htmlFor="p" className="cursor-pointer h-64 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-4 hover:bg-white/5 transition-all">
                    {uploading ? <Loader2 className="animate-spin text-[#D4AF37]" /> : <><Upload className="text-gray-600" /><span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Select Portrait</span></>}
                    <input id="p" type="file" className="hidden" onChange={handleFileChange} />
                  </label>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-12 animate-silk-reveal">
              <div className="space-y-4">
                <div className="flex justify-between items-center"><Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Date & Time</Label><InfoButton text="When does the magic happen?" /></div>
                <input type="datetime-local" className="w-full bg-white/5 border-b border-white/10 h-16 px-0 text-2xl font-light outline-none" value={formData.eventDate} onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })} />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center"><Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Venue Address</Label><InfoButton text="Where should the guests go?" /></div>
                <input placeholder="Eko Hotel, Victoria Island..." className="w-full bg-white/5 border-b border-white/10 h-16 px-0 text-2xl font-light outline-none" value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center"><Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Map Link</Label><InfoButton text="Paste the Google Maps link so guests can get directions with one tap." /></div>
                <input placeholder="Paste Google Maps URL..." className="w-full bg-white/5 border-b border-white/10 h-16 px-0 text-sm font-light outline-none" value={formData.venue_map_url} onChange={(e) => setFormData({ ...formData, venue_map_url: e.target.value })} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10 animate-silk-reveal">
              <div className="flex justify-between items-center"><Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Select Theme</Label><InfoButton text="Pick a style that matches your party's colors." /></div>
              <div className="grid grid-cols-2 gap-4">
                {themes.map(t => (
                  <button key={t.id} onClick={() => setFormData({ ...formData, theme: t.id })} className={`h-32 rounded-3xl border transition-all text-left p-6 relative overflow-hidden ${formData.theme === t.id ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-white/5'}`}>
                    <div className="relative z-10 flex flex-col justify-between h-full"><t.icon size={18} className={formData.theme === t.id ? 'text-[#D4AF37]' : 'text-gray-600'} /><span className="text-[10px] font-bold uppercase tracking-widest">{t.label}</span></div>
                    <div className={`absolute top-0 right-0 w-12 h-12 ${t.color} opacity-20 rotate-45 -mr-6 -mt-6`} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 animate-silk-reveal text-center">
              <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-8"><Sparkles className="text-[#D4AF37] w-10 h-10" /></div>
              <p className="text-xl font-light text-gray-400 leading-relaxed">Your event is ready for activation. All premium tools are currently <span className="text-[#D4AF37] font-bold">UNLOCKED</span> for beta testers.</p>
            </div>
          )}

          <div className="mt-16 flex gap-4">
            {step > 1 && <Button variant="ghost" onClick={() => setStep(step - 1)} className="flex-1 py-8 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white"><ArrowLeft size={16} className="mr-2" /> Back</Button>}
            {step < 4 ? (
              <Button onClick={() => setStep(step + 1)} disabled={step === 1 && (!formData.eventName || !formData.photo_url)} className="flex-[2] bg-[#D4AF37] hover:bg-[#B8860B] text-black py-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">Next Step <ArrowRight size={16} className="ml-2" /></Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading} className="flex-[2] bg-[#D4AF37] hover:bg-[#B8860B] text-black py-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">{loading ? 'Creating...' : 'Finalize & Activate'}</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;