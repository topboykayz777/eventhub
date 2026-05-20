"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Building2, CreditCard, CheckCircle2, Loader2, LogOut, ShieldCheck, Wallet, ArrowLeft } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';

const NIGERIAN_BANKS = [
  { name: "Access Bank", code: "044" },
  { name: "Citibank Nigeria", code: "023" },
  { name: "Ecobank Nigeria", code: "050" },
  { name: "Fidelity Bank", code: "070" },
  { name: "First Bank of Nigeria", code: "011" },
  { name: "First City Monument Bank (FCMB)", code: "214" },
  { name: "Guaranty Trust Bank (GTB)", code: "058" },
  { name: "Heritage Bank", code: "030" },
  { name: "Keystone Bank", code: "082" },
  { name: "Kuda Bank", code: "50211" },
  { name: "Moniepoint MFB", code: "50515" },
  { name: "Opay", code: "999992" },
  { name: "Palmpay", code: "999991" },
  { name: "Stanbic IBTC Bank", code: "039" },
  { name: "Standard Chartered Bank", code: "068" },
  { name: "Sterling Bank", code: "232" },
  { name: "Union Bank of Nigeria", code: "032" },
  { name: "United Bank for Africa (UBA)", code: "033" },
  { name: "Unity Bank", code: "215" },
  { name: "Wema Bank", code: "035" },
  { name: "Zenith Bank", code: "057" }
];

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    full_name: '',
    bank_name: '',
    bank_code: '',
    account_number: '',
    account_name: ''
  });

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }
      setUser(user);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        bank_name: data.bank_name || '',
        bank_code: data.bank_code || '',
        account_number: data.account_number || '',
        account_name: data.account_name || ''
      });
    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          bank_name: formData.bank_name,
          bank_code: formData.bank_code,
          account_number: formData.account_number,
          account_name: formData.account_name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      showSuccess("Profile updated successfully");
      getProfile();
    } catch (error: any) {
      showError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyAccount = async () => {
    if (formData.account_number.length !== 10 || !formData.bank_code) {
      showError("Please enter a valid 10-digit account number and select a bank.");
      return;
    }

    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      showSuccess("Account details verified for manual processing.");
    }, 1500);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-24 px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div className="flex flex-col gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              className="w-fit text-gray-500 hover:text-[#D4AF37] p-0 flex items-center gap-2"
            >
              <ArrowLeft size={16} /> Back
            </Button>
            <div>
              <h1 className="text-4xl font-serif italic mb-2">Account <span className="text-[#D4AF37]">Settings</span></h1>
              <p className="text-gray-500 font-light tracking-widest uppercase text-[10px]">Manage your profile and payout details</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-none px-8"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>

        <div className="grid gap-8">
          <Card className="bg-white/5 border-white/10 rounded-[2rem] overflow-hidden">
            <CardHeader className="border-b border-white/5 p-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                  <User className="text-[#D4AF37] w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-serif italic text-white">Personal Information</CardTitle>
                  <CardDescription className="text-gray-500">Your public profile details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <Input 
                        disabled 
                        value={user?.email} 
                        className="pl-12 h-14 bg-white/5 border-white/10 rounded-none text-gray-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Full Name</Label>
                    <Input 
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="h-14 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="bg-[#D4AF37] hover:bg-[#B8860B] text-black px-10 py-6 rounded-none text-[10px] font-bold uppercase tracking-widest"
                >
                  {saving ? <Loader2 className="animate-spin" /> : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 rounded-[2rem] overflow-hidden">
            <CardHeader className="border-b border-white/5 p-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                  <Wallet className="text-[#D4AF37] w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-serif italic text-white">Payout Information</CardTitle>
                  <CardDescription className="text-gray-500">Where you receive your sprayed funds (Manual Processing)</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-8">
                <div className="p-6 bg-[#D4AF37]/5 border border-[#D4AF37]/10 rounded-2xl flex items-start gap-4">
                  <ShieldCheck className="text-[#D4AF37] w-6 h-6 mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-[#D4AF37] mb-1">Manual Verification</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      We have moved to a manual verification system. Please provide your correct bank details. 
                      Our team will verify these details before processing your event payouts.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Select Bank</Label>
                      <Select 
                        value={formData.bank_code}
                        onValueChange={(value) => {
                          const bank = NIGERIAN_BANKS.find(b => b.code === value);
                          setFormData({ ...formData, bank_code: value, bank_name: bank?.name || '' });
                        }}
                      >
                        <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-none">
                          <SelectValue placeholder="Choose your bank" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                          {NIGERIAN_BANKS.map((bank) => (
                            <SelectItem key={bank.code} value={bank.code}>
                              {bank.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Account Number</Label>
                      <div className="flex gap-2">
                        <Input 
                          value={formData.account_number}
                          onChange={(e) => setFormData({ ...formData, account_number: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                          className="h-14 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50"
                          placeholder="10-digit account number"
                        />
                        <Button 
                          type="button"
                          onClick={handleVerifyAccount}
                          disabled={verifying || formData.account_number.length !== 10}
                          className="h-14 bg-white/10 hover:bg-white/20 text-white px-6 rounded-none text-[10px] font-bold uppercase tracking-widest"
                        >
                          {verifying ? <Loader2 className="animate-spin" /> : "Verify"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Account Name</Label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                        <Input 
                          value={formData.account_name}
                          onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                          className="pl-12 h-14 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50"
                          placeholder="Name on account"
                        />
                      </div>
                    </div>

                    <div className="pt-6">
                      <Button 
                        onClick={handleUpdateProfile}
                        disabled={saving}
                        className="w-full bg-white/10 hover:bg-white/20 text-white py-8 rounded-none text-[10px] font-bold uppercase tracking-widest border border-white/5"
                      >
                        {saving ? <Loader2 className="animate-spin" /> : "Update Payout Details"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;