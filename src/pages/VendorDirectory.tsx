"use client";

import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Star, ArrowRight, Briefcase, ShieldCheck, Award, CheckCircle2, Loader2, Sparkles, X, Mail, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { showSuccess, showError } from '@/utils/toast';

const categories = ["Catering", "Decor", "Photography", "Music", "Venues", "Planning"];
const SUPPORT_EMAILS = "kaelfelix0120@gmail.com, kaelfelix0121@gmail.com, topboykayz@gmail.com";

const VendorDirectory = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    location: '',
    phone: '',
    instagram: ''
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category) {
      showError("Please select a service category.");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        showError("Please sign in to register as a vendor.");
        return;
      }

      const { error } = await supabase.from('vendors').insert({
        name: formData.name,
        category: formData.category,
        location: formData.location,
        phone: formData.phone,
        instagram: formData.instagram,
        user_id: user.id,
        is_featured: false
      });

      if (error) throw error;

      setIsSuccess(true);
      showSuccess("Application submitted to our curators.");
    } catch (err: any) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openMailto = () => {
    const subject = encodeURIComponent(`Vendor Application: ${formData.name}`);
    const body = encodeURIComponent(`Hello EventHub Team,\n\nI have just submitted my vendor application for ${formData.name} (${formData.category}).\n\n--- APPLICATION DETAILS ---\nBrand Name: ${formData.name}\nCategory: ${formData.category}\nLocation: ${formData.location}\nPhone: ${formData.phone}\nInstagram: ${formData.instagram}\n\nPlease review my portfolio for the upcoming launch.`);
    window.location.href = `mailto:${SUPPORT_EMAILS}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      
      <div className="relative py-24 md:py-40 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full mb-8">
              <Clock className="text-[#D4AF37] w-4 h-4" />
              <span className="text-[#D4AF37] text-[10px] font-black tracking-[0.3em] uppercase">Launching Q3 2026</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-serif italic mb-10 leading-tight">
              The Vendor <span className="text-[#D4AF37]">Atelier</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light tracking-wide mb-16">
              We are curating Nigeria's most prestigious directory of vetted event professionals. 
              Apply now to secure your place in the elite network before our public launch.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Button 
                onClick={() => setIsRegistering(true)}
                className="bg-[#D4AF37] hover:bg-[#B8860B] text-black px-12 py-8 rounded-none text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-500"
              >
                Apply for Membership
              </Button>
              <div className="flex items-center gap-4 text-gray-500">
                <ShieldCheck className="text-[#D4AF37] w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Vetted Professionals Only</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <section className="py-32 px-6 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16">
            {[
              { 
                title: "Direct Access", 
                desc: "Connect directly with hosts planning high-budget weddings and galas.",
                icon: Briefcase 
              },
              { 
                title: "Elite Branding", 
                desc: "Position your brand alongside Nigeria's most respected event vendors.",
                icon: Award 
              },
              { 
                title: "Seamless Inquiries", 
                desc: "Receive structured inquiries linked directly to active event dashboards.",
                icon: Sparkles 
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-8">
                  <feature.icon className="text-[#D4AF37] w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif italic mb-4">{feature.title}</h3>
                <p className="text-gray-500 text-sm font-light leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-40 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-serif italic mb-4">Directory Preview</h2>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Insights for Registered Partners</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 opacity-20 blur-xl pointer-events-none select-none">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-premium p-10 rounded-[3rem] border border-white/5 h-96 flex flex-col justify-end">
                <div className="h-4 w-24 bg-white/10 mb-4" />
                <div className="h-8 w-48 bg-white/20 mb-2" />
                <div className="h-4 w-32 bg-white/10" />
              </div>
            ))}
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-center bg-[#050505]/80 backdrop-blur-xl p-12 md:p-20 border border-[#D4AF37]/20 rounded-[4rem] max-w-2xl mx-6">
              <h3 className="text-3xl md:text-4xl font-serif italic mb-6">Be Among the First</h3>
              <p className="text-gray-400 text-base mb-10 leading-relaxed">
                Our directory is currently in private beta. Registered vendors will receive early access to build their portfolios before the public launch.
              </p>
              <Button 
                onClick={() => setIsRegistering(true)}
                variant="outline" 
                className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black rounded-none px-10 py-8 text-[10px] font-bold uppercase tracking-widest"
              >
                Register Your Brand
              </Button>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {isRegistering && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-2xl w-full bg-[#0f0f0f] border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => { setIsRegistering(false); setIsSuccess(false); }}
                className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              {isSuccess ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="text-green-500 w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-serif italic mb-6">Application Received</h2>
                  <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                    Your brand has been added to our vetting queue. Our curators will review your details and contact you shortly.
                  </p>
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600">Direct Support Channels</p>
                    <div className="flex flex-col gap-2 text-sm text-[#D4AF37] font-light">
                      <span>kaelfelix0120@gmail.com</span>
                      <span>kaelfelix0121@gmail.com</span>
                      <span>topboykayz@gmail.com</span>
                    </div>
                    <Button 
                      onClick={openMailto}
                      className="mt-8 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-none px-8 py-6 text-[10px] font-bold uppercase tracking-widest"
                    >
                      <Mail className="w-4 h-4 mr-2" /> Send Portfolio Directly
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center mb-12">
                    <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">Vendor Application</span>
                    <h2 className="text-3xl font-serif italic">Brand Registration</h2>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Brand Name</Label>
                        <Input 
                          required 
                          className="h-14 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Category</Label>
                        <Select 
                          value={formData.category}
                          onValueChange={(v) => setFormData({ ...formData, category: v })}
                        >
                          <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-none">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                            {categories.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Primary Location</Label>
                      <Input 
                        required 
                        placeholder="e.g. Victoria Island, Lagos"
                        className="h-14 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">WhatsApp Number</Label>
                        <Input 
                          required 
                          className="h-14 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Instagram Handle</Label>
                        <Input 
                          placeholder="@yourbrand"
                          className="h-14 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50"
                          value={formData.instagram}
                          onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : 'Submit Application'}
                    </Button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorDirectory;