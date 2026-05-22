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
import { Mail, ArrowLeft, Send } from 'lucide-react';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // We explicitly set the redirect to the reset-password page.
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      showError(error.message);
    } else {
      showSuccess("Recovery link sent. Please check your inbox.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navbar />
      
      <div className="max-w-lg mx-auto mt-20 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card backdrop-blur-2xl p-12 rounded-[3rem] border border-border shadow-2xl"
        >
          <div className="mb-8">
            <Link to="/login" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-[#D4AF37] flex items-center gap-2 transition-colors">
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </div>

          <div className="text-center mb-12">
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">Security</span>
            <h1 className="text-4xl font-serif italic mb-4">Recover Access</h1>
            <p className="text-muted-foreground text-sm font-light tracking-wide">Enter your email to receive a secure reset link.</p>
          </div>

          <form onSubmit={handleResetRequest} className="space-y-8">
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

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500 shadow-lg"
            >
              {loading ? 'Sending...' : 'Send Recovery Link'} <Send className="ml-2 w-4 h-4" />
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;