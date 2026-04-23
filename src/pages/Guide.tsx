"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/ui/GlassCard';
import { motion } from 'framer-motion';
import { Sparkles, Gem, Crown, CheckCircle2, Smartphone, QrCode, Wallet, Megaphone, Send, MapPin, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Guide = () => {
  const tiers = [
    {
      title: "The Essentials",
      tier: "Basic",
      icon: Sparkles,
      color: "text-blue-400",
      features: [
        {
          name: "Custom Event Page",
          desc: "A high-definition digital home for your event with a live countdown.",
          icon: Smartphone
        },
        {
          name: "RSVP Registry",
          desc: "Collect guest names and WhatsApp numbers instantly.",
          icon: CheckCircle2
        },
        {
          name: "WhatsApp Share",
          desc: "One-tap sharing to blast your invite to groups and contacts.",
          icon: Send
        }
      ]
    },
    {
      title: "The Experience",
      tier: "Standard",
      icon: Gem,
      color: "text-[#D4AF37]",
      features: [
        {
          name: "Digital Entry Pass",
          desc: "Guests receive a unique QR-coded pass for secure entry.",
          icon: QrCode
        },
        {
          name: "HD Media Gallery",
          desc: "Showcase up to 10 high-resolution photos of the couple or event.",
          icon: ImageIcon
        },
        {
          name: "QR Check-in System",
          desc: "Scan guest passes at the door for instant verification.",
          icon: CheckCircle2
        }
      ]
    },
    {
      title: "The Orchestration",
      tier: "Pro",
      icon: Crown,
      color: "text-purple-400",
      features: [
        {
          name: "WhatsApp Blast",
          desc: "Send mass updates to all RSVP'd guests with one click.",
          icon: Send
        },
        {
          name: "Live Broadcast",
          desc: "Post real-time announcements to every guest's digital pass.",
          icon: Megaphone
        },
        {
          name: "Financial Suite",
          desc: "Track your event budget and expenses in a professional ledger.",
          icon: Wallet
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-24 px-6">
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block"
          >
            The Masterclass
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-serif italic mb-8"
          >
            Concierge <span className="text-[#D4AF37]">Guide</span>
          </motion.h1>
          <p className="text-gray-500 max-w-2xl mx-auto font-light tracking-wide text-lg">
            Master the art of digital orchestration. Learn how to use every tool in the EventHub suite.
          </p>
        </div>

        <div className="space-y-32">
          {tiers.map((tier, idx) => (
            <section key={idx} className="relative">
              <div className="flex items-center gap-6 mb-16">
                <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center ${tier.color}`}>
                  <tier.icon size={32} />
                </div>
                <div>
                  <h2 className="text-3xl md:text-5xl font-serif italic">{tier.title}</h2>
                  <p className={`text-[10px] font-bold uppercase tracking-[0.4em] ${tier.color}`}>{tier.tier} Tier Features</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {tier.features.map((feature, fIdx) => (
                  <GlassCard key={fIdx} className="p-10 border-white/5 group hover:border-[#D4AF37]/30 transition-all">
                    <feature.icon className="w-8 h-8 text-[#D4AF37] mb-8 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-serif italic mb-4 text-white">{feature.name}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed font-light tracking-wide">
                      {feature.desc}
                    </p>
                  </GlassCard>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-40 py-24 border-t border-white/5 text-center">
          <h2 className="text-4xl font-serif italic mb-12">Ready to Orchestrate?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Link to="/create-event">
              <Button className="bg-[#D4AF37] text-black px-12 py-8 rounded-none text-[10px] font-bold tracking-[0.3em] uppercase">
                Create Your Event
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" className="border-white/10 text-white px-12 py-8 rounded-none text-[10px] font-bold tracking-[0.3em] uppercase">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Guide;