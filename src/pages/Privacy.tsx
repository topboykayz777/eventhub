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
    <div className="min-h-screen bg-[#050505] text-white">
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
            className="mb-8 text-gray-500 hover:text-[#D4AF37] p-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-8">
            <Shield className="text-[#D4AF37] w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif italic mb-6">Legal <span className="text-[#D4AF37]">Atelier</span></h1>
          <p className="text-gray-400 text-lg font-light tracking-wide">
            Privacy Policy & Terms of Service. Last updated: May 15, 2026.
          </p>
        </motion.div>

        <div className="space-y-16">
          {/* Privacy Section */}
          <section className="glass-premium p-8 md:p-16 rounded-[3rem] border border-white/5">
            <div className="flex items-center gap-4 mb-10">
              <Lock className="text-[#D4AF37] w-6 h-6" />
              <h2 className="text-2xl font-serif italic">Privacy Policy</h2>
            </div>
            
            <div className="prose prose-invert max-w-none space-y-8 text-gray-400 font-light leading-relaxed">
              <div>
                <h3 className="text-white font-medium mb-4 uppercase tracking-widest text-sm">1. Data Collection & NDPA Compliance</h3>
                <p>
                  In accordance with the <strong>Nigeria Data Protection Act (NDPA) 2023</strong>, EventHub Nigeria acts as the Data Controller. We collect personal data including names, phone numbers, and email addresses solely for the purpose of event orchestration and guest management.
                </p>
              </div>

              <div>
                <h3 className="text-white font-medium mb-4 uppercase tracking-widest text-sm">2. Legal Basis for Processing</h3>
                <p>
                  We process your data based on <strong>Consent</strong> (when you sign up or RSVP) and <strong>Contractual Necessity</strong> (to deliver the event management services you paid for).
                </p>
              </div>

              <div>
                <h3 className="text-white font-medium mb-4 uppercase tracking-widest text-sm">3. Financial Data Security</h3>
                <p>
                  EventHub does not store credit card or bank login details. All payments and "Digital Spraying" transactions are processed via <strong>Paystack</strong>, a PCI-DSS compliant gateway. Your settlement details are encrypted and used only for automated payouts.
                </p>
              </div>

              <div>
                <h3 className="text-white font-medium mb-4 uppercase tracking-widest text-sm">4. Your Rights as a Data Subject</h3>
                <p>
                  Under Nigerian law, you have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your personal data stored on our servers.</li>
                  <li>Request rectification of inaccurate information.</li>
                  <li>Request the "Right to be Forgotten" (deletion of your account and events).</li>
                  <li>Object to automated processing.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Terms Section */}
          <section className="glass-premium p-8 md:p-16 rounded-[3rem] border border-white/5">
            <div className="flex items-center gap-4 mb-10">
              <Scale className="text-[#D4AF37] w-6 h-6" />
              <h2 className="text-2xl font-serif italic">Terms of Service</h2>
            </div>
            
            <div className="prose prose-invert max-w-none space-y-8 text-gray-400 font-light leading-relaxed">
              <div>
                <h3 className="text-white font-medium mb-4 uppercase tracking-widest text-sm">1. Service Activation</h3>
                <p>
                  Event pages are activated upon successful payment of the selected tier fee. These fees are non-refundable once the digital assets (unique URL, QR codes) have been generated and delivered.
                </p>
              </div>

              <div>
                <h3 className="text-white font-medium mb-4 uppercase tracking-widest text-sm">2. User Conduct</h3>
                <p>
                  Hosts are responsible for the content uploaded to their event pages. EventHub reserves the right to deactivate any page containing illegal content, hate speech, or unauthorized use of intellectual property.
                </p>
              </div>

              <div>
                <h3 className="text-white font-medium mb-4 uppercase tracking-widest text-sm">3. Digital Spraying Settlements</h3>
                <p>
                  Funds received via Digital Spraying are subject to Paystack's standard processing fees. EventHub facilitates the collection but is not responsible for delays caused by the Nigerian banking inter-switch system.
                </p>
              </div>

              <div>
                <h3 className="text-white font-medium mb-4 uppercase tracking-widest text-sm">4. Limitation of Liability</h3>
                <p>
                  EventHub provides the platform "as is". While we strive for 99.9% uptime, we are not liable for any indirect losses resulting from technical interruptions during your event.
                </p>
              </div>
            </div>
          </section>

          <div className="text-center pt-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-600 mb-4">Questions regarding these terms?</p>
            <Button 
              onClick={() => navigate('/support')}
              variant="outline" 
              className="border-white/10 text-white rounded-none px-8 py-6 text-[10px] font-bold uppercase tracking-widest"
            >
              Contact Legal Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;