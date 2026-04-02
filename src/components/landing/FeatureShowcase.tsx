"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Wallet, ShieldCheck, CheckCircle2, 
  Share2, Users, Megaphone, 
  Table as TableIcon, Zap, Send, Plus, Minus,
  MousePointer2, Smartphone, BarChart3, ArrowRight,
  Globe, Lock, Bell
} from 'lucide-react';

const FeatureShowcase = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Transform values for the "Universal Device"
  const deviceScale = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.8, 1, 1, 0.8]);
  const deviceOpacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);
  
  // Step Progress (0 to 5)
  const step = useTransform(scrollYProgress, [0, 0.15, 0.35, 0.55, 0.75, 0.95], [0, 1, 2, 3, 4, 5]);

  const steps = [
    {
      id: 'design',
      label: 'THE DESIGN STUDIO',
      desc: 'Bespoke Theme Orchestration',
      detail: 'Instantly morphing the "Aura" of your event page with Midnight Noir aesthetics.',
      icon: Sparkles
    },
    {
      id: 'invite',
      label: 'THE DIGITAL BLAST',
      desc: 'HD Elite Pass Generation',
      detail: 'Securing unique QR identities and deploying them via encrypted WhatsApp channels.',
      icon: Share2
    },
    {
      id: 'registry',
      label: 'THE LIVE REGISTRY',
      desc: 'Real-time RSVP Velocity',
      detail: 'Monitoring the guest influx with millisecond precision as RSVPs stream in.',
      icon: Users
    },
    {
      id: 'ledger',
      label: 'THE FINANCIAL SUITE',
      desc: 'Precision Budgeting',
      detail: 'Visualizing capital flow with the "Gold Gradient" utilization engine.',
      icon: Wallet
    },
    {
      id: 'concierge',
      label: 'THE CONCIERGE',
      desc: 'Live Event Command',
      detail: 'Broadcasting global updates and re-routing guest seating on the fly.',
      icon: Megaphone
    },
    {
      id: 'gatekeeper',
      label: 'THE GATEKEEPER',
      desc: 'Elite Access Control',
      detail: 'Verifying digital credentials at the door with zero-latency scanning.',
      icon: ShieldCheck
    }
  ];

  return (
    <div ref={containerRef} className="relative h-[600vh] bg-[#050505]">
      {/* Sticky Viewport */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Background Ambient Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl aspect-square bg-[#D4AF37]/5 blur-[180px] rounded-full" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </div>

        {/* The Universal Device Frame */}
        <motion.div 
          style={{ scale: deviceScale, opacity: deviceOpacity }}
          className="relative w-[90%] max-w-4xl aspect-video md:aspect-[16/10] bg-[#0a0a0a] rounded-[3rem] md:rounded-[5rem] border-[12px] border-[#1a1a1a] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* Device Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-10 bg-[#111] flex items-center justify-between px-12 z-50">
            <div className="flex items-center gap-4">
              <Globe size={12} className="text-gray-600" />
              <span className="text-[8px] font-black text-gray-600 tracking-widest uppercase">eventhub.ng/secure-atelier</span>
            </div>
            <div className="flex items-center gap-4">
              <Lock size={10} className="text-[#D4AF37]" />
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="absolute inset-0 pt-10 flex">
            
            {/* Left Sidebar (Navigation Simulation) */}
            <div className="w-20 md:w-24 border-r border-white/5 flex flex-col items-center py-12 gap-8 bg-[#080808]">
              {steps.map((s, i) => (
                <motion.div 
                  key={s.id}
                  animate={{ 
                    opacity: Math.floor(step.get()) === i ? 1 : 0.2,
                    scale: Math.floor(step.get()) === i ? 1.2 : 1
                  }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${Math.floor(step.get()) === i ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-white'}`}
                >
                  <s.icon size={18} />
                </motion.div>
              ))}
            </div>

            {/* Right Content (The Live Simulation) */}
            <div className="flex-1 relative bg-[#0a0a0a] overflow-hidden">
              
              {/* Step 1: Design Studio */}
              <StepContent active={Math.floor(step.get()) === 0}>
                <div className="h-full flex flex-col p-12">
                  <div className="flex justify-between items-center mb-12">
                    <h4 className="text-3xl font-serif italic text-white">The Design Studio</h4>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0a0a1a] border border-[#D4AF37]" />
                      <div className="w-8 h-8 rounded-full bg-[#064e3b] border border-white/10" />
                      <div className="w-8 h-8 rounded-full bg-[#78350f] border border-white/10" />
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <div className="h-4 w-full bg-white/5 rounded-full" />
                      <div className="h-4 w-3/4 bg-white/5 rounded-full" />
                      <div className="h-4 w-1/2 bg-white/5 rounded-full" />
                      <div className="pt-8">
                        <div className="h-16 w-full bg-[#D4AF37] rounded-none" />
                      </div>
                    </div>
                    <div className="relative rounded-3xl overflow-hidden border border-white/10 group">
                      <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80" className="w-full h-full object-cover grayscale" alt="Preview" />
                      <motion.div 
                        animate={{ x: [0, 50, -20, 0], y: [0, 30, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute top-1/2 left-1/2"
                      >
                        <MousePointer2 size={32} className="text-[#D4AF37] fill-[#D4AF37] drop-shadow-2xl" />
                      </motion.div>
                    </div>
                  </div>
                  <Annotation x="70%" y="30%" label="Real-time Theme Morphing" />
                </div>
              </StepContent>

              {/* Step 2: Digital Invite */}
              <StepContent active={Math.floor(step.get()) === 1}>
                <div className="h-full flex items-center justify-center p-12">
                  <div className="w-full max-w-md flex gap-12 items-center">
                    <div className="w-48 aspect-[9/16] bg-black border-4 border-white/10 rounded-[2rem] p-4 relative shadow-2xl">
                      <div className="h-1 w-8 bg-white/20 rounded-full mx-auto mb-6" />
                      <div className="bg-white p-4 rounded-2xl mb-4">
                        <Zap className="text-black w-full h-auto" />
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full mb-2" />
                      <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                    </div>
                    <div className="flex-1 space-y-8">
                      <div className="bg-[#25D366]/10 border border-[#25D366]/20 p-6 rounded-2xl">
                        <div className="flex items-center gap-3 mb-4">
                          <Send size={16} className="text-[#25D366]" />
                          <span className="text-[10px] font-black text-[#25D366] uppercase tracking-widest">WhatsApp Engine</span>
                        </div>
                        <div className="space-y-2">
                          <div className="h-1.5 w-full bg-[#25D366]/20 rounded-full" />
                          <div className="h-1.5 w-3/4 bg-[#25D366]/20 rounded-full" />
                        </div>
                      </div>
                      <div className="h-14 w-full bg-[#D4AF37] flex items-center justify-center gap-3 text-black font-black text-[10px] uppercase tracking-widest">
                        Deploy Elite Passes
                      </div>
                    </div>
                  </div>
                  <Annotation x="30%" y="40%" label="Encrypted QR Generation" />
                </div>
              </StepContent>

              {/* Step 3: Live Registry */}
              <StepContent active={Math.floor(step.get()) === 2}>
                <div className="h-full flex flex-col p-12">
                  <div className="flex justify-between items-end mb-12">
                    <div>
                      <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.4em] mb-2">Live Registry</p>
                      <motion.h4 
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="text-8xl font-serif italic text-white"
                      >
                        124
                      </motion.h4>
                    </div>
                    <div className="flex gap-2 items-end h-32">
                      {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                        <motion.div 
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: i * 0.1, duration: 1 }}
                          className="w-3 bg-[#D4AF37]/20 rounded-t-full relative overflow-hidden"
                        >
                          <motion.div 
                            animate={{ height: ['0%', '100%', '0%'] }}
                            transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                            className="absolute bottom-0 left-0 right-0 bg-[#D4AF37]"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-white/10" />
                          <div className="h-2 w-24 bg-white/10 rounded-full" />
                        </div>
                        <CheckCircle2 size={16} className="text-green-500" />
                      </div>
                    ))}
                  </div>
                  <Annotation x="80%" y="20%" label="RSVP Velocity Tracking" />
                </div>
              </StepContent>

              {/* Step 4: Financial Suite */}
              <StepContent active={Math.floor(step.get()) === 3}>
                <div className="h-full flex items-center justify-center p-12">
                  <div className="w-full max-w-2xl grid grid-cols-2 gap-12">
                    <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 relative overflow-hidden">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-4">The Ledger</p>
                      <p className="text-5xl font-serif italic text-white mb-8">₦4.2M</p>
                      <div className="space-y-3">
                        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">
                          <span>Utilization</span>
                          <span>75%</span>
                        </div>
                        <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '75%' }}
                            transition={{ duration: 2 }}
                            className="h-full gold-gradient shadow-[0_0_20px_#D4AF37]"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="bg-red-500/5 p-6 rounded-2xl border border-red-500/10 flex items-center justify-between">
                        <div>
                          <p className="text-[8px] font-black text-red-500 uppercase tracking-widest mb-1">Expenses</p>
                          <p className="text-2xl font-serif italic text-white">₦1.2M</p>
                        </div>
                        <Minus className="text-red-500" />
                      </div>
                      <div className="bg-green-500/5 p-6 rounded-2xl border border-green-500/10 flex items-center justify-between">
                        <div>
                          <p className="text-[8px] font-black text-green-500 uppercase tracking-widest mb-1">Income</p>
                          <p className="text-2xl font-serif italic text-white">₦2.8M</p>
                        </div>
                        <Plus className="text-green-500" />
                      </div>
                    </div>
                  </div>
                  <Annotation x="25%" y="30%" label="Gold Gradient Ledger" />
                </div>
              </StepContent>

              {/* Step 5: Concierge */}
              <StepContent active={Math.floor(step.get()) === 4}>
                <div className="h-full flex items-center justify-center p-12">
                  <div className="w-full max-w-md space-y-12">
                    <motion.div 
                      initial={{ y: -50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="bg-[#D4AF37] p-6 rounded-3xl text-black shadow-2xl relative"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Bell size={16} className="animate-bounce" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Global Broadcast</span>
                      </div>
                      <p className="text-lg font-serif italic leading-tight">"Dinner is now served in the Grand Ballroom!"</p>
                    </motion.div>
                    <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 text-center">
                      <TableIcon className="w-10 h-10 text-[#D4AF37] mx-auto mb-6" />
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-4">Dynamic Seating</p>
                      <div className="flex items-center justify-center gap-6">
                        <motion.p 
                          animate={{ scale: [1, 1.2, 1], color: ['#fff', '#D4AF37', '#fff'] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-6xl font-serif italic"
                        >
                          Table 4
                        </motion.p>
                        <ArrowRight size={24} className="text-gray-700" />
                        <p className="text-6xl font-serif italic text-white opacity-20">1</p>
                      </div>
                    </div>
                  </div>
                  <Annotation x="70%" y="20%" label="Zero-Latency Broadcast" />
                </div>
              </StepContent>

              {/* Step 6: Gatekeeper */}
              <StepContent active={Math.floor(step.get()) === 5}>
                <div className="h-full flex flex-col items-center justify-center p-12">
                  <div className="w-64 h-64 bg-white p-8 rounded-[4rem] relative overflow-hidden shadow-2xl border-[12px] border-black/5">
                    <div className="w-full h-full bg-black/5 flex items-center justify-center">
                      <Zap className="text-black/10 w-24 h-24" />
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
                    transition={{ delay: 0.5 }}
                    className="mt-12 bg-green-500/10 border border-green-500/20 px-12 py-6 rounded-full flex items-center gap-6 shadow-2xl"
                  >
                    <CheckCircle2 className="text-green-500 w-8 h-8" />
                    <div className="text-left">
                      <span className="text-[12px] font-black uppercase tracking-[0.4em] text-green-500 block">Access Granted</span>
                      <span className="text-[8px] font-bold uppercase tracking-widest text-green-500/60">Identity Verified</span>
                    </div>
                  </motion.div>
                  <Annotation x="50%" y="30%" label="Biometric-Grade Verification" />
                </div>
              </StepContent>

            </div>
          </div>
        </motion.div>

        {/* Floating Explainer Text (Narrator) */}
        <div className="absolute bottom-20 left-0 right-0 flex justify-center pointer-events-none">
          <div className="max-w-2xl w-full px-12">
            <AnimatePresence mode="wait">
              {steps.map((s, i) => Math.floor(step.get()) === i && (
                <motion.div 
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <span className="text-[#D4AF37] text-[10px] font-black tracking-[0.5em] uppercase mb-4 block">{s.label}</span>
                  <h3 className="text-4xl md:text-5xl font-serif italic text-white mb-4">{s.desc}</h3>
                  <p className="text-gray-500 text-lg font-light tracking-wide">{s.detail}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components for the Simulation
const StepContent = ({ active, children }: { active: boolean, children: React.ReactNode }) => (
  <AnimatePresence>
    {active && (
      <motion.div 
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="absolute inset-0"
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

const Annotation = ({ x, y, label }: { x: string, y: string, label: string }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.5 }}
    style={{ left: x, top: y }}
    className="absolute z-[60] flex flex-col items-center"
  >
    <div className="w-3 h-3 rounded-full bg-[#D4AF37] shadow-[0_0_15px_#D4AF37] mb-2 animate-pulse" />
    <div className="bg-black/80 backdrop-blur-md border border-[#D4AF37]/30 px-4 py-2 rounded-full whitespace-nowrap">
      <span className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">{label}</span>
    </div>
  </motion.div>
);

export default FeatureShowcase;