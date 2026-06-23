"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showError, showSuccess } from '@/utils/toast';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, Check, Mail, Lock, ArrowRight, LockIcon, Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'host' | 'vendor'>('host');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // SEO Update
    document.title = "Create Your Event — The Event Hub Nigeria";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Start your event for free on The Event Hub. Set up your guest registry, RSVP page, digital spraying and Vibe Screen in minutes. No commission. No stress.");
    }
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'vendor') return;

    if (password !== confirmPassword) {
      showError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            role: role,
          }
        }
      });

      if (error) {
        showError(error.message);
      } else if (data.user) {
        if (data.session) {
          showSuccess("Welcome to the Elite! Your account has been created.");
          navigate('/dashboard');
        } else {
          showSuccess("Account created! Please click the verification link sent to your email to access your dashboard.");
          navigate('/login');
        }
      }
    } catch (err: any) {
      showError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navbar />
      
      <div className="max-w-lg mx-auto mt-20 px-6 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card backdrop-blur-2xl p-12 rounded-[3rem] border border-border shadow-2xl"
        >
          <div className="text-center mb-12">
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">Membership</span>
            <h1 className="text-4xl font-serif italic mb-4">Join the Elite</h1>
            <p className="text-muted-foreground text-sm font-light tracking-wide">Create your account to begin orchestrating your celebration.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-8">
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4 p-1.5 bg-secondary rounded-2xl border border-border">
              <button
                type="button"
                onClick={() => setRole('host')}
                className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  role === 'host' 
                    ? 'bg-[#D4AF37] text-black shadow-md' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <User size={14} /> Host Event
              </button>
              <button
                type="button"
                onClick={() => setRole('vendor')}
                className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  role === 'vendor' 
                    ? 'bg-[#D4AF37] text-black shadow-md' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Briefcase size={14} /> Vendor Partner
              </button>
            </div>
          </form>

          <div className="relative mt-8">
            <AnimatePresence mode="wait">
              {role === 'vendor' ? (
                <motion.div 
                  key="vendor-coming-soon"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center bg-background/80 backdrop-blur-md rounded-2xl border border-[#D4AF37]/20 p-8"
                >
                  <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-6">
                    <LockIcon className="text-[#D4AF37] w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif italic mb-2">Coming Soon</h3>
                  <p className="text-muted-foreground text-xs uppercase tracking-widest mb-6">The Vendor Atelier is in private beta.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setRole('host')}
                    className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black rounded-none text-[10px] font-bold uppercase tracking-widest"
                  >
                    Register as Host instead
                  </Button>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <form onSubmit={handleSignup} className={`space-y-8 transition-all duration-500 ${role === 'vendor' ? 'blur-md pointer-events-none opacity-20' : ''}`}>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] w-4 h-4" />
                  <Input 
                    type="email"
                    required 
                    placeholder="your@email.com"
                    className="h-16 pl-14 bg-secondary border-border rounded-none focus:border-[#D4AF37]/50 text-lg font-light placeholder:text-muted-foreground/30"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Create Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] w-4 h-4" />
                  <Input 
                    type={showPassword ? 'text' : 'password'}
                    required 
                    placeholder="••••••••"
                    className="h-16 pl-14 pr-12 bg-secondary border-border rounded-none focus:border-[#D4AF37]/50 text-lg font-light placeholder:text-muted-foreground/30"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#D4AF37] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] w-4 h-4" />
                  <Input 
                    type={showConfirmPassword ? 'text' : 'password'}
                    required 
                    placeholder="••••••••"
                    className="h-16 pl-14 pr-12 bg-secondary border-border rounded-none focus:border-[#D4AF37]/50 text-lg font-light placeholder:text-muted-foreground/30"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#D4AF37] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500 shadow-lg"
              >
                {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
              Already a member? <Link to="/login" className="text-[#D4AF37] hover:underline">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;