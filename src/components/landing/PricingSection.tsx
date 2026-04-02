"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Crown, Sparkles, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const plans = [
  { 
    name: 'Basic', 
    price: '10,000', 
    icon: Sparkles,
    desc: 'Essential digital presence for intimate gatherings.',
    features: ['Custom Event Page', 'RSVP Tracking', 'WhatsApp Share Button', 'Countdown Timer'],
    accent: 'border-white/5',
    button: 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
  },
  { 
    name: 'Standard', 
    price: '15,000', 
    popular: true,
    icon: Gem,
    desc: 'The definitive choice for weddings and galas.',
    features: ['Everything in Basic', '10 HD Photo Gallery', 'Digital Invite Card', 'Email Notifications', 'HD Image Processing'],
    accent: 'border-[#D4AF37]/30 shadow-[0_0_50px_-12px_rgba(212,175,55,0.3)]',
    button: 'bg-[#D4AF37] hover:bg-[#B8860B] text-black'
  },
  { 
    name: 'Pro', 
    price: '20,000', 
    icon: Crown,
    desc: 'Full-suite orchestration for high-society events.',
    features: ['Everything in Standard', '50 Media Files (Images/Video)', 'WhatsApp Blast to Guests', 'Budget Tracker Tool', 'Vendor Directory Access'],
    accent: 'border-white/5',
    button: 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
  },
];

const PricingSection = () => {
  return (
    <section className="py-40 px-6 bg-[#050505] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block"
          >
            Investment in Excellence
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif italic text-white mb-8"
          >
            The <span className="text-[#D4AF37]">Service</span> Tiers
          </motion.h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-light tracking-wide">
            Select the tier that matches the scale of your celebration. Each plan is crafted to deliver a seamless digital experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex flex-col p-10 md:p-12 rounded-[3rem] border glass-premium transition-all duration-500 hover:translate-y-[-10px] ${plan.accent}`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-black px-6 py-2 rounded-full text-[8px] font-black tracking-[0.2em] flex items-center gap-2 whitespace-nowrap shadow-xl">
                  <Star size={12} fill="currentColor" /> MOST PREFERRED
                </div>
              )}
              
              <div className="mb-10">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-8">
                  <plan.icon className="text-[#D4AF37] w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif italic text-white mb-2">{plan.name}</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-8">{plan.desc}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-serif italic text-white">₦{plan.price}</span>
                  <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">/ event</span>
                </div>
              </div>

              <div className="flex-grow space-y-6 mb-12">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-4 group">
                    <div className="mt-1 w-4 h-4 rounded-full border border-[#D4AF37]/30 flex items-center justify-center group-hover:bg-[#D4AF37]/10 transition-colors">
                      <Check className="text-[#D4AF37] w-2.5 h-2.5" />
                    </div>
                    <span className="text-sm text-gray-400 font-light tracking-wide group-hover:text-white transition-colors">{feature}</span>
                  </div>
                ))}
              </div>

              <Link to="/create-event">
                <Button className={`w-full py-8 rounded-none text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-500 ${plan.button}`}>
                  Secure This Tier
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;