"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { CheckCircle, Share2, CreditCard, Users } from 'lucide-react';

const Index = () => {
  const plans = [
    { name: 'Basic', price: '10,000', features: ['Custom Event Page', 'RSVP Tracking', 'WhatsApp Share Button'] },
    { name: 'Standard', price: '15,000', features: ['Everything in Basic', 'Photo Gallery', 'Countdown Timer', 'Email Notifications'] },
    { name: 'Pro', price: '20,000', features: ['Everything in Standard', 'WhatsApp Blast to Guests', 'Priority Support', 'Custom Slug'] },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-[#1a1a2e] text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Celebrate Your <span className="text-[#e94560]">Owambe</span> Digitally
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Create beautiful event pages, manage RSVPs, and share the joy with your loved ones on WhatsApp.
          </p>
          <Link to="/create-event">
            <Button size="lg" className="bg-[#e94560] hover:bg-[#d43d56] text-white text-lg px-8 py-6 rounded-full shadow-xl transform transition hover:scale-105">
              Create Your Event Page
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16 text-[#1a1a2e]">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center p-6">
            <div className="bg-[#1a1a2e]/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Share2 className="text-[#e94560] w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-4">Create & Share</h3>
            <p className="text-gray-600">Fill in your event details and get a unique link to share on WhatsApp.</p>
          </div>
          <div className="text-center p-6">
            <div className="bg-[#1a1a2e]/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="text-[#e94560] w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-4">Track RSVPs</h3>
            <p className="text-gray-600">See exactly who is coming with our real-time guest list management.</p>
          </div>
          <div className="text-center p-6">
            <div className="bg-[#1a1a2e]/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CreditCard className="text-[#e94560] w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-4">Secure Payment</h3>
            <p className="text-gray-600">Pay easily with Paystack and get your event page live instantly.</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-[#1a1a2e]">Simple Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div key={plan.name} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-extrabold text-[#e94560] mb-6">
                  ₦{plan.price}
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-gray-600">
                      <CheckCircle className="text-green-500 w-5 h-5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/create-event">
                  <Button className="w-full bg-[#1a1a2e] hover:bg-[#2a2a4e] text-white py-6 rounded-xl">
                    Choose {plan.name}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#1a1a2e] text-white py-12 px-6 text-center">
        <p className="text-gray-400">© 2024 Event Hub Nigeria. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;