"use client";

import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showError, showSuccess } from '@/utils/toast';
import { motion } from 'framer-motion';
import { User, Briefcase, Check, Mail, Lock, ArrowRight, Clock } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'host' | 'vendor'>('host');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (role === 'vendor') {
      showError("Vendor registration is coming soon. We are currently vetting partners.");
      return;
    }

    if (password !== confirmPassword) {
      showError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role,
        }
      }
    });

    if (error) {
      showError(error.message);
    } else if (data.user) {
      showSuccess("Verification email sent. Please check your inbox to activate your account.");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      
      <div className="max-w-lg mx-auto mt-20 px-6 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-2xl p-12 rounded-[3rem] border border-white/10 shadow-2xl"
        >
          <div className="text-center mb-12">
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">Membership</span>
            <h1 className="text-4xl font-serif italic mb-4">Join EventHub</h1>
            <p className="text-gray-500 text-sm font-light tracking-wide">Select your path and create your account.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-12">
            <button 
              onClick={() => setRole('host')}
              className={`relative p-6 border transition-all text-left group ${role === 'host' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-white/5 hover:border-white/20'}`}
            >
              <User className={`mb-4 ${role === 'host' ? 'text-[#D4AF37]' : 'text-gray-600'}`} />
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Host</p>
              <p className="text-[8px] text-gray-500 uppercase">Plan Events</p>
              {role === 'host' && <div className="absolute top-2 right-2 text-[#D4AF37]"><Check size={12} /></div>}
            </button>

            <button 
              onClick={() => setRole('vendor')}
              className={`relative p-6 border transition-all text-left group ${role === 'vendor' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-white/5 hover:border-white/20'}`}
            >
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37] flex items-center gap-1">
                  <Clock size={10} /> Coming Soon
                </span>
              </div>
              <Briefcase className={`mb-4 ${role === 'vendor' ? 'text-[#D4AF37]' : 'text-gray-600'}`} />
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Vendor</p>
              <p className="text-[8px] text-gray-500 uppercase">List Services</p>
              {role === 'vendor' && <div className="absolute top-2 right-2 text-[#D4AF37]"><Check size={12} /></div>}
            </button>
          </div>

          <form onSubmit={handleSignup} className="space-y-8">
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] w-4 h-4" />
                <Input 
                  type="email"
                  required 
                  placeholder="your@email.com"
                  className="h-16 pl-14 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Create Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] w-4 h-4" />
                <Input 
                  type="password"
                  required 
                  placeholder="••••••••"
                  className="h-16 pl-14 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] w-4 h-4" />
                <Input 
                  type="password"
                  required 
                  placeholder="••••••••"
                  className="h-16 pl-14 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading || role === 'vendor'}
              className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500"
            >
              {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
              Already a member? <Link to="/login" className="text-[#D4AF37] hover:underline">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;