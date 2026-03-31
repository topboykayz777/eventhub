"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/landing/Hero';
import FeaturedEvents from '@/components/landing/FeaturedEvents';
import PricingSection from '@/components/landing/PricingSection';
import VIPCheckout from '@/components/VIPCheckout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Index = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "EventHub Nigeria",
    "operatingSystem": "Web",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": "10000",
      "highPrice": "20000",
      "priceCurrency": "NGN"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Nigeria"
    },
    "description": "Luxury event management platform for weddings, galas, and high-society events in Nigeria."
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] selection:bg-[#D4AF37] selection:text-black overflow-x-hidden max-w-full">
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
      <Navbar />
      
      <main className="overflow-x-hidden max-w-full">
        <Hero />
        <FeaturedEvents />
        
        <section className="py-32 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
              {[
                { label: 'Events Curated', value: '12,000+' },
                { label: 'Guests Welcomed', value: '500k+' },
                { label: 'Moments Captured', value: '1M+' },
                { label: 'Satisfaction', value: '100%' }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-serif italic text-[#D4AF37] mb-3">{stat.value}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* VIP Ticket Section */}
        <section className="py-40 px-6 bg-[#0a0a0a]">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">Limited Availability</span>
              <h2 className="text-4xl md:text-6xl font-serif italic text-white mb-6">The VIP <span className="text-[#D4AF37]">Pass</span></h2>
              <p className="text-gray-500 font-light tracking-wide">Secure your entry to the season's most anticipated events.</p>
            </div>
            <VIPCheckout />
          </div>
        </section>

        <section className="py-40 px-6 bg-[#0f0f0f]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-24">
              <div className="md:w-1/2">
                <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-8 block">The Experience</span>
                <h2 className="text-4xl md:text-6xl font-serif italic text-white mb-10 leading-tight">
                  Elegance in <br /> Every Detail
                </h2>
                <p className="text-lg text-gray-400 mb-12 leading-relaxed font-light tracking-wide">
                  We believe that every celebration is a masterpiece. Our platform provides the canvas for you to design an experience that reflects your unique style and heritage.
                </p>
                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-px bg-[#D4AF37]" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">Bespoke RSVP Management</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-px bg-[#D4AF37]" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">Curated Vendor Directory</p>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 relative">
                <div className="relative z-10 border border-white/10 p-4">
                  <img 
                    src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80" 
                    alt="Elegant Event" 
                    className="w-full h-[600px] object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  />
                </div>
                <div className="absolute -top-12 -right-12 w-48 h-48 border-t border-r border-[#D4AF37]/30" />
                <div className="absolute -bottom-12 -left-12 w-48 h-48 border-b border-l border-[#D4AF37]/30" />
              </div>
            </div>
          </div>
        </section>

        <PricingSection />

        <section className="py-40 px-6 text-center bg-[#0a0a0a] relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-7xl font-serif italic text-white mb-12 leading-tight">
              Begin Your <br /> <span className="text-[#D4AF37]">Legacy</span>
            </h2>
            <p className="text-lg text-gray-400 mb-16 font-light tracking-widest uppercase">
              Join the elite hosts of Nigeria.
            </p>
            <Link to="/create-event">
              <Button className="bg-[#D4AF37] text-black px-16 py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-[#B8860B] transition-all duration-500">
                Start Your Journey
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-[#0a0a0a] text-white py-32 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-24">
          <div className="col-span-2">
            <div className="text-xl font-light tracking-[0.4em] uppercase mb-10">
              Event Hub <span className="text-[#D4AF37]">NG</span>
            </div>
            <p className="text-gray-500 max-w-md text-sm leading-relaxed font-light tracking-wide">
              The definitive platform for luxury event management in Nigeria. Curating excellence since 2026.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-10">Navigation</h4>
            <ul className="space-y-6 text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">
              <li><Link to="/create-event" className="hover:text-white transition-colors">Create</Link></li>
              <li><Link to="/vendors" className="hover:text-white transition-colors">Directory</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] mb-10">Social</h4>
            <ul className="space-y-6 text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-white/5 text-center text-gray-600 text-[10px] font-bold uppercase tracking-[0.3em]">
          © 2026 Event Hub Nigeria. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;