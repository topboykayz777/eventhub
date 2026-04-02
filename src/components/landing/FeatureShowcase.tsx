"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Wallet, ShieldCheck, CheckCircle2, 
  Share2, Users, Megaphone, 
  Table as TableIcon, Zap, Send, Plus, Minus,
  MousePointer2, Smartphone, BarChart3, ArrowRight,
  CreditCard, Lock, Check, Calendar, MapPin, Type
} from 'lucide-react';

const steps = [
  {
    id: 'creation',
    label: 'Phase I: The Genesis',
    action: 'Designing the Masterpiece...',
    desc: 'A human-like interaction filling out the event details in the Creator Suite.'
  },
  {
    id: 'activation',
    label: 'Phase II: The Activation',
    action: 'Securing the Presence...',
    desc: 'Simulating the Paystack secure payment flow and instant activation.'
  },
  {
    id: 'dashboard',
    label: 'Phase III: The Command Center',
    action: 'Orchestrating in Real-time...',
    desc: 'Monitoring live RSVPs and broadcasting updates to all guests.'
  },
  {
    id: 'guest',
    label: 'Phase IV: The Elite Pass',
    action: 'The Guest Experience...',
    desc: 'A mobile simulation of the digital invite and unique entry QR code.'
  },
  {
    id: 'ledger',
    label: 'Phase V: The Master Ledger',
    action: 'Financial Precision...',
    desc: 'Tracking every naira of income and expenses in the financial suite.'
  },
  {
    id: 'gatekeeper',
    label: 'Phase VI: The Gatekeeper',
    action: 'Seamless Venue Entry...',
    desc: 'Live QR verification at the door for exclusive access control.'
  }
];

const FeatureShowcase = () => {
  const [activeStep, setActiveStep] = useState(0);

  // Automatic cycle every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 md:py-40 px-4 md:px-6 bg-[#050505] relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl aspect-square bg-[#D4AF37]/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[#D4AF37] text-[8px] md:text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block"
          >
            The Orchestration Journey
          </motion.span>
          <h2 className="text-4xl md:text-8xl font-serif italic text-white mb-8">
            The <span className="text-[#D4AF37]">Ecosystem</span> in Motion
          </h2>
          
          {/* Progress Bar */}
          <div className="flex justify-center gap-2 md:gap-4">
            {steps.map((_, i) => (
              <button 
                key={i}
                onClick={() => setActiveStep(i)}
                className={`h-1 transition-all duration-1000 rounded-full ${
                  i === activeStep ? 'w-12 md:w-20 bg-[#D4AF37]' : i < activeStep ? 'w-6 md:w-8 bg-[#D4AF37]/30' : 'w-4 md:w-6 bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 md:gap-24 items-center">
          {/* Left: The Narrative (Hidden on small screens to focus on animation) */}
          <div className="lg:col-span-5 hidden lg:block space-y-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em]">{steps[activeStep].label}</p>
                  <h3 className="text-5xl font-serif italic text-white leading-tight">{steps[activeStep].action}</h3>
                </div>
                <p className="text-gray-500 text-lg font-light leading-relaxed max-w-md">
                  {steps[activeStep].desc}
                </p>
                <div className="flex items-center gap-6 pt-8">
                  <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center">
                    <span className="text-[#D4AF37] font-serif italic text-xl">{activeStep + 1}</span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-[#D4AF37]/30 to-transparent" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: The High-Fidelity Simulation */}
          <div className="lg:col-span-7">
            <div className="relative aspect-square md:aspect-[4/3] bg-white/[0.02] border border-white/5 rounded-[3rem] md:rounded-[5rem] overflow-hidden shadow-2xl backdrop-blur-3xl">
              
              {/* Simulation Header */}
              <div className="absolute top-8 left-8 right-8 z-50 flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20" />
                </div>
                <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Live Simulation</span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                
                {/* SCENE 0: CREATION (Form Filling) */}
                {activeStep === 0 && (
                  <motion.div 
                    key="scene-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full w-full p-12 md:p-20 flex flex-col justify-center"
                  >
                    <div className="space-y-10 max-w-md mx-auto w-full">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-[#D4AF37]">
                          <Type size={14} />
                          <span className="text-[8px] font-bold uppercase tracking-widest">Event Identity</span>
                        </div>
                        <div className="h-16 bg-white/5 border border-white/10 rounded-none flex items-center px-6 relative overflow-hidden">
                          <motion.span 
                            initial={{ width: 0 }}
                            animate={{ width: "auto" }}
                            transition={{ duration: 2, delay: 1 }}
                            className="text-lg font-light text-white whitespace-nowrap overflow-hidden"
                          >
                            The Balogun Wedding Gala
                          </motion.span>
                          <motion.div 
                            animate={{ x: [0, 240, 200], y: [40, 0, 0] }}
                            transition={{ duration: 2 }}
                            className="absolute left-4"
                          >
                            <MousePointer2 size={24} className="text-[#D4AF37] fill-[#D4AF37] drop-shadow-2xl" />
                          </motion.div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-gray-500">
                            <Calendar size={14} />
                            <span className="text-[8px] font-bold uppercase tracking-widest">Date</span>
                          </div>
                          <div className="h-16 bg-white/5 border border-white/10 rounded-none flex items-center px-6">
                            <span className="text-sm text-gray-400">Dec 24, 2026</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-gray-500">
                            <MapPin size={14} />
                            <span className="text-[8px] font-bold uppercase tracking-widest">Venue</span>
                          </div>
                          <div className="h-16 bg-white/5 border border-white/10 rounded-none flex items-center px-6">
                            <span className="text-sm text-gray-400">Eko Hotel</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SCENE 1: ACTIVATION (Payment) */}
                {activeStep === 1 && (
                  <motion.div 
                    key="scene-1"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="h-full w-full flex items-center justify-center p-8 md:p-20"
                  >
                    <div className="w-full max-w-sm bg-white p-10 rounded-[3rem] shadow-2xl text-black relative overflow-hidden">
                      <div className="flex justify-between items-center mb-10">
                        <CreditCard size={24} className="text-gray-400" />
                        <div className="flex gap-2">
                          <div className="w-8 h-5 bg-blue-600 rounded-sm" />
                          <div className="w-8 h-5 bg-orange-500 rounded-sm" />
                        </div>
                      </div>
                      <div className="space-y-6 mb-10">
                        <div className="h-3 w-full bg-gray-100 rounded-full" />
                        <div className="h-3 w-2/3 bg-gray-100 rounded-full" />
                      </div>
                      <motion.button 
                        animate={{ scale: [1, 0.95, 1] }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="w-full bg-black text-white py-6 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3"
                      >
                        <Lock size={14} /> Secure Payment
                      </motion.button>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2 }}
                        className="absolute inset-0 bg-white flex flex-col items-center justify-center p-10 text-center"
                      >
                        <div className="bg-green-500/10 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                          <CheckCircle2 className="text-green-500 w-10 h-10" />
                        </div>
                        <h4 className="text-2xl font-serif italic mb-2">Activation Complete</h4>
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">Your event is now live</p>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* SCENE 2: DASHBOARD (Real-time) */}
                {activeStep === 2 && (
                  <motion.div 
                    key="scene-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full w-full p-12 md:p-20 flex flex-col"
                  >
                    <div className="flex justify-between items-end mb-16">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">Live RSVPs</p>
                        </div>
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-8xl font-serif italic text-[#D4AF37]"
                        >
                          124
                        </motion.p>
                      </div>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4].map(i => (
                          <motion.div 
                            key={i}
                            animate={{ height: [20, 60, 30, 80, 40] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                            className="w-2 bg-[#D4AF37]/20 rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                    
                    <motion.div 
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="bg-[#D4AF37] p-6 rounded-2xl text-black flex items-center gap-6 shadow-2xl relative overflow-hidden"
                    >
                      <Megaphone className="animate-bounce" />
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-widest mb-1">Global Broadcast</p>
                        <p className="text-sm font-serif italic">"The Buffet is now open!"</p>
                      </div>
                      <div className="absolute top-0 right-0 w-12 h-12 bg-black/5 rotate-45 -mr-6 -mt-6" />
                    </motion.div>

                    <div className="mt-auto space-y-4">
                      {[1, 2].map(i => (
                        <div key={i} className="bg-white/5 p-6 border border-white/5 flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10" />
                            <div className="h-2 w-32 bg-white/10 rounded-full" />
                          </div>
                          <CheckCircle2 className="text-green-500 w-5 h-5" />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* SCENE 3: GUEST EXPERIENCE (Mobile) */}
                {activeStep === 3 && (
                  <motion.div 
                    key="scene-3"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-full w-full flex items-center justify-center p-8 md:p-20"
                  >
                    <div className="w-72 aspect-[9/19] bg-black border-4 border-white/10 rounded-[3rem] p-6 relative overflow-hidden shadow-2xl">
                      <div className="h-1 w-12 bg-white/20 rounded-full mx-auto mb-12" />
                      <div className="text-center space-y-8">
                        <div className="inline-flex p-3 rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37]">
                          <Sparkles size={24} />
                        </div>
                        <h3 className="text-xl font-serif italic text-white">Welcome Back, <br/> Tunde</h3>
                        <div className="bg-white p-4 rounded-3xl shadow-2xl inline-block">
                          <Zap className="text-black w-24 h-24" />
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                          <p className="text-[8px] font-bold uppercase tracking-widest text-gray-500 mb-1">Your Seating</p>
                          <p className="text-2xl font-serif italic text-[#D4AF37]">Table 4</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/10 to-transparent pointer-events-none" />
                    </div>
                  </motion.div>
                )}

                {/* SCENE 4: LEDGER (Financials) */}
                {activeStep === 4 && (
                  <motion.div 
                    key="scene-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full w-full p-12 md:p-20 flex flex-col"
                  >
                    <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 mb-12 relative overflow-hidden shadow-2xl">
                      <div className="relative z-10">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] mb-4">Event Balance</p>
                        <p className="text-6xl font-serif italic text-white">₦2,840,000</p>
                        <div className="mt-10 h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "65%" }}
                            transition={{ duration: 2, delay: 1 }}
                            className="h-full gold-gradient shadow-[0_0_20px_#D4AF37]"
                          />
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/5 blur-[100px] rounded-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-green-500/5 p-8 border border-green-500/10 rounded-3xl">
                        <Plus className="text-green-500 mb-4" />
                        <p className="text-2xl font-serif italic">₦4.2M</p>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-gray-500">Income</p>
                      </div>
                      <div className="bg-red-500/5 p-8 border border-red-500/10 rounded-3xl">
                        <Minus className="text-red-500 mb-4" />
                        <p className="text-2xl font-serif italic">₦1.4M</p>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-gray-500">Expenses</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SCENE 5: GATEKEEPER (QR Scan) */}
                {activeStep === 5 && (
                  <motion.div 
                    key="scene-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full w-full flex flex-col items-center justify-center p-12 md:p-20"
                  >
                    <div className="w-64 h-64 bg-white p-6 rounded-[3rem] relative overflow-hidden shadow-2xl border-8 border-black/5">
                      <div className="w-full h-full bg-black/5 flex flex-col items-center justify-center gap-4">
                        <Zap className="text-black/10 w-24 h-24" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-black/20">Scanning...</span>
                      </div>
                      <motion.div 
                        animate={{ top: ['-10%', '110%', '-10%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-2 bg-[#D4AF37] shadow-[0_0_30px_#D4AF37] z-20"
                      />
                    </div>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="mt-16 bg-green-500/10 border border-green-500/20 px-12 py-6 rounded-full flex items-center gap-6 shadow-2xl"
                    >
                      <CheckCircle2 className="text-green-500 w-8 h-8" />
                      <div className="text-left">
                        <span className="text-[12px] font-black uppercase tracking-[0.3em] text-green-500 block">Access Granted</span>
                        <span className="text-[8px] font-bold uppercase tracking-widest text-green-500/60">Tunde Afolayan • Table 4</span>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* UI Frame Elements */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 h-1.5 w-24 bg-white/10 rounded-full" />
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {steps.map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === activeStep ? 'bg-[#D4AF37]' : 'bg-white/10'}`} />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;