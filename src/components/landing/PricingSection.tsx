"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { showSuccess, showError } from "@/utils/toast";
import { Gift, Sparkles, Crown, Gem, Star, Loader2 } from "lucide-react";

const plans = [
  { 
    id: "basic",
    name: "Basic", 
    price: "25,000", 
    icon: Sparkles,
    desc: "Essential digital presence for intimate gatherings.",
    features: ["Custom Event Page", "RSVP Tracking", "WhatsApp Share Button", "Countdown Timer"],
    accent: "border-white/5",
    button: "bg-white/5 hover:bg-white/10 text-white border border-white/10"
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
    button: "bg-[#D4AF37] hover:bg-[#B8860B] text-black"
  },
  { 
    id: "pro",
    name: "Pro", 
    price: "150,000", 
    icon: Crown,
    desc: "Full-suite orchestration for high-society events.",
    features: ["Everything in Standard", "50 Media Files (Images/Video)", "WhatsApp Blast to Guests", "Budget Tracker Tool", "Vendor Directory Access"],
    accent: "border-white/5",
    button: "bg-white/5 hover:bg-white/10 text-white border border-white/10"
  },
  { 
    id: "beta",
    name: "Beta Access",
    price: "100",
    beta: true,
    popular: false,
    icon: Gift,
    desc: "Exclusive early access for our first 50 testers. Help shape the future of EventHub Nigeria.",
    features: [],
    accent: "bg-[#D4AF37]",
    button: "bg-[#D4AF37] hover:bg-[#B8860B] text-black"
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex flex-col p-10 md:p-12 rounded-[3rem] border border-white/5 ${plan.accent}`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-black px-6 py-2 rounded-full text-[8px] font-black tracking-[0.2em] flex items-center gap-2">
                  <Star size={12} fill="currentColor" />
                  <span className="text-sm font-bold uppercase tracking-widest">MOST PREFERRED</span>
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
                      <Gift className="text-[#D4AF37] w-2.5 h-2.5" />
                    </div>
                    <span className="text-sm text-gray-400 font-light tracking-wide group-hover:text-white transition-colors">{feature}</span>
                  </div>
                ))}
              </div>

              <Link to="/create-event">
                <Button 
                  onClick={() => handleSubmit(plan.id)}
                  disabled={plan.id === "beta" && betaRemaining <= 0}
                  className={`w-full py-8 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500 shadow-2xl ${plan.button}`}
                >
                  {plan.id === "beta" ? (betaRemaining > 0 ? "Secure This Tier" : "Full") : "Secure This Tier"}
                </Button>
              </Link>
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