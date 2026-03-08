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

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    venue: '',
    message: '',
    plan: 'Basic',
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto py-12 px-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <h1 className="text-3xl font-bold mb-8 text-[#1a1a2e]">Create Your Event</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="eventName">Event Name (e.g. Ada Weds Emeka)</Label>
              <Input 
                id="eventName" 
                required 
                placeholder="Ada Weds Emeka"
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
                <Label htmlFor="plan">Select Plan</Label>
                <Select onValueChange={(v) => setFormData({ ...formData, plan: v })} defaultValue="Basic">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic (₦10,000)</SelectItem>
                    <SelectItem value="Standard">Standard (₦15,000)</SelectItem>
                    <SelectItem value="Pro">Pro (₦20,000)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue">Venue Address</Label>
              <Input 
                id="venue" 
                required 
                placeholder="Eko Hotel & Suites, VI, Lagos"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">Cover Photo</Label>
              <Input id="photo" type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message to Guests</Label>
              <Textarea 
                id="message" 
                placeholder="We can't wait to celebrate with you!"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#e94560] hover:bg-[#d43d56] text-white py-6 rounded-xl text-lg"
            >
              {loading ? 'Creating...' : 'Proceed to Payment'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;