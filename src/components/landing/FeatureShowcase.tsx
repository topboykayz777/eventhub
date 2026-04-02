"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Wallet, ShieldCheck, CheckCircle2, 
  Crown, Gem, Share2, Users, Megaphone, 
  Table as TableIcon, ArrowRight, Zap, Send, Plus, Minus,
  MousePointer2, Smartphone, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const features = [
  {
    id: 'design',
    title: 'The Design Studio',
    desc: 'Craft a bespoke digital presence. Choose from 12+ premium themes, upload high-resolution portraits, and set the aesthetic tone for your celebration.',
    icon: Sparkles,
  },
  {
    id: 'invite',
    title: 'The Digital Invite',
    desc: 'Generate HD digital passes with unique QR codes. Share your event link instantly on WhatsApp and Instagram with a professional countdown timer.',
    icon: Share2,
  },
  {
    id: 'registry',
    title: 'The Guest Registry',
    desc: 'Real-time RSVP tracking with automated guest lists. Monitor attendance velocity and export your registry for vendors with a single click.',
    icon: Users,
  },
  {
    id: 'ledger',
    title: 'The Financial Suite',
    desc: 'Orchestrate your budget with precision. Track every expense and income in "The Ledger," ensuring your event remains within the bounds of excellence.',
    icon: Wallet,
  },
  {
    id: 'concierge',
    title: 'The Concierge',
    desc: 'Manage your event live. Send real-time broadcasts to all guests and assign seating charts with our bulk table management tools.',
    icon: Megaphone,
  },
  {
    id: 'gatekeeper',
    title: 'The Gatekeeper',
    desc: 'Seamless venue entry. Use our integrated QR scanner at the door to verify guests instantly, ensuring only the elite gain access.',
    icon: ShieldCheck,
  }
];

const FeatureShowcase = () => {
  const [activeTab, setActiveTab] = useState('design');
  const [miniTheme, setMiniTheme] = useState('modern');

  return (
    <section className="py-24 md:py-40 px-4 md:px-6 bg-[#080808] relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-32">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[#D4AF37] text-[8px] md:text-[10px] font-bold tracking-[0.5em] uppercase mb-4 md:mb-6 block"
          >
            The Masterpiece Suite
          </motion.span>
          <h2 className="text-4xl md:text-8xl font-serif italic text-white mb-6 md:mb-8 leading-tight">
            The Full <span className="text-[#D4AF37]">Ecosystem</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-light tracking-wide text-base md:text-lg px-4">
            From the first design to the final guest check-in, EventHub provides the definitive tools for Nigeria's most prestigious celebrations.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 md:gap-16 lg:gap-24 items-start">
          {/* Left: Content Tabs */}
          <div className="lg:col-span-5 space-y-2 md:space-y-4 order-2 lg:order-1">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                className={`w-full text-left p-6 md:p-8 transition-all duration-500 border-l-2 group relative overflow-hidden ${
                  activeTab === feature.id 
                    ? 'border-[#D4AF37] bg-white/[0.03]' 
                    : 'border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-4 md:gap-6 mb-2 md:mb-4 relative z-10">
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                    activeTab === feature.id ? 'bg-[#D4AF37] text-black scale-110' : 'bg-white/5 text-gray-500'
                  }`}>
                    <feature.icon size={18} />
                  </div>
                  <h3 className={`text-lg md:text-xl font-serif italic transition-colors duration-500 ${
                    activeTab === feature.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'
                  }`}>
                    {feature.title}
                  </h3>
                </div>
                <p className={`text-xs md:text-sm font-light leading-relaxed tracking-wide transition-colors duration-500 ${
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

          {/* Right: Interactive Explainer Animations */}
          <div className="lg:col-span-7 sticky top-24 md:top-32 order-1 lg:order-2 mb-8 lg:mb-0">
            <div className="relative aspect-square bg-white/[0.02] border border-white/5 rounded-[2rem] md:rounded-[4rem] overflow-hidden flex items-center justify-center p-4 md:p-16">
              <div className="absolute inset-0 bg-[#D4AF37]/5 blur-[100px]" />
              
              <AnimatePresence mode="wait">
                {activeTab === 'design' && (
                  <motion.div 
                    key="design-anim"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full max-w-sm space-y-8 relative"
                  >
                    <div className="absolute -top-12 left-0 right-0 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] bg-[#D4AF37]/10 px-4 py-2 rounded-full border border-[#D4AF37]/20">
                        Interactive Theme Picker
                      </span>
                    </div>

                    <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
                      <motion.div 
                        animate={{ 
                          backgroundColor: miniTheme === 'modern' ? '#0a0a1a' : miniTheme === 'traditional' ? '#064e3b' : '#78350f',
                        }}
                        className="absolute inset-0 flex flex-col p-8"
                      >
                        <div className="flex justify-between items-center mb-6">
                          <div className="h-1.5 w-12 bg-white/20 rounded-full" />
                          <Sparkles size={12} className="text-[#D4AF37]" />
                        </div>
                        <div className="w-full h-32 bg-white/5 rounded-2xl mb-6 overflow-hidden relative">
                          <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80" className="w-full h-full object-cover grayscale" alt="Preview" />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <span className="text-[8px] font-black uppercase tracking-widest text-white bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">Live Preview</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="h-2 w-full bg-white/20 rounded-full" />
                          <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                        </div>
                        <div className="mt-auto text-center">
                          <p className="text-[8px] font-bold uppercase tracking-widest text-gray-500 mb-4">Select Aesthetic</p>
                          <div className="flex justify-center gap-4">
                            {[
                              { id: 'modern', color: 'bg-[#0a0a1a]' },
                              { id: 'traditional', color: 'bg-[#064e3b]' },
                              { id: 'sahara', color: 'bg-[#78350f]' }
                            ].map((t) => (
                              <button
                                key={t.id}
                                onClick={() => setMiniTheme(t.id)}
                                className={`w-10 h-10 rounded-full border-2 transition-all relative group ${t.color} ${miniTheme === t.id ? 'border-[#D4AF37] scale-110' : 'border-white/20'}`}
                              >
                                {miniTheme === t.id && (
                                  <motion.div layoutId="pointer" className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                                    <MousePointer2 size={12} className="text-[#D4AF37] fill-[#D4AF37]" />
                                  </motion.div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'invite' && (
                  <motion.div 
                    key="invite-anim"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="w-full max-w-xs relative"
                  >
                    <div className="absolute -top-12 left-0 right-0 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] bg-[#D4AF37]/10 px-4 py-2 rounded-full border border-[#D4AF37]/20">
                        HD Pass Generation
                      </span>
                    </div>

                    <div className="aspect-[9/19] bg-black border-4 border-white/10 rounded-[2.5rem] p-4 relative overflow-hidden shadow-2xl">
                      <div className="h-1 w-12 bg-white/20 rounded-full mx-auto mb-6" />
                      <div className="space-y-6">
                        <div className="aspect-square bg-white/5 rounded-3xl flex flex-col items-center justify-center gap-4 border border-white/5">
                          <div className="bg-white p-3 rounded-xl shadow-2xl">
                            <Zap className="text-black w-10 h-10" />
                          </div>
                          <span className="text-[7px] font-black uppercase tracking-widest text-[#D4AF37] animate-pulse">Securing QR...</span>
                        </div>
                        <div className="space-y-3">
                          <div className="h-2 w-full bg-white/10 rounded-full" />
                          <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                        </div>
                        <motion.div 
                          animate={{ y: [0, -5, 0], opacity: [0.8, 1, 0.8] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="h-12 w-full bg-[#25D366] rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-green-500/20"
                        >
                          <Share2 size={16} className="text-white" />
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">WhatsApp Blast</span>
                        </motion.div>
                      </div>
                      
                      <motion.div 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="absolute bottom-8 left-4 right-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center">
                            <Send size={12} className="text-white" />
                          </div>
                          <div className="space-y-1.5">
                            <div className="h-1.5 w-24 bg-white/20 rounded-full" />
                            <div className="h-1 w-16 bg-white/10 rounded-full" />
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'registry' && (
                  <motion.div 
                    key="registry-anim"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full max-w-md space-y-8"
                  >
                    <div className="flex justify-between items-end mb-12">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Live RSVP Registry</p>
                        </div>
                        <motion.p 
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="text-7xl font-serif italic text-[#D4AF37]"
                        >
                          124
                        </motion.p>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-gray-600">+12 in the last hour</p>
                      </div>
                      <div className="h-32 w-1.5 bg-white/5 rounded-full relative overflow-hidden">
                        <motion.div 
                          animate={{ height: ['0%', '85%', '0%'] }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className="absolute bottom-0 left-0 right-0 bg-[#D4AF37] shadow-[0_0_20px_#D4AF37]"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      {[
                        { name: 'Tunde A.', status: 'Verified' },
                        { name: 'Sarah O.', status: 'Verified' },
                        { name: 'Chidi K.', status: 'Verified' }
                      ].map((guest, i) => (
                        <motion.div 
                          key={i}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.3, repeat: Infinity, repeatDelay: 3 }}
                          className="bg-white/5 p-6 rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-5">
                            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                              <Users className="text-[#D4AF37] w-4 h-4" />
                            </div>
                            <div>
                              <div className="h-2 w-24 bg-white/20 rounded-full mb-2" />
                              <span className="text-[7px] font-black uppercase tracking-widest text-gray-600">{guest.name}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[6px] font-black uppercase tracking-widest text-green-500">{guest.status}</span>
                            <CheckCircle2 className="text-green-500 w-5 h-5" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'ledger' && (
                  <motion.div 
                    key="ledger-anim"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md space-y-10"
                  >
                    <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 relative overflow-hidden shadow-2xl">
                      <div className="relative z-10">
                        <div className="flex justify-between items-center mb-6">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">Financial Suite</p>
                          <BarChart3 size={14} className="text-[#D4AF37]" />
                        </div>
                        <motion.p 
                          animate={{ opacity: [0.6, 1, 0.6] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-5xl font-serif italic text-white mb-2"
                        >
                          ₦4,250,000
                        </motion.p>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-[#D4AF37]">Total Event Budget</p>
                        
                        <div className="mt-10 space-y-2">
                          <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-500">
                            <span>Utilization</span>
                            <span>75%</span>
                          </div>
                          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                              initial={{ width: "0%" }}
                              animate={{ width: "75%" }}
                              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                              className="h-full gold-gradient shadow-[0_0_20px_#D4AF37]"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/5 blur-[100px] rounded-full" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-red-500/5 p-6 rounded-2xl border border-red-500/10 relative overflow-hidden group">
                        <Minus className="text-red-500 w-4 h-4 mb-3" />
                        <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Expenses</p>
                        <p className="text-xl font-serif italic text-white">₦1.2M</p>
                        <div className="absolute -bottom-2 -right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Smartphone size={40} />
                        </div>
                      </div>
                      <div className="bg-green-500/5 p-6 rounded-2xl border border-green-500/10 relative overflow-hidden group">
                        <Plus className="text-green-500 w-4 h-4 mb-3" />
                        <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Income</p>
                        <p className="text-xl font-serif italic text-white">₦2.8M</p>
                        <div className="absolute -bottom-2 -right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Smartphone size={40} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'concierge' && (
                  <motion.div 
                    key="concierge-anim"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-xs relative"
                  >
                    <div className="absolute -top-12 left-0 right-0 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] bg-[#D4AF37]/10 px-4 py-2 rounded-full border border-[#D4AF37]/20">
                        Live Orchestration
                      </span>
                    </div>

                    <div className="aspect-[9/19] bg-black border-4 border-white/10 rounded-[2.5rem] p-4 relative overflow-hidden shadow-2xl">
                      <div className="h-1 w-12 bg-white/20 rounded-full mx-auto mb-12" />
                      
                      <motion.div 
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="bg-[#D4AF37] p-4 rounded-2xl text-black mb-12 shadow-2xl relative"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Megaphone size={14} className="animate-bounce" />
                          <span className="text-[8px] font-black uppercase tracking-widest">Global Broadcast</span>
                        </div>
                        <p className="text-xs font-serif italic leading-tight">"Dinner is now served in the Grand Ballroom!"</p>
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-black flex items-center justify-center">
                          <span className="text-[6px] font-black text-white">!</span>
                        </div>
                      </motion.div>

                      <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center relative group">
                        <TableIcon className="w-6 h-6 text-[#D4AF37] mx-auto mb-4 group-hover:scale-110 transition-transform" />
                        <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-2">Dynamic Seating</p>
                        <div className="flex items-center justify-center gap-4">
                          <motion.p 
                            animate={{ 
                              scale: [1, 1.2, 1],
                              color: ['#fff', '#D4AF37', '#fff']
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-4xl font-serif italic"
                          >
                            Table 4
                          </motion.p>
                          <ArrowRight size={12} className="text-gray-600" />
                          <p className="text-4xl font-serif italic text-white opacity-40">1</p>
                        </div>
                        <p className="mt-4 text-[6px] font-black uppercase tracking-widest text-[#D4AF37]">Instant Guest Update</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'gatekeeper' && (
                  <motion.div 
                    key="gatekeeper-anim"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative flex flex-col items-center"
                  >
                    <div className="absolute -top-12 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] bg-[#D4AF37]/10 px-4 py-2 rounded-full border border-[#D4AF37]/20">
                        Venue Access Control
                      </span>
                    </div>

                    <div className="w-56 h-56 bg-white p-6 rounded-[3rem] relative overflow-hidden shadow-2xl border-8 border-black/5">
                      <div className="w-full h-full bg-black/5 flex flex-col items-center justify-center gap-4">
                        <Zap className="text-black/10 w-20 h-20" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-black/20">Scanning...</span>
                      </div>
                      <motion.div 
                        animate={{ top: ['-10%', '110%', '-10%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-1.5 bg-[#D4AF37] shadow-[0_0_25px_#D4AF37] z-20"
                      />
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-12 bg-green-500/10 border border-green-500/20 px-10 py-5 rounded-full flex items-center gap-4 shadow-xl"
                    >
                      <CheckCircle2 className="text-green-500 w-6 h-6" />
                      <div className="text-left">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-green-500 block">Access Granted</span>
                        <span className="text-[7px] font-bold uppercase tracking-widest text-green-500/60">Identity Verified</span>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 md:mt-40 text-center px-4"
        >
          <div className="inline-block p-1 rounded-full bg-gradient-to-r from-[#D4AF37]/20 via-white/5 to-[#D4AF37]/20 mb-8 md:mb-12">
            <div className="bg-[#080808] px-6 md:px-8 py-3 md:py-4 rounded-full flex items-center gap-3 md:gap-4">
              <Gem className="text-[#D4AF37] w-3 h-3 md:w-4 md:h-4" />
              <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Ready to orchestrate your legacy?</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#B8860B] text-black px-12 md:px-16 py-8 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500 shadow-2xl shadow-[#D4AF37]/10">
                Join the Elite <ArrowRight className="ml-3 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto border-white/10 text-white hover:bg-white/5 px-12 md:px-16 py-8 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase">
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