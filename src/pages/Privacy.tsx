"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Shield, Lock, Scale, Eye, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-24 md:py-40 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-8 text-muted-foreground hover:text-[#D4AF37] p-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-8 border border-[#D4AF37]/20">
            <Shield className="text-[#D4AF37] w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif italic mb-6">Legal <span className="text-[#D4AF37]">Atelier</span></h1>
          <p className="text-muted-foreground text-lg font-light tracking-wide">
            Privacy Policy & Terms of Service. Last updated: June 10, 2026.
          </p>
        </motion.div>

        <div className="space-y-16">
          <section className="glass-premium p-8 md:p-16 rounded-[3rem] border border-border shadow-sm">
            <div className="flex items-center gap-4 mb-10">
              <Lock className="text-[#D4AF37] w-6 h-6" />
              <h2 className="text-2xl font-serif italic">Privacy Policy</h2>
            </div>
            
            <div className="prose dark:prose-invert max-w-none space-y-8 text-muted-foreground font-light leading-relaxed">
              <div>
                <h3 className="text-foreground font-bold mb-4 uppercase tracking-widest text-sm">1. Data Collection & NDPA Compliance</h3>
                <p>
                  In accordance with the <strong>Nigeria Data Protection Act (NDPA) 2023</strong>, EventHub Nigeria acts as the Data Controller. We collect personal data solely for the purpose of event orchestration, guest verification, and secure access control.
                </p>
              </div>

              <div>
                <h3 className="text-foreground font-bold mb-4 uppercase tracking-widest text-sm">2. Legal Basis for Processing</h3>
                <p>
                  We process your data based on <strong>Consent</strong> (when you sign up or RSVP) and <strong>Contractual Necessity</strong> to deliver the digital assets you have commissioned.
                </p>
              </div>

              <div>
                <h3 className="text-foreground font-bold mb-4 uppercase tracking-widest text-sm">3. Financial Data & Digital Spraying</h3>
                <p>
                  <strong>For Digital Spraying</strong>, EventHub acts solely as a verification layer. All "Spraying" is done via direct Peer-to-Peer (P2P) transfers. We do not hold guest-to-host funds.
                </p>
              </div>
            </div>
          </section>

          <section className="glass-premium p-8 md:p-16 rounded-[3rem] border border-border shadow-sm">
            <div className="flex items-center gap-4 mb-10">
              <Scale className="text-[#D4AF37] w-6 h-6" />
              <h2 className="text-2xl font-serif italic">Terms of Service</h2>
            </div>
            
            <div className="prose dark:prose-invert max-w-none space-y-8 text-muted-foreground font-light leading-relaxed">
              <div>
                <h3 className="text-foreground font-bold mb-4 uppercase tracking-widest text-sm">1. Service Orchestration</h3>
                <p>
                  Event pages are activated upon successful payment. These fees grant access to our digital suite and are non-refundable once assets have been generated.
                </p>
              </div>

              <div>
                <h3 className="text-foreground font-bold mb-4 uppercase tracking-widest text-sm">2. Host Responsibility</h3>
                <p>
                  Hosts are the sole curators of their event content. EventHub reserves the right to deactivate any page violating high-society conduct standards.
                </p>
              </div>
            </div>
          </section>

          <div className="text-center pt-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground mb-4">Questions regarding these terms?</p>
            <Button 
              onClick={() => navigate('/support')}
              variant="outline" 
              className="border-border text-foreground rounded-none px-8 py-6 text-[10px] font-bold uppercase tracking-widest"
            >
              Contact Legal Concierge
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;