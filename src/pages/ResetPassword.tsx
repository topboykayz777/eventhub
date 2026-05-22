"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showError, showSuccess } from '@/utils/toast';
import { motion } from 'framer-motion';
import { Lock, CheckCircle2, Eye, EyeOff, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useSession } from '@/components/SessionProvider';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { session, loading: sessionLoading } = useSession();
  const [updating, setUpdating] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // We add a small local timeout to give Supabase time to process the URL fragment 
  // if the SessionProvider hasn't caught it yet.
  const [initialCheck, setInitialCheck] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialCheck(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      showError("Your secure session has expired. Please request a new reset link.");
      return;
    }

    if (password.length < 6) {
      showError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      showError("Passwords do not match.");
      return;
    }

    setUpdating(true);
    const { error } = await supabase.auth.updateUser({ password: password });

    if (error) {
      showError(error.message);
    } else {
      showSuccess("Password updated successfully. Access restored.");
      // We clear the session and force a fresh login for security
      await supabase.auth.signOut();
      navigate('/login');
    }
    setUpdating(false);
  };

  const isWaitState = sessionLoading || initialCheck;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navbar />
      
      <div className="max-w-lg mx-auto pt-32 pb-20 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card backdrop-blur-2xl p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-border shadow-2xl"
        >
          <div className="text-center mb-12">
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">Security Protocol</span>
            <h1 className="text-4xl font-serif italic mb-4">Reset Password</h1>
            <p className="text-muted-foreground text-sm font-light tracking-wide">
              {isWaitState ? 'Verifying secure link...' : !session ? 'Recovery session invalid.' : 'Define your new credentials below.'}
            </p>
          </div>

          {isWaitState ? (
            <div className="py-12 flex flex-col items-center justify-center gap-6">
              <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Authenticating Token...</span>
            </div>
          ) : !session ? (
            <div className="space-y-8">
              <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-3xl text-center">
                <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                <p className="text-sm text-red-200/70 leading-relaxed mb-6">
                  The password reset session could not be verified. This happens if the link is expired or has already been used.
                </p>
                <Link to="/forgot-password">
                  <Button variant="outline" className="w-full border-white/10 rounded-2xl py-6 h-auto text-[10px] font-black uppercase tracking-widest">
                    Request New Link
                  </Button>
                </Link>
              </div>
              <Link to="/login" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] w-4 h-4" />
                  <Input 
                    type={showPassword ? 'text' : 'password'}
                    required 
                    placeholder="••••••••"
                    className="h-16 pl-14 pr-12 bg-secondary border-border rounded-none focus:border-[#D4AF37]/50 text-lg font-light"
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
                    className="h-16 pl-14 pr-12 bg-secondary border-border rounded-none focus:border-[#D4AF37]/50 text-lg font-light"
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
                disabled={updating}
                className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500 shadow-lg"
              >
                {updating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                {updating ? 'Updating...' : 'Commit New Password'}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;