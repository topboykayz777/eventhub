"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';
import { User, Phone, Mail, Shield, Camera, ArrowLeft, Upload, X } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    profile_image_url: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    let { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      showError(error.message);
      setLoading(false);
      return;
    }

    if (!data) {
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({ 
          id: user.id, 
          email: user.email,
          full_name: user.user_metadata?.full_name || ''
        })
        .select()
        .single();
      
      if (!insertError) data = newProfile;
    }

    if (data) {
      setProfile({
        full_name: data.full_name || '',
        email: data.email || '',
        phone: data.phone || '',
        profile_image_url: data.profile_image_url || ''
      });
    }
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('event-photos')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage.from('event-photos').getPublicUrl(fileName);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_image_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile(prev => ({ ...prev, profile_image_url: publicUrl }));
      showSuccess('Portrait updated.');
    } catch (error: any) {
      showError('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        phone: profile.phone
      })
      .eq('id', user.id);

    if (error) showError(error.message);
    else showSuccess('Your profile has been updated.');
    setSaving(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f] text-white">
      <div className="w-12 h-12 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#D4AF37]/5 blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto py-12 md:py-24 px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-16 md:mb-24">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')} 
            className="text-gray-400 hover:text-[#D4AF37] transition-colors p-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
          <div className="text-left md:text-right">
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.4em] uppercase block mb-2">Account Settings</span>
            <h1 className="text-4xl md:text-5xl font-serif italic">The Profile</h1>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-12 md:gap-16">
          <div className="md:col-span-4">
            <GlassCard className="p-10 text-center border-white/5">
              <div className="relative w-32 h-32 mx-auto mb-8">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#D4AF37]/30 bg-white/5">
                  {profile.profile_image_url ? (
                    <img src={profile.profile_image_url} className="w-full h-full object-cover" alt="Avatar" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                </div>
                <Label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-[#D4AF37] p-3 rounded-full text-black hover:scale-110 transition-transform cursor-pointer shadow-xl">
                  {uploading ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera size={16} />
                  )}
                  <input 
                    id="avatar-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </Label>
              </div>
              <h3 className="text-xl font-serif italic mb-2">{profile.full_name || 'Elite Host'}</h3>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-8">Member since 2026</p>
              
              <div className="pt-8 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-3 text-left">
                  <Shield className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-400">Verified Account</span>
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="md:col-span-8">
            <GlassCard className="p-12 border-white/5">
              <form onSubmit={handleSave} className="space-y-12">
                <div className="space-y-6">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">Identity</Label>
                  <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4AF37] w-4 h-4" />
                    <Input 
                      required 
                      className="h-20 pl-16 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light"
                      value={profile.full_name}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      placeholder="Full Name"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">Contact Details</Label>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                      <Input 
                        disabled 
                        className="h-20 pl-16 bg-white/5 border-white/10 rounded-none opacity-50 cursor-not-allowed"
                        value={profile.email}
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4AF37] w-4 h-4" />
                      <Input 
                        className="h-20 pl-16 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        placeholder="WhatsApp Number"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-12">
                  <Button 
                    type="submit" 
                    disabled={saving}
                    className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500"
                  >
                    {saving ? 'Updating...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;