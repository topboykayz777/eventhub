"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Wallet, ShieldCheck, CheckCircle2, 
  Share2, Users, Megaphone, 
  Table as TableIcon, Zap, Send, Plus, Minus,
  MousePointer2, Smartphone, BarChart3, ArrowRight
} from 'lucide-react';

const steps = [
  {
    id: 'design',
    label: 'Step 1: The Design Studio',
    action: 'Choosing Midnight Noir Theme...',
    icon: Sparkles,
  },
  {
    id: 'invite',
    label: 'Step 2: The Digital Blast',
    action: 'Generating HD Elite Passes...',
    icon: Share2,
  },
  {
    id: 'registry',
    label: 'Step 3: The Live Registry',
    action: 'RSVPs Streaming In Real-time...',
    icon: Users,
  },
  {
    id: 'ledger',
    label: 'Step 4: The Financial Suite',
    action: 'Orchestrating the Ledger...',
    icon: Wallet,
  },
  {
    id: 'concierge',
    label: 'Step 5: The Concierge',
    action: 'Broadcasting Live Updates...',
    icon: Megaphone,
  },
  {
    id: 'gatekeeper',
    label: 'Step 6: The Gatekeeper',
    action: 'Verifying Elite Access...',
    icon: ShieldCheck,
  }
];

const FeatureShowcase = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [miniTheme, setMiniTheme] = useState('modern');

  // Auto-play the simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 md:py-40 px-4 md:px-6 bg-[#080808] relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-[#D4AF37]/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[#D4AF37] text-[8px] md:text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block"
          >
            The Orchestration Journey
          </motion.span>
          <h2 className="text-4xl md:text-7xl font-serif italic text-white mb-8">
            How It <span className="text-[#D4AF37]">Works</span>
          </h2>
          
          {/* Step Progress Bar */}
          <div className="flex justify-center gap-2 md:gap-4 mb-12">
            {steps.map((step, i) => (
              <div 
                key={step.id}
                className={`h-1 transition-all duration-1000 rounded-full ${
                  i <= currentStep ? 'w-8 md:w-12 bg-[#D4AF37]' : 'w-4 md:w-6 bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* The Main Simulation Frame */}
        <div className="relative w-full max-w-3xl mx-auto aspect-[4/3] md:aspect-video bg-white/[0.02] border border-white/5 rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-2xl">
          
          {/* Step Label Overlay */}
          <div className="absolute top-8 left-8 right-8 z-50 flex justify-between items-start pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div 
                key={steps[currentStep].id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-1"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">{steps[currentStep].label}</p>
                <p className="text-lg md:text-2xl font-serif italic text-white">{steps[currentStep].action}</p>
              </motion.div>
            </AnimatePresence>
            
            <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
              {React.createElement(steps[currentStep].icon, { className: "text-[#D4AF37] w-6 h-6" })}
            </div>
          </div>

          {/* Simulation Content */}
          <div className="absolute inset-0 flex items-center justify-center p-8 md:p-20">
            <AnimatePresence mode="wait">
              
              {/* DESIGN STUDIO SIMULATION */}
              {steps[currentStep].id === 'design' && (
                <motion.div 
                  key="design"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="w-full max-w-md"
                >
                  <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                    <motion.div 
                      animate={{ 
                        backgroundColor: miniTheme === 'modern' ? '#0a0a1a' : miniTheme === 'traditional' ? '#064e3b' : '#78350f',
                      }}
                      className="absolute inset-0 flex flex-col p-6"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div className="h-1 w-12 bg-white/20 rounded-full" />
                        <Sparkles size={10} className="text-[#D4AF37]" />
                      </div>
                      <div className="flex-1 bg-white/5 rounded-2xl mb-4 overflow-hidden relative">
                        <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80" className="w-full h-full object-cover grayscale" alt="Preview" />
                        <motion.div 
                          animate={{ x: [0, 40, -20, 0], y: [0, 20, -10, 0] }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        >
                          <MousePointer2 size={24} className="text-[#D4AF37] fill-[#D4AF37] drop-shadow-2xl" />
                        </motion.div>
                      </div>
                      <div className="flex justify-center gap-4">
                        {['modern', 'traditional', 'sahara'].map((t) => (
                          <button 
                            key={t}
                            onClick={() => setMiniTheme(t)}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${
                              t === 'modern' ? 'bg-[#0a0a1a]' : t === 'traditional' ? 'bg-[#064e3b]' : 'bg-[#78350f]'
                            } ${miniTheme === t ? 'border-[#D4AF37] scale-110' : 'border-white/20'}`}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* INVITE SIMULATION */}
              {steps[currentStep].id === 'invite' && (
                <motion.div 
                  key="invite"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  className="w-full max-w-xs"
                >
                  <div className="aspect-[9/19] bg-black border-4 border-white/10 rounded-[2.5rem] p-4 relative overflow-hidden shadow-2xl">
                    <div className="h-1 w-12 bg-white/20 rounded-full mx-auto mb-8" />
                    <div className="space-y-6">
                      <motion.div 
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="aspect-square bg-white/5 rounded-3xl flex flex-col items-center justify-center gap-4 border border-white/5"
                      >
                        <div className="bg-white p-3 rounded-xl shadow-2xl">
                          <Zap className="text-black w-10 h-10" />
                        </div>
                        <span className="text-[7px] font-black uppercase tracking-widest text-[#D4AF37]">Securing QR...</span>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="h-12 w-full bg-[#25D366] rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-green-500/20"
                      >
                        <Share2 size={16} className="text-white" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">WhatsApp Blast</span>
                      </motion.div>
                    </div>
                    <motion.div 
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="absolute bottom-8 left-4 right-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center">
                          <Send size={12} className="text-white" />
                        </div>
                        <div className="h-1.5 w-24 bg-white/20 rounded-full" />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* REGISTRY SIMULATION */}
              {steps[currentStep].id === 'registry' && (
                <motion.div 
                  key="registry"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full max-w-md space-y-8"
                >
                  <div className="flex justify-between items-end mb-8">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Live RSVP Feed</p>
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-8xl font-serif italic text-[#D4AF37]"
                      >
                        124
                      </motion.p>
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
                    {[1, 2, 3].map((i) => (
                      <motion.div 
                        key={i}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.2 }}
                        className="bg-white/5 p-6 rounded-2xl border border-white/5 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-5">
                          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                            <Users className="text-[#D4AF37] w-4 h-4" />
                          </div>
                          <div className="h-2 w-32 bg-white/10 rounded-full" />
                        </div>
                        <CheckCircle2 className="text-green-500 w-5 h-5" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* LEDGER SIMULATION */}
              {steps[currentStep].id === 'ledger' && (
                <motion.div 
                  key="ledger"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
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
                        className="text-6xl font-serif italic text-white mb-2"
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
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <motion.div animate={{ x: [-10, 0, -10] }} transition={{ duration: 3, repeat: Infinity }} className="bg-red-500/5 p-6 rounded-2xl border border-red-500/10">
                      <Minus className="text-red-500 w-4 h-4 mb-3" />
                      <p className="text-xl font-serif italic text-white">₦1.2M</p>
                    </motion.div>
                    <motion.div animate={{ x: [10, 0, 10] }} transition={{ duration: 3, repeat: Infinity }} className="bg-green-500/5 p-6 rounded-2xl border border-green-500/10">
                      <Plus className="text-green-500 w-4 h-4 mb-3" />
                      <p className="text-xl font-serif italic text-white">₦2.8M</p>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* CONCIERGE SIMULATION */}
              {steps[currentStep].id === 'concierge' && (
                <motion.div 
                  key="concierge"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full max-w-xs relative"
                >
                  <div className="aspect-[9/19] bg-black border-4 border-white/10 rounded-[2.5rem] p-4 relative overflow-hidden shadow-2xl">
                    <div className="h-1 w-12 bg-white/20 rounded-full mx-auto mb-12" />
                    
                    <motion.div 
                      initial={{ y: -100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="bg-[#D4AF37] p-4 rounded-2xl text-black mb-12 shadow-2xl relative"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Megaphone size={14} className="animate-bounce" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Global Broadcast</span>
                      </div>
                      <p className="text-xs font-serif italic leading-tight">"Dinner is now served in the Grand Ballroom!"</p>
                    </motion.div>

                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center relative group">
                      <TableIcon className="w-6 h-6 text-[#D4AF37] mx-auto mb-4" />
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
                    </div>
                  </div>
                </motion.div>
              )}

              {/* GATEKEEPER SIMULATION */}
              {steps[currentStep].id === 'gatekeeper' && (
                <motion.div 
                  key="gatekeeper"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  className="relative flex flex-col items-center"
                >
                  <div className="w-64 h-64 bg-white p-6 rounded-[3rem] relative overflow-hidden shadow-2xl border-8 border-black/5">
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

          {/* Bottom Navigation Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
            {steps.map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  i === currentStep ? 'w-8 bg-[#D4AF37]' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 md:mt-32 text-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="bg-[#D4AF37] hover:bg-[#B8860B] text-black px-12 py-8 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500 shadow-2xl shadow-[#D4AF37]/10">
              Start Your Journey
            </button>
            <button className="border border-white/10 text-white hover:bg-white/5 px-12 py-8 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase">
              The Directory
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureShowcase;