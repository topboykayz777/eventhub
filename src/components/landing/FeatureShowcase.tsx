"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Wallet, ShieldCheck, CheckCircle2, 
  Share2, Users, Megaphone, 
  Table as TableIcon, Zap, Send, Plus, Minus,
  MousePointer2, Smartphone, BarChart3, ArrowRight,
  CreditCard, Lock, Check
} from 'lucide-react';

const FeatureShowcase = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Map scroll progress to steps (0 to 5)
  const step = useTransform(scrollYProgress, [0, 0.15, 0.35, 0.55, 0.75, 0.95], [0, 1, 2, 3, 4, 5]);
  
  // We'll use a state-like approach with the transform to trigger specific UI changes
  const [activeStep, setActiveStep] = React.useState(0);
  
  React.useEffect(() => {
    return step.onChange(v => setActiveStep(Math.floor(v)));
  }, [step]);

  return (
    <section ref={containerRef} className="relative h-[600vh] bg-[#050505]">
      {/* Sticky Simulation Container */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Background Ambient Glows */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            animate={{ 
              opacity: [0.1, 0.2, 0.1],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#D4AF37]/10 blur-[150px] rounded-full" 
          />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 blur-[150px] rounded-full" />
        </div>

        <div className="max-w-7xl w-full px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          
          {/* Left Side: The Narrative */}
          <div className="space-y-12">
            <div className="space-y-6">
              <motion.span 
                key={`label-${activeStep}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase block"
              >
                {activeStep === 0 && "Phase I: The Genesis"}
                {activeStep === 1 && "Phase II: The Activation"}
                {activeStep === 2 && "Phase III: The Command Center"}
                {activeStep === 3 && "Phase IV: The Guest Experience"}
                {activeStep === 4 && "Phase V: The Financial Suite"}
                {activeStep === 5 && "Phase VI: The Gatekeeper"}
              </motion.span>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={`title-${activeStep}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-5xl md:text-7xl font-serif italic text-white leading-tight">
                    {activeStep === 0 && <>Design Your <span className="text-[#D4AF37]">Legacy</span></>}
                    {activeStep === 1 && <>Secure Your <span className="text-[#D4AF37]">Presence</span></>}
                    {activeStep === 2 && <>Real-time <span className="text-[#D4AF37]">Orchestration</span></>}
                    {activeStep === 3 && <>The Elite <span className="text-[#D4AF37]">Pass</span></>}
                    {activeStep === 4 && <>The Master <span className="text-[#D4AF37]">Ledger</span></>}
                    {activeStep === 5 && <>Seamless <span className="text-[#D4AF37]">Access</span></>}
                  </h2>
                  <p className="text-gray-500 text-lg font-light leading-relaxed max-w-md">
                    {activeStep === 0 && "Start by crafting a bespoke digital invitation. Choose themes that reflect your heritage and style."}
                    {activeStep === 1 && "Activate your event with a single secure payment. Your masterpiece goes live across the globe instantly."}
                    {activeStep === 2 && "Monitor RSVPs as they stream in. Send live broadcasts to every guest's device simultaneously."}
                    {activeStep === 3 && "Guests receive high-definition entry passes. Our 'Memory' system recognizes them every time they return."}
                    {activeStep === 4 && "Track every naira with precision. Manage vendors, expenses, and income in one elegant financial suite."}
                    {activeStep === 5 && "Verify identities at the door with our integrated QR engine. Ensure a secure and exclusive atmosphere."}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress Indicators */}
            <div className="flex gap-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i}
                  className={`h-1 rounded-full transition-all duration-700 ${
                    i <= activeStep ? 'w-12 bg-[#D4AF37]' : 'w-6 bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Side: The Live Simulation */}
          <div className="relative aspect-square lg:aspect-auto lg:h-[700px] w-full">
            <div className="absolute inset-0 bg-white/[0.02] border border-white/5 rounded-[3rem] md:rounded-[5rem] overflow-hidden shadow-2xl backdrop-blur-3xl">
              
              <AnimatePresence mode="wait">
                
                {/* SCENE 0: CREATION */}
                {activeStep === 0 && (
                  <motion.div 
                    key="scene-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full w-full p-12 flex flex-col"
                  >
                    <div className="flex justify-between items-center mb-12">
                      <div className="h-2 w-24 bg-white/10 rounded-full" />
                      <Sparkles className="text-[#D4AF37] w-6 h-6" />
                    </div>
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <div className="h-2 w-20 bg-gray-600 rounded-full" />
                        <div className="h-16 bg-white/5 border border-white/10 rounded-none flex items-center px-6 relative">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2, delay: 0.5 }}
                            className="h-4 bg-[#D4AF37]/20 rounded-sm"
                          />
                          <motion.div 
                            animate={{ x: [0, 200, 150], y: [0, 0, 0] }}
                            transition={{ duration: 2 }}
                            className="absolute left-4"
                          >
                            <MousePointer2 size={24} className="text-[#D4AF37] fill-[#D4AF37] drop-shadow-2xl" />
                          </motion.div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="h-32 bg-white/5 border border-[#D4AF37]/30 rounded-none relative overflow-hidden">
                          <div className="absolute inset-0 bg-[#D4AF37]/5" />
                          <div className="absolute bottom-4 left-4 h-1.5 w-12 bg-[#D4AF37] rounded-full" />
                        </div>
                        <div className="h-32 bg-white/5 border border-white/10 rounded-none" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SCENE 1: ACTIVATION */}
                {activeStep === 1 && (
                  <motion.div 
                    key="scene-1"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="h-full w-full flex items-center justify-center p-12"
                  >
                    <div className="w-full max-w-sm bg-white p-10 rounded-[3rem] shadow-2xl text-black">
                      <div className="flex justify-between items-center mb-10">
                        <CreditCard size={24} />
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
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-black text-white py-6 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3"
                      >
                        <Lock size={14} /> Pay ₦15,000
                      </motion.button>
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5 }}
                        className="mt-8 flex items-center justify-center gap-3 text-green-600"
                      >
                        <CheckCircle2 size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Success</span>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* SCENE 2: DASHBOARD */}
                {activeStep === 2 && (
                  <motion.div 
                    key="scene-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full w-full p-12 flex flex-col"
                  >
                    <div className="flex justify-between items-end mb-16">
                      <div className="space-y-4">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">Live RSVPs</p>
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
                      className="bg-[#D4AF37] p-6 rounded-2xl text-black flex items-center gap-6 shadow-2xl"
                    >
                      <Megaphone className="animate-bounce" />
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-widest mb-1">Global Broadcast</p>
                        <p className="text-sm font-serif italic">"The Buffet is now open!"</p>
                      </div>
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

                {/* SCENE 3: GUEST EXPERIENCE */}
                {activeStep === 3 && (
                  <motion.div 
                    key="scene-3"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-full w-full flex items-center justify-center p-12"
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

                {/* SCENE 4: LEDGER */}
                {activeStep === 4 && (
                  <motion.div 
                    key="scene-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full w-full p-12 flex flex-col"
                  >
                    <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 mb-12 relative overflow-hidden">
                      <div className="relative z-10">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] mb-4">Event Balance</p>
                        <p className="text-6xl font-serif italic text-white">₦2,840,000</p>
                        <div className="mt-10 h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "65%" }}
                            className="h-full gold-gradient"
                          />
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/5 blur-[100px] rounded-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-green-500/5 p-8 border border-green-500/10 rounded-3xl">
                        <Plus className="text-green-500 mb-4" />
                        <p className="text-2xl font-serif italic">₦4.2M</p>
                      </div>
                      <div className="bg-red-500/5 p-8 border border-red-500/10 rounded-3xl">
                        <Minus className="text-red-500 mb-4" />
                        <p className="text-2xl font-serif italic">₦1.4M</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SCENE 5: GATEKEEPER */}
                {activeStep === 5 && (
                  <motion.div 
                    key="scene-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full w-full flex flex-col items-center justify-center p-12"
                  >
                    <div className="w-64 h-64 bg-white p-6 rounded-[3rem] relative overflow-hidden shadow-2xl border-8 border-black/5">
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
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === activeStep ? 'bg-[#D4AF37]' : 'bg-white/10'}`} />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll Triggers (Invisible spacers to drive the scroll progress) */}
      <div className="h-screen" /> {/* Step 0 */}
      <div className="h-screen" /> {/* Step 1 */}
      <div className="h-screen" /> {/* Step 2 */}
      <div className="h-screen" /> {/* Step 3 */}
      <div className="h-screen" /> {/* Step 4 */}
      <div className="h-screen" /> {/* Step 5 */}
    </section>
  );
};

export default FeatureShowcase;