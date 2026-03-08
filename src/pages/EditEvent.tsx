"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';
import { ArrowLeft, Upload, X } from 'lucide-react';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    venue: '',
    message: '',
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
      showSuccess('Photo uploaded!');
    } catch (error: any) {
      showError(error.message);
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
          photo_url: formData.photo_url,
          gallery_urls: formData.gallery_urls
        })
        .eq('id', id);

      if (error) throw error;
      showSuccess('Event updated successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      showError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto py-12 px-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <h1 className="text-3xl font-bold mb-8 text-[#1a1a2e]">Edit Event</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="eventName">Event Name</Label>
              <Input 
                id="eventName" 
                required 
                value={formData.eventName}
                onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="eventDate">Date & Time</Label>
                <Input 
                  id="eventDate" 
                  type="datetime-local" 
                  required 
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="venue">Venue</Label>
                <Input 
                  id="venue" 
                  required 
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cover Photo</Label>
              <div className="flex items-center gap-4">
                {formData.photo_url && (
                  <img src={formData.photo_url} className="w-20 h-20 object-cover rounded-xl" alt="Cover" />
                )}
                <Label htmlFor="cover-upload" className="cursor-pointer bg-gray-100 hover:bg-gray-200 p-4 rounded-xl flex items-center gap-2 border-2 border-dashed border-gray-300">
                  <Upload className="w-5 h-5" /> Change Cover
                  <input id="cover-upload" type="file" className="hidden" onChange={(e) => handleFileUpload(e)} />
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Photo Gallery (Standard/Pro Plans)</Label>
              <div className="grid grid-cols-4 gap-4 mb-4">
                {formData.gallery_urls.map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} className="w-full aspect-square object-cover rounded-xl" alt={`Gallery ${i}`} />
                    <button 
                      type="button"
                      onClick={() => removeGalleryPhoto(url)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <Label htmlFor="gallery-upload" className="cursor-pointer bg-gray-50 hover:bg-gray-100 aspect-square rounded-xl flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-xs text-gray-400">Add Photo</span>
                  <input id="gallery-upload" type="file" className="hidden" onChange={(e) => handleFileUpload(e, true)} />
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message to Guests</Label>
              <Textarea 
                id="message" 
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
              />
            </div>

            <Button 
              type="submit" 
              disabled={saving}
              className="w-full bg-[#e94560] hover:bg-[#d43d56] text-white py-6 rounded-xl text-lg"
            >
              {saving ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;