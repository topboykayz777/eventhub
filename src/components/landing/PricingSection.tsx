"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { showSuccess, showError } from "@/utils/toast";
import { Gift, Sparkles, Crown, Gem, Star, Loader2 } from "lucide-react";

const plans = [
  { 
    id: "beta",
    name: "Beta Access", 
    price: "100", 
    icon: Gift,
    desc: "Exclusive early access for our first 50 testers. Help shape the future of EventHub Nigeria.",
    features: [],
    accent: "bg-[#D4AF37]",
    button: "bg-[#D4AF37] hover:bg-[#B8860B] text-black",
    locked: true  },
  { 
    id: "basic",
    name: "Basic",     price: "25,000", 
    icon: Sparkles,
    desc: "Essential digital presence for intimate gatherings.",
    features: ["Custom Event Page", "RSVP Tracking", "WhatsApp Share Button", "Countdown Timer"],
    accent: "border-white/5",
    button: "bg-white/5 hover:bg-white/10 text-white border border-white/10",
    locked: true
  },
  { 
    id: "standard",
    name: "Standard", 
    price: "75,000", 
    popular: true,
    icon: Gem,
    desc: "The definitive choice for weddings and galas.",
    features: ["Everything in Basic", "10 HD Photo Gallery", "Digital Invite Card", "HD Image Processing", "Guest Check-in System"],
    accent: "border-[#D4AF37]/30 shadow-[0_0_50px_-12px_rgba(212,175,55,0.3)]",
    button: "bg-[#D4AF37] hover:bg-[#B8860B] text-black",
    locked: true
  },
  { 
    id: "pro",
    name: "Pro", 
    price: "150,000", 
    icon: Crown,
    desc: "Full-suite orchestration for high-society events.",
    features: ["Everything in Standard", "50 Media Files (Images/Video)", "WhatsApp Blast to Guests", "Budget Tracker Tool", "Vendor Directory Access"],
    accent: "border-white/5",
    button: "bg-white/5 hover:bg-white/10 text-white border border-white/10",
    locked: true
  }
];

const PricingSection = () => {
  const [betaRemaining, setBetaRemaining] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (planId: string) => {
    if (planId === "beta") {
      if (betaRemaining <= 0) {
        showError("Beta tier is now full.");
        return;
      }
      setBetaRemaining(prev => prev - 1);
    }
    setIsSubmitting(true);
    // Navigate to create‑event page passing the selected plan
    // navigate(`/create-event?plan=${planId}`);
    setIsSubmitting(false);
  };

  // Render beta tier first, then other tiers
  const otherPlans = plans.filter(p => p.id !== "beta");

  return (
    <section className="py-40 px-6 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.span             initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block"
          >
            Investment in Excellence
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif italic mb-8"
          >
            The <span className="text-[#D4AF37]">Service Tiers</span>
          </motion.h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-light tracking-wide">
            Select the tier that matches the scale of your celebration. Each plan is crafted to deliver a seamless digital experience.
          </p>
        </div>

        {/* Beta tier (always first) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4">
            <Gift className="text-[#D4AF37] w-8 h-8" />
          </div>
          <h3 className="text-2xl font-serif italic mb-2">Beta Access</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Exclusive early access for our first 50 testers. Help shape the future of EventHub Nigeria.
          </p>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => handleSubmit("beta")}
              disabled={betaRemaining <= 0}
              className="bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-none px-8 py-6 text-[10px] font-bold uppercase tracking-widest"
            >
              {betaRemaining > 0 ? "Secure This Tier" : "Full"}
            </Button>
          </div>
          {betaRemaining < 50 && (
            <div className="text-center mt-4 text-[#D4AF37] font-bold uppercase tracking-widest">
              {betaRemaining}/50 spots remaining
            </div>
          </div>
        </motion.div>

        {/* Other tiers (locked) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {otherPlans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: plans.indexOf(plans.find(p => p.id === "beta")) * 0.1 + Math.random() * 0.3 }}
              className="relative flex flex-col p-10 md:p-12 rounded-[3rem] border border-white/5"
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-black px-6 py-2 rounded-full text-[8px] font-black tracking-[0.2em] flex items-center gap-2">
                  <Star size={12} fill="currentColor" />
                  <span className="text-sm font-bold uppercase tracking-widest">LAUNCHING SOON</span>
                </div>
              )}
              
              <div className="mb-10">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-8">
                  <plan.icon className="text-[#D4AF37] w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif italic text-white mb-2">{plan.name}</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{plan.desc}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-serif italic text-white">₦{plan.price}</span>
                  <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">/ event</span>
                </div>
              </div>

              <div className="flex-grow space-y-6">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-4 group">
                    <div className="mt-1 w-4 h-4 rounded-full border border-[#D4AF37]/30 flex items-center justify-center group-hover:bg-[#D4AF37]/10 transition-colors">
                      <plan.icon className="text-[#D4AF37] w-2.5 h-2.5" />
                    </div>
                    <span className="text-sm text-gray-400 font-light tracking-wide group-hover:text-white transition-colors">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Lock overlay */}
              <div className="absolute inset-0 bg-[#050505]/80 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-[#D4AF37]">
                    Launching Soon
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Beta tier counter display */}
        {betaRemaining < 50 && (
          <div className="text-center mt-8 text-[#D4AF37] font-bold uppercase tracking-widest">
            {betaRemaining}/50 spots remaining
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingSection;