"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Headphones, Send, ArrowLeft, ShieldCheck, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showSuccess } from '@/utils/toast';

const SUPPORT_EMAIL = "kaelfelix0120@gmail.com";

const Support = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subject = encodeURIComponent(`Support Request: ${formData.subject}`);
    const body = encodeURIComponent(`Hello EventHub Support,\n\nI have a request regarding the platform.\n\n--- REQUEST DETAILS ---\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}\n\nPlease get back to me as soon as possible.`);
    
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    
    showSuccess("Opening your email app...");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      
      <div className="max-w-3xl mx-auto py-24 md:py-40 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-8 text-gray-500 hover:text-[#D4AF37] p-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-8">
            <Headphones className="text-[#D4AF37] w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif italic mb-6">Customer <span className="text-[#D4AF37]">Concierge</span></h1>
          <p className="text-gray-400 text-lg font-light tracking-wide">
            How can we assist you in orchestrating your celebration?
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl p-8 md:p-16 rounded-[3rem] border border-white/10 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Subject of Inquiry</Label>
              <Input 
                required 
                placeholder="e.g. Payment Issue, Feature Request"
                className="h-16 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Detailed Message</Label>
              <Textarea 
                required 
                placeholder="Please describe your request in detail..."
                className="min-h-[200px] bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light resize-none"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500"
            >
              Send Request <Send className="ml-2 w-4 h-4" />
            </Button>

            <div className="flex items-center justify-center gap-6 pt-6 border-t border-white/5">
              <div className="flex items-center gap-2 text-gray-500">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[8px] font-bold uppercase tracking-widest">Priority Support</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[8px] font-bold uppercase tracking-widest">24/7 Response</span>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Support;