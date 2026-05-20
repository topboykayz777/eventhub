"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showSuccess, showError } from '@/utils/toast';
import { User, Mail, Phone, Building, Globe, Camera, Loader2, Save, ArrowLeft, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/components/SessionProvider';
import { motion } from 'framer-motion';

const Profile = () => {
  const navigate = useNavigate();
  const { session, user } = useSession();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    full_name: '',
    company_name: '',
    phone: '',
    website: '',
    bank_name: '',
    account_number: '',
    account_name: ''
  });

  useEffect(() => {
    if (!session && !fetching) navigate('/login');
    
    const fetchProfile = async () => {
      if (!user?.id) return;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        if (data) {
          setFormData({
            full_name: data.full_name || '',
            company_name: data.company_name || '',
            phone: data.phone || '',
            website: data.website || '',
            bank_name: data.bank_name || '',
            account_number: data.account_number || '',
            account_name: data.account_name || ''
          });
        }
      } catch (err: any) {
        showError(err.message);
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, [user, session, fetching, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          company_name: formData.company_name,
          phone: formData.phone,
          website: formData.website,
          bank_name: formData.bank_name,
          account_number: formData.account_number,
          account_name: formData.account_name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;
      showSuccess("Identity updated.");
    } catch (err: any) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="flex items-center justify-center min-h-screen bg-background"><Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" /></div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-24 md:py-32 px-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')} 
            className="mb-8 text-muted-foreground hover:text-[#D4AF37] p-0 flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
          </Button>
          <span className="text-[#D4AF37] text-[10px] font-black tracking-[0.5em] uppercase mb-4 block">The Dossier</span>
          <h1 className="text-4xl md:text-7xl font-serif italic leading-tight">
            Host <span className="text-[#D4AF37]">Profile</span>
          </h1>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="bg-card border border-border p-8 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="flex items-center gap-4 border-b border-border pb-8 mb-12">
              <User className="text-[#D4AF37] w-5 h-5" />
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground">Personal Identity</span>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Full Legal Name</Label>
                <div className="relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4AF37] w-4 h-4 opacity-50" />
                  <Input 
                    className="h-16 pl-16 bg-secondary border-border rounded-2xl focus:border-[#D4AF37] text-lg font-light text-foreground"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4AF37] w-4 h-4 opacity-50" />
                  <Input 
                    disabled
                    className="h-16 pl-16 bg-secondary/50 border-border rounded-2xl text-lg font-light text-muted-foreground cursor-not-allowed"
                    value={user?.email || ''}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">WhatsApp Number</Label>
                <div className="relative">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4AF37] w-4 h-4 opacity-50" />
                  <Input 
                    className="h-16 pl-16 bg-secondary border-border rounded-2xl focus:border-[#D4AF37] text-lg font-light text-foreground"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Company / Brand</Label>
                <div className="relative">
                  <Building className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4AF37] w-4 h-4 opacity-50" />
                  <Input 
                    className="h-16 pl-16 bg-secondary border-border rounded-2xl focus:border-[#D4AF37] text-lg font-light text-foreground"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border p-8 md:p-16 rounded-[3rem] shadow-2xl">
            <div className="flex items-center gap-4 border-b border-border pb-8 mb-12">
              <Star className="text-[#D4AF37] w-5 h-5" />
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground">Treasury Details</span>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Bank Name</Label>
                <Input 
                  className="h-16 px-6 bg-secondary border-border rounded-2xl focus:border-[#D4AF37] text-lg font-light text-foreground"
                  value={formData.bank_name}
                  onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Account Number</Label>
                <Input 
                  className="h-16 px-6 bg-secondary border-border rounded-2xl focus:border-[#D4AF37] text-lg font-light text-foreground"
                  value={formData.account_number}
                  onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Account Holder</Label>
                <Input 
                  className="h-16 px-6 bg-secondary border-border rounded-2xl focus:border-[#D4AF37] text-lg font-light text-foreground"
                  value={formData.account_name}
                  onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="pt-8">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black h-24 rounded-[2.5rem] text-[12px] font-black tracking-[0.5em] uppercase transition-all duration-500 shadow-xl group"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <span className="flex items-center gap-4">Commit Changes <Save size={20} /></span>}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;