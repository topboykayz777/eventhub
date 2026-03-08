"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';
import { User, Phone, Mail } from 'lucide-react';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) showError(error.message);
    else setProfile({
      full_name: data.full_name || '',
      email: data.email || '',
      phone: data.phone || ''
    });
    setLoading(false);
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
    else showSuccess('Profile updated successfully!');
    setSaving(false);
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto py-12 px-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-[#e94560]/10 p-4 rounded-2xl">
              <User className="text-[#e94560] w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-[#1a1a2e]">Your Profile</h1>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address (Read-only)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input id="email" value={profile.email} disabled className="pl-10 bg-gray-50" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input 
                  id="name" 
                  required 
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">WhatsApp Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input 
                  id="phone" 
                  placeholder="08012345678"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={saving}
              className="w-full bg-[#1a1a2e] hover:bg-[#2a2a4e] text-white py-6 rounded-xl text-lg"
            >
              {saving ? 'Saving...' : 'Update Profile'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;