"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Wallet, ShieldCheck, CheckCircle2, 
  Crown, Gem, Share2, Users, Megaphone, 
  Table as TableIcon, ArrowRight, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';

const features = [
  {
    id: 'design',
    title: 'The Design Studio',
    desc: 'Craft a bespoke digital presence. Choose from 12+ premium themes, upload high-resolution portraits, and set the aesthetic tone for your celebration.',
    icon: Sparkles,
    color: '#D4AF37'
  },
  {
    id: 'invite',
    title: 'The Digital Invite',
    desc: 'Generate HD digital passes with unique QR codes. Share your event link instantly on WhatsApp and Instagram with a professional countdown timer.',
    icon: Share2,
    color: '#D4AF37'
  },
  {
    id: 'registry',
    title: 'The Guest Registry',
    desc: 'Real-time RSVP tracking with automated guest lists. Monitor attendance velocity and export your registry for vendors with a single click.',
    icon: Users,
    color: '#D4AF37'
  },
  {
    id: 'ledger',
    title: 'The Financial Suite',
    desc: 'Orchestrate your budget with precision. Track every expense and income in "The Ledger," ensuring your event remains within the bounds of excellence.',
    icon: Wallet,
    color: '#D4AF37'
  },
  {
    id: 'concierge',
    title: 'The Concierge',
    desc: 'Manage your event live. Send real-time broadcasts to all guests and assign seating charts with our bulk table management tools.',
    icon: Megaphone,
    color: '#D4AF37'
  },
  {
    id: 'gatekeeper',
    title: 'The Gatekeeper',
    desc: 'Seamless venue entry. Use our integrated QR scanner at the door to verify guests instantly, ensuring only the elite gain access.',
    icon: ShieldCheck,
    color: '#D4AF37'
  }
];

const FeatureShowcase = () => {
  const [activeTab, setActiveTab] = useState('design');

  useEffect(() => {
    if (activeTab === 'design') {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8, x: 0.5 },
        colors: ['#D4AF37', '#F9E4B7', '#FFFFFF'],
        disableForReducedMotion: true
      });
    }
  }, [activeTab]);

  return (
    <section className="py-40 px-6 bg-[#080808] relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-32">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block"
          >
            The Masterpiece Suite
          </motion.span>
          <h2 className="text-5xl md:text-8xl font-serif italic text-white mb-8 leading-tight">
            The Full <span className="text-[#D4AF37]">Ecosystem</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-light tracking-wide text-lg">
            From the first design to the final guest check-in, EventHub provides the definitive tools for Nigeria's most prestigious celebrations.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 md:gap-24 items-start">
          {/* Left: Content Tabs */}
          <div className="lg:col-span-5 space-y-4">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                className={`w-full text-left p-8 transition-all duration-500 border-l-2 group relative overflow-hidden ${
                  activeTab === feature.id 
                    ? 'border-[#D4AF37] bg-white/[0.03]' 
                    : 'border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-6 mb-4 relative z-10">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                    activeTab === feature.id ? 'bg-[#D4AF37] text-black scale-110' : 'bg-white/5 text-gray-500'
                  }`}>
                    <feature.icon size={20} />
                  </div>
                  <h3 className={`text-xl font-serif italic transition-colors duration-500 ${
                    activeTab === feature.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'
                  }`}>
                    {feature.title}
                  </h3>
                </div>
                <p className={`text-sm font-light leading-relaxed tracking-wide transition-colors duration-500 ${
                  activeTab === feature.id ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {feature.desc}
                </p>
                {activeTab === feature.id && (
                  <motion.div 
                    layoutId="active-bg"
                    className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/5 to-transparent pointer-events-none"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right: Interactive UI Mockups */}
          <div className="lg:col-span-7 sticky top-32">
            <div className="relative aspect-square bg-white/[0.02] border border-white/5 rounded-[4rem] overflow-hidden flex items-center justify-center p-8 md:p-16">
              <div className="absolute inset-0 bg-[#D4AF37]/5 blur-[100px]" />
              
              <AnimatePresence mode="wait">
                {activeTab === 'design' && (
                  <motion.div 
                    key="design-ui"
                    initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                    className="relative w-full max-w-sm aspect-[4/5.5] bg-black border-2 border-[#D4AF37]/30 rounded-[3rem] p-8 shadow-2xl"
                  >
                    <div className="w-full h-40 bg-white/5 rounded-2xl mb-8 overflow-hidden relative group">
                      <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80" className="w-full h-full object-cover grayscale" alt="Preview" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Zap className="text-[#D4AF37] w-8 h-8" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-2 bg-[#D4AF37]/20 rounded-full w-full" />
                      <div className="h-2 bg-white/5 rounded-full w-3/4" />
                      <div className="h-2 bg-white/5 rounded-full w-1/2" />
                    </div>
                    <div className="mt-12 grid grid-cols-4 gap-3">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className={`aspect-square rounded-lg border border-white/10 ${i === 1 ? 'bg-[#D4AF37]' : 'bg-white/5'}`} />
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'invite' && (
                  <motion.div 
                    key="invite-ui"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    className="w-full max-w-xs aspect-[4/6] bg-gradient-to-b from-[#1a1a1a] to-black border border-white/10 rounded-[2.5rem] p-8 shadow-2xl text-center flex flex-col"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-6">
                      <Crown className="text-[#D4AF37] w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-serif italic text-white mb-2">The Balogun Wedding</h4>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-gray-500 mb-8">Elite Entry Pass</p>
                    <div className="bg-white p-4 rounded-2xl mb-8 mx-auto">
                      <div className="w-32 h-32 bg-black/5 flex items-center justify-center">
                        <Zap className="text-black/20 w-12 h-12" />
                      </div>
                    </div>
                    <div className="mt-auto flex gap-3">
                      <div className="flex-1 h-10 bg-[#D4AF37] rounded-xl" />
                      <div className="flex-1 h-10 bg-white/5 rounded-xl" />
                    </div>
                  </motion.div>
                )}

                {activeTab === 'registry' && (
                  <motion.div 
                    key="registry-ui"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    className="w-full space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-white/5 p-8 border border-white/5 rounded-3xl text-center">
                        <p className="text-4xl font-serif italic text-[#D4AF37] mb-2">452</p>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-gray-500">Total RSVPs</p>
                      </div>
                      <div className="bg-white/5 p-8 border border-white/5 rounded-3xl text-center">
                        <p className="text-4xl font-serif italic text-white mb-2">84%</p>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-gray-500">Attendance Rate</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white/5 p-5 border border-white/5 flex justify-between items-center rounded-2xl">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-white/10" />
                            <div className="h-2 w-24 bg-white/10 rounded-full" />
                          </div>
                          <div className="w-4 h-4 rounded-full bg-green-500/20 border border-green-500/40" />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'ledger' && (
                  <motion.div 
                    key="ledger-ui"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full max-w-md"
                  >
                    <div className="bg-[#D4AF37] p-10 rounded-[3rem] mb-8 text-black">
                      <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Current Balance</p>
                      <p className="text-5xl md:text-6xl font-serif italic">₦2,840,000</p>
                    </div>
                    <div className="space-y-4">
                      {[
                        { label: 'Catering Deposit', amount: '- ₦850,000' },
                        { label: 'Ticket Sales', amount: '+ ₦420,000' }
                      ].map((item, i) => (
                        <div key={i} className="bg-white/5 p-6 border border-white/5 flex justify-between items-center rounded-2xl">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{item.label}</span>
                          <span className="text-lg font-serif italic text-white">{item.amount}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'concierge' && (
                  <motion.div 
                    key="concierge-ui"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="w-full space-y-8"
                  >
                    <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 p-8 rounded-3xl flex items-center gap-6">
                      <Megaphone className="text-[#D4AF37] w-8 h-8 animate-bounce" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-1">Live Broadcast</p>
                        <p className="text-lg font-serif italic text-white">"The After-Party has begun in the Ballroom!"</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="aspect-square bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2">
                          <TableIcon className="w-4 h-4 text-gray-600" />
                          <span className="text-[8px] font-bold text-gray-500">Table {i}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'gatekeeper' && (
                  <motion.div 
                    key="gatekeeper-ui"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative flex flex-col items-center"
                  >
                    <div className="relative w-56 h-56 bg-white p-6 rounded-[3rem] mb-12 shadow-2xl">
                      <div className="w-full h-full bg-black/5 flex items-center justify-center">
                        <ShieldCheck className="w-24 h-24 text-black/10" />
                      </div>
                      <motion.div 
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-[#D4AF37] shadow-[0_0_20px_#D4AF37]"
                      />
                    </div>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-green-500/10 border border-green-500/20 px-10 py-5 rounded-full flex items-center gap-4"
                    >
                      <CheckCircle2 className="text-green-500 w-6 h-6" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-green-500">Access Granted</span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Final CTA for the section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40 text-center"
        >
          <div className="inline-block p-1 rounded-full bg-gradient-to-r from-[#D4AF37]/20 via-white/5 to-[#D4AF37]/20 mb-12">
            <div className="bg-[#080808] px-8 py-4 rounded-full flex items-center gap-4">
              <Gem className="text-[#D4AF37] w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Ready to orchestrate your legacy?</span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <Link to="/signup">
              <Button className="bg-[#D4AF37] hover:bg-[#B8860B] text-black px-16 py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500 shadow-2xl shadow-[#D4AF37]/10 hover:px-20">
                Join the Elite <ArrowRight className="ml-3 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 px-16 py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase">
                Access Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureShowcase;