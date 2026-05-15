"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess, showError } from '@/utils/toast';
import { User, Wallet, Loader2, LogOut, CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { useNavigate } from 'react-router-dom';

const NIGERIAN_BANKS = [
  { name: "Access Bank", code: "044" },
  { name: "Citibank Nigeria", code: "023" },
  { name: "Ecobank Nigeria", code: "050" },
  { name: "Fidelity Bank", code: "070" },
  { name: "First Bank of Nigeria", code: "011" },
  { name: "First City Monument Bank", code: "214" },
  { name: "Guaranty Trust Bank", code: "058" },
  { name: "Heritage Bank", code: "030" },
  { name: "Keystone Bank", code: "082" },
  { name: "Opay", code: "999992" },
  { name: "Palmpay", code: "999991" },
  { name: "Polaris Bank", code: "076" },
  { name: "Stanbic IBTC Bank", code: "221" },
  { name: "Standard Chartered Bank", code: "068" },
  { name: "Sterling Bank", code: "232" },
  { name: "Union Bank of Nigeria", code: "032" },
  { name: "United Bank For Africa", code: "033" },
  { name: "Unity Bank", code: "215" },
  { name: "Wema Bank", code: "035" },
  { name: "Zenith Bank", code: "057" },
  { name: "Kuda Bank", code: "50211" }
].sort((a, b) => a.name.localeCompare(b.name));

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    bank_name: '',
    account_number: '',
    account_name: '',
    paystack_subaccount_code: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/login'); return; }

    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
    if (data) {
      setProfile({
        full_name: data.full_name || '',
        email: user.email || '',
        phone: data.phone || '',
        bank_name: data.bank_name || '',
        account_number: data.account_number || '',
        account_name: data.account_name || '',
        paystack_subaccount_code: data.paystack_subaccount_code || ''
      });
    }
    setLoading(false);
  };

  const handleVerifyBank = async () => {
    if (!profile.bank_name || profile.account_number.length !== 10) {
      showError("Please select a bank and enter a 10-digit account number.");
      return;
    }

    setVerifying(true);
    try {
      const bank = NIGERIAN_BANKS.find(b => b.name === profile.bank_name);
      const response = await fetch('https://vilknsbrvakthefsgfwg.supabase.co/functions/v1/event-security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'verify-bank', 
          payload: { accountNumber: profile.account_number, bankCode: bank?.code } 
        })
      });
      
      const result = await response.json();
      if (!result.status) throw new Error(result.message);

      const verifiedName = result.data.account_name;
      setProfile(prev => ({ ...prev, account_name: verifiedName }));
      showSuccess(`Verified: ${verifiedName}`);

      // Create Subaccount immediately
      const subResponse = await fetch('https://vilknsbrvakthefsgfwg.supabase.co/functions/v1/event-security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'create-subaccount', 
          payload: { accountName: verifiedName, accountNumber: profile.account_number, bankCode: bank?.code } 
        })
      });

      const subResult = await subResponse.json();
      if (!subResult.status) throw new Error(subResult.message);

      const subCode = subResult.data.subaccount_code;
      setProfile(prev => ({ ...prev, paystack_subaccount_code: subCode }));
      
      // Save to DB
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('profiles').update({
        bank_name: profile.bank_name,
        account_number: profile.account_number,
        account_name: verifiedName,
        paystack_subaccount_code: subCode
      }).eq('id', user?.id);

      showSuccess("Bank account linked successfully!");
    } catch (err: any) {
      showError(err.message);
    } finally {
      setVerifying(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('profiles').upsert({
      id: user?.id,
      full_name: profile.full_name,
      phone: profile.phone,
      updated_at: new Date().toISOString()
    });
    if (error) showError(error.message);
    else showSuccess('Profile updated.');
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f]"><Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" /></div>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto py-24 px-6">
        <div className="flex justify-between items-center mb-16">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-[#D4AF37] p-0">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <h1 className="text-4xl font-serif italic">The Profile</h1>
        </div>

        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-8 space-y-12">
            <GlassCard className="p-12 border-white/5">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-10">Personal Identity</h2>
              <form onSubmit={handleSave} className="space-y-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Full Name</Label>
                  <Input className="h-16 bg-white/5 border-white/10 rounded-none" value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
                </div>
                <Button type="submit" disabled={saving} className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-none py-6 text-[10px] font-bold uppercase tracking-widest">
                  {saving ? <Loader2 className="animate-spin" /> : 'Update Identity'}
                </Button>
              </form>
            </GlassCard>

            <GlassCard className="p-12 border-[#D4AF37]/20">
              <div className="flex items-center gap-4 mb-10">
                <Wallet className="text-[#D4AF37] w-6 h-6" />
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Settlement Vault</h2>
              </div>
              
              {profile.paystack_subaccount_code ? (
                <div className="bg-green-500/10 border border-green-500/20 p-8 rounded-3xl text-center">
                  <CheckCircle2 className="text-green-500 w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-serif italic mb-2">Vault Active</h3>
                  <p className="text-gray-400 text-sm mb-6">Funds will be settled to: <br/><span className="text-white font-bold">{profile.account_name}</span></p>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-gray-600">ID: {profile.paystack_subaccount_code}</p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Select Bank</Label>
                      <Select onValueChange={(v) => setProfile({ ...profile, bank_name: v })}>
                        <SelectTrigger className="h-16 bg-white/5 border-white/10 rounded-none">
                          <SelectValue placeholder="Choose Bank" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a1a] border-white/10 text-white max-h-[300px]">
                          {NIGERIAN_BANKS.map(bank => (
                            <SelectItem key={bank.code} value={bank.name}>{bank.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Account Number</Label>
                      <Input maxLength={10} placeholder="10 Digits" className="h-16 bg-white/5 border-white/10 rounded-none" value={profile.account_number} onChange={(e) => setProfile({ ...profile, account_number: e.target.value })} />
                    </div>
                  </div>
                  <Button onClick={handleVerifyBank} disabled={verifying} className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase">
                    {verifying ? <Loader2 className="animate-spin" /> : 'Verify & Link Bank'}
                  </Button>
                </div>
              )}
            </GlassCard>
          </div>
          
          <div className="md:col-span-4">
            <GlassCard className="p-10 text-center border-white/5">
              <ShieldCheck className="text-[#D4AF37] w-12 h-12 mx-auto mb-6" />
              <h3 className="text-lg font-serif italic mb-4">Security Note</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                We use Paystack to verify and route your funds. Your bank details are encrypted and used only for automated settlements.
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;