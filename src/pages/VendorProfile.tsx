"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const VendorProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      
      <div className="relative py-24 md:py-40 px-6 overflow-hidden flex items-center justify-center min-h-screen">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button variant="ghost" onClick={() => navigate('/')} className="mb-8 text-gray-400 hover:text-[#D4AF37]">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Button>
            <h1 className="text-4xl md:text-7xl font-serif italic mb-10 leading-tight">
              Vendor Directory — <span className="text-[#D4AF37]">Coming Soon</span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light tracking-wide">
              We are currently onboarding and vetting qualified vendors to ensure the highest standard of service for our hosts.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;