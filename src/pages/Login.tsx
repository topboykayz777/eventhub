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
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      showError(error.message);
    } else {
      showSuccess("Welcome back to the Atelier.");
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navbar />
      
      {/* Increased top padding (pt-28) to clear the fixed 20-unit navbar on mobile */}
      <div className="max-w-lg mx-auto pt-28 md:pt-40 px-4 md:px-6 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card backdrop-blur-2xl p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-border shadow-2xl"
        >
          <div className="text-center mb-8 md:mb-12">
            <span className="text-[#D4AF37] text-[8px] md:text-[10px] font-bold tracking-[0.3em] md:tracking-[0.5em] uppercase mb-2 md:mb-4 block">Secure Access</span>
            <h1 className="text-3xl md:text-4xl font-serif italic mb-2 md:mb-4">Welcome Back</h1>
            <p className="text-muted-foreground text-xs md:text-sm font-light tracking-wide">Enter your credentials to access your dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 md:space-y-8">
            <div className="space-y-2 md:space-y-3">
              <Label className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] text-muted-foreground">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] w-4 h-4" />
                <Input 
                  type="email"
                  required 
                  placeholder="your@email.com"
                  className="h-14 md:h-16 pl-12 md:pl-14 bg-secondary border-border rounded-none focus:border-[#D4AF37]/50 text-base md:text-lg font-light placeholder:text-muted-foreground/30"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2 md:space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] text-muted-foreground">Password</Label>
                <Link to="/forgot-password" title="Reset Password" className="text-[7px] md:text-[8px] font-bold uppercase tracking-widest text-[#D4AF37] hover:opacity-70">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] w-4 h-4" />
                <Input 
                  type={showPassword ? 'text' : 'password'}
                  required 
                  placeholder="••••••••"
                  className="h-14 md:h-16 pl-12 md:pl-14 pr-12 bg-secondary border-border rounded-none focus:border-[#D4AF37]/50 text-base md:text-lg font-light placeholder:text-muted-foreground/30"
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

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black py-8 md:py-10 rounded-none text-[10px] font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase transition-all duration-500 shadow-lg"
            >
              {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>

          <div className="mt-8 md:mt-12 text-center">
            <p className="text-muted-foreground text-[8px] md:text-[10px] font-bold uppercase tracking-widest">
              Don't have an account? <Link to="/signup" className="text-[#D4AF37] hover:underline">Join the Elite</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;