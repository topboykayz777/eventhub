"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const plans = [
  { 
    name: 'Basic', 
    price: '10,000', 
    features: ['Custom Event Page', 'RSVP Tracking', 'WhatsApp Share Button', 'Countdown Timer'],
    color: 'border-gray-100',
    button: 'bg-[#1a1a2e]'
  },
  { 
    name: 'Standard', 
    price: '15,000', 
    popular: true,
    features: ['Everything in Basic', 'Photo Gallery (5 Photos)', 'Digital Invite Card', 'Email Notifications'],
    color: 'border-[#e94560] shadow-2xl shadow-[#e94560]/10',
    button: 'bg-[#e94560]'
  },
  { 
    name: 'Pro', 
    price: '20,000', 
    features: ['Everything in Standard', 'WhatsApp Blast to Guests', 'Budget Tracker Tool', 'Vendor Directory Access', 'Priority Support'],
    color: 'border-gray-100',
    button: 'bg-[#1a1a2e]'
  },
];

const PricingSection = () => {
  return (
    <section className="py-32 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-[#1a1a2e] mb-6">SIMPLE PRICING</h2>
          <p className="text-xl text-gray-500">Choose the perfect plan for your celebration.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white p-10 rounded-[2.5rem] border-2 relative ${plan.color}`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#e94560] text-white px-6 py-2 rounded-full text-sm font-black flex items-center gap-2">
                  <Star size={14} fill="currentColor" /> MOST POPULAR
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-2 text-[#1a1a2e]">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-[#1a1a2e]">₦{plan.price}</span>
                <span className="text-gray-400 font-medium">/event</span>
              </div>

              <ul className="space-y-4 mb-10">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-gray-600">
                    <CheckCircle className="text-green-500 w-5 h-5 mt-0.5 shrink-0" />
                    <span className="font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/create-event">
                <Button className={`w-full ${plan.button} hover:opacity-90 text-white py-8 rounded-2xl text-lg font-bold shadow-lg`}>
                  Get Started
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