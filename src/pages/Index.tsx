"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import PricingSection from '@/components/landing/PricingSection';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="min-h-screen bg-white selection:bg-[#e94560] selection:text-white">
      <Navbar />
      
      <main>
        <Hero />
        
        <HowItWorks />

        {/* Social Proof / Stats Section */}
        <section className="bg-[#1a1a2e] py-20 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Events Created', value: '5,000+' },
              { label: 'RSVPs Tracked', value: '100k+' },
              { label: 'Happy Hosts', value: '4.9/5' },
              { label: 'WhatsApp Shares', value: '250k+' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-3xl md:text-5xl font-black text-[#e94560] mb-2">{stat.value}</div>
                <div className="text-gray-400 uppercase tracking-widest text-xs font-bold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        <PricingSection />

        {/* Final CTA */}
        <section className="py-32 px-6 text-center bg-white relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#e94560]/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-7xl font-black text-[#1a1a2e] mb-8 leading-tight">
              READY TO DIGITIZE YOUR <span className="text-[#e94560]">OWAMBE?</span>
            </h2>
            <p className="text-xl text-gray-500 mb-12">
              Join thousands of Nigerians making their events more organized and memorable.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a href="/create-event" className="inline-block bg-[#e94560] text-white px-12 py-6 rounded-2xl text-2xl font-black shadow-2xl shadow-[#e94560]/30">
                CREATE YOUR EVENT NOW
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-[#1a1a2e] text-white py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="text-2xl font-black mb-6">
              Event Hub <span className="text-[#e94560]">Nigeria</span>
            </div>
            <p className="text-gray-400 max-w-sm leading-relaxed">
              The ultimate digital companion for Nigerian celebrations. From weddings to birthdays, we make your event management seamless.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-sm text-[#e94560]">Quick Links</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="/create-event" className="hover:text-white transition-colors">Create Event</a></li>
              <li><a href="/vendors" className="hover:text-white transition-colors">Vendor Directory</a></li>
              <li><a href="/login" className="hover:text-white transition-colors">Host Login</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-sm text-[#e94560]">Support</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-gray-500 text-sm">
          © 2024 Event Hub Nigeria. Built for the culture.
        </div>
      </footer>
    </div>
  );
};

export default Index;