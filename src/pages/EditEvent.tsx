"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import GlassCard from '@/components/ui/GlassCard';
import { showSuccess, showError } from '@/utils/toast';
import { ArrowLeft, Upload, X, Palette, Sparkles, Calendar, MapPin, Type, Image as ImageIcon, Save, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
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
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      showError('Event not found');
      navigate('/dashboard');
      return;
    }

    setFormData({
      eventName: data.event_name,
      eventDate: new Date(data.event_date).toISOString().slice(0, 16),
      venue: data.venue,
      message: data.message || '',
      theme: data.theme || 'modern',
      photo_url: data.photo_url || '',
      gallery_urls: data.gallery_urls || []
    });
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    setUploading(true);
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('event-photos')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage.from('event-photos').getPublicUrl(fileName);
      
      if (isGallery) {
        setFormData(prev => ({ ...prev, gallery_urls: [...prev.gallery_urls, publicUrl] }));
      } else {
        setFormData(prev => ({ ...prev, photo_url: publicUrl }));
      }
      showSuccess('Portrait uploaded to the vault.');
    } catch (error: any) {
      showError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryPhoto = (url: string) => {
    setFormData(prev => ({
      ...prev,
      gallery_urls: prev.gallery_urls.filter(u => u !== url)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('events')
        .update({
          event_name: formData.eventName,
          event_date: new Date(formData.eventDate).toISOString(),
          venue: formData.venue,
          message: formData.message,
          theme: formData.theme,
          photo_url: formData.photo_url,
          gallery_urls: formData.gallery_urls
        })
        .eq('id', id);

      if (error) throw error;
      showSuccess('Masterpiece refined successfully.');
      navigate('/dashboard');
    } catch (error: any) {
      showError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const themes = [
    { id: 'modern', label: 'Modern Noir', color: 'bg-[#0a0a1a]', text: 'text-white', accent: 'bg-[#e94560]' },
    { id: 'traditional', label: 'Royal Heritage', color: 'bg-[#fdfcf0]', text: 'text-[#5d4037]', accent: 'bg-[#b8860b]' },
    { id: 'elegant', label: 'Pure Ivory', color: 'bg-white', text: 'text-gray-900', accent: 'bg-black' }
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f] text-white">
      <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#D4AF37]/5 blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto py-24 px-6 relative z-10">
        <div className="flex justify-between items-center mb-16">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')} 
            className="text-gray-400 hover:text-[#D4AF37] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
          <div className="text-right">
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.4em] uppercase block mb-2">The Edit Suite</span>
            <h1 className="text-4xl font-serif italic">Refine Your Masterpiece</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          <GlassCard className="p-12 border-white/5">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                <Type className="text-[#D4AF37] w-5 h<dyad-write path="src/pages/EditEvent.tsx" description="Completing the luxury redesign of the Edit Event page with full functionality.">
"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import GlassCard from '@/components/ui/GlassCard';
import { showSuccess, showError } from '@/utils/toast';
import { ArrowLeft, Upload, X, Palette, Sparkles, Calendar, MapPin, Type, Image as ImageIcon, Save, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
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
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      showError('Event not found');
      navigate('/dashboard');
      return;
    }

    setFormData({
      eventName: data.event_name,
      eventDate: new Date(data.event_date).toISOString().slice(0, 16),
      venue: data.venue,
      message: data.message || '',
      theme: data.theme || 'modern',
      photo_url: data.photo_url || '',
      gallery_urls: data.gallery_urls || []
    });
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    setUploading(true);
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('event-photos')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage.from('event-photos').getPublicUrl(fileName);
      
      if (isGallery) {
        setFormData(prev => ({ ...prev, gallery_urls: [...prev.gallery_urls, publicUrl] }));
      } else {
        setFormData(prev => ({ ...prev, photo_url: publicUrl }));
      }
      showSuccess('Portrait uploaded to the vault.');
    } catch (error: any) {
      showError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryPhoto = (url: string) => {
    setFormData(prev => ({
      ...prev,
      gallery_urls: prev.gallery_urls.filter(u => u !== url)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('events')
        .update({
          event_name: formData.eventName,
          event_date: new Date(formData.eventDate).toISOString(),
          venue: formData.venue,
          message: formData.message,
          theme: formData.theme,
          photo_url: formData.photo_url,
          gallery_urls: formData.gallery_urls
        })
        .eq('id', id);

      if (error) throw error;
      showSuccess('Masterpiece refined successfully.');
      navigate('/dashboard');
    } catch (error: any) {
      showError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const themes = [
    { id: 'modern', label: 'Modern Noir', color: 'bg-[#0a0a1a]', text: 'text-white', accent: 'bg-[#e94560]' },
    { id: 'traditional', label: 'Royal Heritage', color: 'bg-[#fdfcf0]', text: 'text-[#5d4037]', accent: 'bg-[#b8860b]' },
    { id: 'elegant', label: 'Pure Ivory', color: 'bg-white', text: 'text-gray-900', accent: 'bg-black' }
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f] text-white">
      <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#D4AF37]/5 blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto py-24 px-6 relative z-10">
        <div className="flex justify-between items-center mb-16">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')} 
            className="text-gray-400 hover:text-[#D4AF37] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
          <div className="text-right">
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.4em] uppercase block mb-2">The Edit Suite</span>
            <h1 className="text-4xl font-serif italic">Refine Your Masterpiece</h1>
          </div>
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
                  className="h-16 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light"
                  value={formData.eventName}
                  onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Venue Address</Label>
                <Input 
                  required 
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
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Aesthetic Theme</Label>
                <div className="grid grid-cols-3 gap-4">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, theme: t.id })}
                      className={`relative p-4 border transition-all text-left overflow-hidden h-24 ${
                        formData.theme === t.id 
                          ? 'border-[#D4AF37] bg-[#D4AF37]/5' 
                          : 'border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="relative z-10 flex flex-col justify-between h-full">
                        <span className="text-[8px] font-bold uppercase tracking-widest">{t.label}</span>
                        <div className={`w-4 h-4 rounded-full ${t.accent}`} />
                      </div>
                      {formData.theme === t.id && (
                        <div className="absolute top-2 right-2">
                          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
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
              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Cover Portrait</Label>
                <div className="flex items-center gap-8">
                  {formData.photo_url && (
                    <div className="w-32 h-32 border border-white/10 overflow-hidden">
                      <img src={formData.photo_url} className="w-full h-full object-cover" alt="Cover" />
                    </div>
                  )}
                  <Label htmlFor="cover-upload" className="cursor-pointer h-32 flex-1 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 hover:border-[#D4AF37]/30 transition-colors bg-white/5">
                    {uploading ? <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" /> : <Upload className="w-5 h-5 text-gray-600" />}
                    <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-500">Change Cover Portrait</span>
                    <input id="cover-upload" type="file" className="hidden" onChange={(e) => handleFileUpload(e)} />
                  </Label>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Photo Gallery (Premium)</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {formData.gallery_urls.map((url, i) => (
                    <div key={i} className="relative aspect-square border border-white/10 group">
                      <img src={url} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                      <button 
                        type="button"
                        onClick={() => removeGalleryPhoto(url)}
                        className="absolute top-2 right-2 bg-black/50 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <Label htmlFor="gallery-upload" className="cursor-pointer aspect-square border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 hover:border-[#D4AF37]/30 transition-colors bg-white/5">
                    <Upload className="w-4 h-4 text-gray-600" />
                    <span className="text-[7px] font-bold uppercase tracking-[0.1em] text-gray-500">Add Photo</span>
                    <input id="gallery-upload" type="file" className="hidden" onChange={(e) => handleFileUpload(e, true)} />
                  </Label>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-12 border-white/5">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                <Sparkles className="text-[#D4AF37] w-5 h-5" />
              </div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Host's Message</h2>
            </div>
            <Textarea 
              className="min-h-[200px] bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light italic p-8"
              placeholder="Write a personal message to your guests..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </GlassCard>

          <div className="pt-12">
            <Button 
              type="submit" 
              disabled={saving || uploading}
              className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500"
            >
              {saving ? 'Refining Masterpiece...' : 'Save Changes'} <Save className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;