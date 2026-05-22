"use client";

import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showError, showSuccess } from '@/utils/toast';
import { motion } from 'framer-motion';
import { Lock, CheckCircle2, Eye, EyeOff, Loader2 } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showError("Passwords do not match.");
      return;
    }

    setLoading(true);
    
    // Immediately trigger the update through Supabase
    const { error } = await supabase.auth.updateUser({ password: password });

    if (error) {
      showError(error.message);
      setLoading(false);
    } else {
      showSuccess("Credential updated successfully.");
      // Redirect to the signup page as specified
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navbar />
      
      <div className="max-w-lg mx-auto pt-28 md:pt-40 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card backdrop-blur-2xl p-12 rounded-[3rem] border border-border shadow-2xl"
        >
          <div className="text-center mb-12">
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">Secure Update</span>
            <h1 className="text-4xl font-serif italic mb-4">New Password</h1>
            <p className="text-muted-foreground text-sm font-light tracking-wide">Set a new secure password for your account.</p>
          </div>

          <form onSubmit={handleReset} className="space-y-8">
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">New Password</Label>
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
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Confirm New Password</Label>
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
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Update Password'}
              {!loading && <CheckCircle2 className="ml-2 w-4 h-4" />}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;