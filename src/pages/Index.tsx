"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import PricingSection from '@/components/landing/PricingSection';
import { motion } from 'framer-motion';
import { Camera, Users, Calendar, Heart } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-[#0a0a1a] selection:bg-[#e94560] selection:text-white">
      <Navbar />
      
      <main>
        <Hero />
        
        {/* Vibrant Stats Section with Moving Background */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#e94560]/10 to-[#4ecca3]/10 animate-pulse" />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {[
                { label: 'Events Hosted', value: '12,000+', icon: Calendar },
                { label: 'Guests Invited', value: '500k+', icon: Users },
                { label: 'Memories Made', value: '1M+', icon: Camera },
                { label: 'Love Shared', value: '100%', icon: Heart }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center group"
                >
                  <div className="inline-flex p-4 rounded-2xl bg-white/5 mb-4 group-hover:scale-110 transition-transform">
                    <stat.icon className="text-[#e94560] w-8 h-8" />
                  </div>
                  <div className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">{stat.value}</div>
                  <div className="text-[#4ecca3] uppercase tracking-widest text-xs font-black">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <HowItWorks />

        {/* Featured Imagery Section */}
        <section className="py-32 px-6 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="md:w-1/2">
                <h2 className="text-5xl md:text-7xl font-black text-[#1a1a2e] mb-8 leading-tight">
                  CAPTURE EVERY <span className="text-[#e94560]">MOMENT</span>
                </h2>
                <p className="text-xl text-gray-500 mb-10 leading-relaxed">
                  From the grand entrance to the last dance, Event Hub Nigeria helps you organize the chaos of a celebration into a beautiful digital experience.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100">
                    <div className="text-3xl font-black text-[#1a1a2e] mb-2">Real-time</div>
                    <div className="text-gray-500">RSVP updates as they happen.</div>
                  </div>
                  <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100">
                    <div className="text-3xl font-black text-[#1a1a2e] mb-2">Seamless</div>
                    <div className="text-gray-500">WhatsApp integration for sharing.</div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 relative">
                <motion.div 
                  animate={{ rotate: [0, 5, 0] }}
                  transition={{ duration: 10, repeat: Infinity }}
                  className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80" 
                    alt="Wedding Celebration" 
                    className="w-full h-[600px] object-cover"
                  />
                </motion.div>
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#e94560]/10 rounded-full blur-3xl -z-10" />
                <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#4ecca3]/10 rounded-full blur-3xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        <PricingSection />

        {/* Final CTA with Vibrant Background */}
        <section className="py-40 px-6 text-center bg-[#0a0a1a] relative overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80" 
              className="w-full h-full object-cover opacity-20"
              alt="Party Background"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-transparent to-[#0a0a1a]" />
          </div>
          
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-8xl font-black text-white mb-10 leading-tight tracking-tighter"
            >
              DON'T JUST HOST. <br />
              <span className="text-[#e94560]">DOMINATE.</span>
            </motion.h2>
            <p className="text-2xl text-gray-400 mb-16 font-medium">
              Join the elite hosts using Nigeria's most powerful event platform.
            </p>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <a href="/create-event" className="inline-block bg-[#e94560] text-white px-16 py-8 rounded-[2rem] text-3xl font-black shadow-[0_0_60px_rgba(233,69,96,0.5)] hover:bg-[#d43d56] transition-all">
                START YOUR OWAMBE
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-[#050510] text-white py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16">
          <div className="col-span-2">
            <div className="text-3xl font-black mb-8 tracking-tighter">
              EVENT HUB <span className="text-[#e94560]">NG</span>
            </div>
            <p className="text-gray-400 max-w-md text-lg leading-relaxed">
              Elevating Nigerian celebrations through technology. We provide the tools you need to host unforgettable events with ease.
            </p>
          </div>
          <div>
            <h4 className="font-black mb-8 uppercase tracking-[0.2em] text-sm text-[#e94560]">Navigation</h4>
            <ul className="space-y-4 text-gray-400 text-lg">
              <li><a href="/create-event" className="hover:text-white transition-colors">Create Event</a></li>
              <li><a href="/vendors" className="hover:text-white transition-colors">Vendor Directory</a></li>
              <li><a href="/login" className="hover:text-white transition-colors">Host Login</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-8 uppercase tracking-[0.2em] text-sm text-[#e94560]">Connect</h4>
            <ul className="space-y-4 text-gray-400 text-lg">
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">WhatsApp</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5 text-center text-gray-600 font-medium">
          © 2024 Event Hub Nigeria. Built for the culture.
        </div>
      </footer>
    </div>
  );
};

export default Index;