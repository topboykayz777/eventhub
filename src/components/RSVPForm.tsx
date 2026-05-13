"use client";

import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { showSuccess, showError } from '@/utils/toast';
import { Loader2, Music, UserPlus } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RSVPFormProps {
  eventId: string;
  onSuccess: (data: any) => void;
  themeConfig: any;
}

const RSVPForm = ({ eventId, onSuccess, themeConfig }: RSVPFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    songRequest: '',
    hasPlusOne: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('rsvps')
        .insert({
          event_id: eventId,
          guest_name: formData.name,
          guest_phone: formData.phone,
          song_request: formData.songRequest,
          has_plus_one: formData.hasPlusOne
        })
        .select()
        .single();

      if (error) throw error;

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#ffffff']
      });

      showSuccess("You are on the guest list!");
      onSuccess(data);
    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const isDark = themeConfig.dark;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-3">
        <Label className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Full Name</Label>
        <Input 
          required 
          placeholder="e.g. David Adeleke"
          className={`h-16 rounded-none border-none text-lg font-light ${isDark ? 'bg-black/5' : 'bg-white/5'}`}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="space-y-3">
        <Label className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>WhatsApp Number</Label>
        <Input 
          required 
          placeholder="080..."
          className={`h-16 rounded-none border-none text-lg font-light ${isDark ? 'bg-black/5' : 'bg-white/5'}`}
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div className="space-y-3">
        <Label className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Song Request (Optional)</Label>
        <div className="relative">
          <Music className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${themeConfig.accent}`} />
          <Input 
            placeholder="Your favorite vibe..."
            className={`h-16 pl-12 rounded-none border-none text-lg font-light ${isDark ? 'bg-black/5' : 'bg-white/5'}`}
            value={formData.songRequest}
            onChange={(e) => setFormData({ ...formData, songRequest: e.target.value })}
          />
        </div>
      </div>

      <div className={`flex items-center justify-between p-6 ${isDark ? 'bg-black/5' : 'bg-white/5'}`}>
        <div className="flex items-center gap-3">
          <UserPlus className={`w-4 h-4 ${themeConfig.accent}`} />
          <Label className="text-[10px] font-bold uppercase tracking-widest">Bringing a Plus One?</Label>
        </div>
        <Switch 
          checked={formData.hasPlusOne}
          onCheckedChange={(v) => setFormData({ ...formData, hasPlusOne: v })}
        />
      </div>

      <Button 
        type="submit" 
        disabled={loading}
        className={`w-full py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500 shadow-2xl ${
          isDark ? 'bg-black text-white hover:bg-black/80' : 'bg-[#D4AF37] text-black hover:bg-[#B8860B]'
        }`}
      >
        {loading ? <Loader2 className="animate-spin" /> : 'Confirm Attendance'}
      </Button>
    </form>
  );
};

export default RSVPForm;