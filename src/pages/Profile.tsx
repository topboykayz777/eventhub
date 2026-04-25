"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';
import { User, Phone, Mail, Shield, Camera, ArrowLeft, Landmark, CreditCard, Wallet } from 'lucide-react';
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
    profile_image_url: '',
    bank_name: '',
    account_number: '',
    account_name: ''
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

    if (data) {
      setProfile({
        full_name: data.full_name || '',
        email: data.email || '',
        phone: data.phone || '',
        profile_image_url: data.profile_image_url || '',
        bank_name: data.bank_name || '',
        account_number: data.account_number || '',
        account_name: data.account_name || ''
      });
    }
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
        phone: profile.phone,
        bank_name: profile.bank_name,
        account_number: profile.account_number,
        account_name: profile.account_name
      })
      .eq('id', user.id);

    if (error) showError(error.message);
    else showSuccess('Your profile and settlement details have been updated.');
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
      
      <div className="max-w-5xl mx-auto py-12 md:py-24 px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-16">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-[#D4AF37] p-0">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
          <div className="text-left md:text-right">
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.4em] uppercase block mb-2">Account Settings</span>
            <h1 className="text-4xl md:text-5xl font-serif italic">The Profile</h1>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-12">
          <div className="grid md:grid-cols-12 gap-12">
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
                </div>
                <h3 className="text-xl font-serif italic mb-2">{profile.full_name || 'Elite Host'}</h3>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Verified Member</p>
              </GlassCard>
            </div>

            <div className="md:col-span-8 space-y-12">
              <GlassCard className="p-12 border-white/5">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-10">Personal Identity</h2>
                <div className="space-y-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Full Name</Label>
                    <Input 
                      required 
                      className="h-16 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50"
                      value={profile.full_name}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">WhatsApp Number</Label>
                      <Input 
                        className="h-16 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Email</Label>
                      <Input disabled className="h-16 bg-white/5 border-white/10 rounded-none opacity-50" value={profile.email} />
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-12 border-white/5">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                    <Wallet className="text-[#D4AF37] w-5 h-5" />
                  </div>
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Settlement Details (Digital Spraying)</h2>
                </div>
                <p className="text-[11px] text-gray-500 mb-10 leading-relaxed">
                  Provide your bank details to receive cash gifts from your guests. These details are kept private and used only for automated settlements via Paystack.
                </p>
                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Bank Name</Label>
                      <Input 
                        placeholder="e.g. GTBank"
                        className="h-16 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50"
                        value={profile.bank_name}
                        onChange={(e) => setProfile({ ...profile, bank_name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Account Number</Label>
                      <Input 
                        placeholder="10 Digits"
                        className="h-16 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50"
                        value={profile.account_number}
                        onChange={(e) => setProfile({ ...profile, account_number: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Account Name</Label>
                    <Input 
                      placeholder="As it appears on your bank statement"
                      className="h-16 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50"
                      value={profile.account_name}
                      onChange={(e) => setProfile({ ...profile, account_name: e.target.value })}
                    />
                  </div>
                </div>
              </GlassCard>

              <Button 
                type="submit" 
                disabled={saving}
                className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500"
              >
                {saving ? 'Updating...' : 'Save All Changes'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;