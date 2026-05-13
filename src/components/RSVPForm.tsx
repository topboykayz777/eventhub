"use client";

import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { showSuccess, showError } from '@/utils/toast';
import { User, Phone, Music, Users, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface RSVPFormProps {
  eventId: string;
  onSuccess: (rsvp: any) => void;
  themeConfig: any;
}

const RSVPForm = ({ eventId, onSuccess, themeConfig }: RSVPFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_phone: '',
    has_plus_one: false,
    song_request: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('rsvps')
        .insert({
          event_id: eventId,
          guest_name: formData.guest_name,
          guest_phone: formData.guest_phone,
          has_plus_one: formData.has_plus_one,
          song_request: formData.song_request
        })
        .select()
        .single();

      if (error) throw error;
      
      showSuccess("RSVP Confirmed! Welcome to the guest list.");
      onSuccess(data);
    } catch (err: any) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const accentClass = themeConfig.accent;
  const isDark = themeConfig.dark;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>Full Name</Label>
          <div className="relative">
            <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${accentClass}`} />
            <Input 
              required 
              placeholder="e.g. David Adeleke"
              className={`h-16 pl-14 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light ${isDark ? 'text-black' : 'text-white'}`}
              value={formData.guest_name}
              onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>WhatsApp Number</Label>
          <div className="relative">
            <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${accentClass}`} />
            <Input 
              required 
              type="tel"
              placeholder="08012345678"
              className={`h-16 pl-14 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light ${isDark ? 'text-black' : 'text-white'}`}
              value={formData.guest_phone}
              onChange={(e) => setFormData({ ...formData, guest_phone: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>Song Request (Optional)</Label>
          <div className="relative">
            <Music className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${accentClass}`} />
            <Input 
              placeholder="What should the DJ play?"
              className={`h-16 pl-14 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light ${isDark ? 'text-black' : 'text-white'}`}
              value={formData.song_request}
              onChange={(e) => setFormData({ ...formData, song_request: e.target.value })}
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 p-6 bg-white/5 border border-white/10">
          <Checkbox 
            id="plus-one" 
            checked={formData.has_plus_one}
            onCheckedChange={(checked) => setFormData({ ...formData, has_plus_one: !!checked })}
          />
          <label htmlFor="plus-one" className={`text-[10px] font-bold uppercase tracking-widest cursor-pointer ${isDark ? 'text-gray-800' : 'text-white'}`}>
            I am bringing a plus-one
          </label>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={loading}
        className={`w-full py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500 ${
          isDark ? 'bg-black text-white hover:bg-black/80' : 'bg-[#D4AF37] text-black hover:bg-[#B8860B]'
        }`}
      >
        {loading ? <Loader2 className="animate-spin" /> : 'Confirm Attendance'}
      </Button>
    </form>
  );
};

export default RSVPForm;