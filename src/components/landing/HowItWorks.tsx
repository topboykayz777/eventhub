"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Share2, Monitor, Wallet, PlayCircle, ChevronRight } from 'lucide-react';

const steps = [
  {
    title: "The Architecture",
    desc: "Design your event's digital identity. Choose from twenty bespoke themes and upload your cover portrait in 4K resolution.",
    icon: Sparkles,
    video: "https://player.vimeo.com/external/494252666.sd.mp4?s=7a070905e94be8122d2568a5d3f9429188059082&profile_id=165&oauth2_token_id=57447761",
    label: "Step 01"
  },
  {
    title: "The Dispatch",
    desc: "Generate your unique orchestration link. Share it instantly via WhatsApp to start gathering RSVPs in your secure vault.",
    icon: Share2,
    video: "https://player.vimeo.com/external/459389137.sd.mp4?s=984e930501865383569808d4b3b3a620b784a0d9&profile_id=165&oauth2_token_id=57447761",
    label: "Step 02"
  },
  {
    title: "The Digital Spray",
    desc: "Monitor your financial ledger in real-time. Approve digital gifts and watch them explode onto the main screen.",
    icon: Wallet,
    video: "https://player.vimeo.com/external/394334316.sd.mp4?s=554c2579069d2d94892c571f54a8e0a133866299&profile_id=165&oauth2_token_id=57447761",
    label: "Step 03"
  },
  {
    title: "The Vibe Screen",
    desc: "Connect your command center to any display. Watch as guest check-ins and sprays create a live cinematic experience.",
    icon: Monitor,
    video: "https://player.vimeo.com/external/435160492.sd.mp4?s=48421888b142475e840d2f094582f347d4833215&profile_id=165&oauth2_token_id=57447761",
    label: "Step 04"
  }
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-24 md:py-40 bg-[#050505] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          
          {/* Left Side: Content */}
          <div className="w-full lg:w-1/2 space-y-12">
            <div>
              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-[#D4AF37] text-[10px] font-black tracking-[0.5em] uppercase mb-4 block"
              >
                The Methodology
              </motion.span>
              <h2 className="text-4xl md:text-6xl font-serif italic text-white leading-tight">
                How to <br /> <span className="text-[#D4AF37]">Orchestrate</span>
              </h2>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  onMouseEnter={() => setActiveStep(index)}
                  onClick={() => setActiveStep(index)}
                  className={`group cursor-pointer p-8 transition-all duration-500 border-l-2 ${
                    activeStep === index 
                      ? 'border-[#D4AF37] bg-white/[0.03]' 
                      : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[8px] font-black uppercase tracking-widest ${
                      activeStep === index ? 'text-[#D4AF37]' : 'text-gray-600'
                    }`}>
                      {step.label}
                    </span>
                    <step.icon size={16} className={activeStep === index ? 'text-[#D4AF37]' : 'text-gray-700'} />
                  </div>
                  <h3 className={`text-xl md:text-2xl font-serif italic mb-2 transition-colors ${
                    activeStep === index ? 'text-white' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </h3>
                  <AnimatePresence>
                    {activeStep === index && (
                      <motion.p 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="text-sm md:text-base text-gray-400 font-light leading-relaxed overflow-hidden"
                      >
                        {step.desc}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Cinematic Viewport */}
          <div className="w-full lg:w-1/2 relative">
            <div className="aspect-[4/5] md:aspect-square relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0"
                >
                  <video 
                    src={steps[activeStep].video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover grayscale brightness-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
                  
                  {/* Floating UI Mockup over video */}
                  <div className="absolute inset-0 flex items-center justify-center p-12">
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="w-full h-full border border-white/20 bg-white/5 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-center p-8"
                    >
                      <PlayCircle className="text-[#D4AF37] w-12 h-12 mb-6 opacity-50" />
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Visual Representation</p>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Viewport Frame Accents */}
              <div className="absolute top-8 left-8 w-12 h-px bg-[#D4AF37]/50" />
              <div className="absolute top-8 left-8 w-px h-12 bg-[#D4AF37]/50" />
              <div className="absolute bottom-8 right-8 w-12 h-px bg-[#D4AF37]/50" />
              <div className="absolute bottom-8 right-8 w-px h-12 bg-[#D4AF37]/50" />
            </div>

            {/* Floating Label */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 hidden lg:block bg-[#D4AF37] text-black p-10 rounded-full shadow-2xl"
            >
              <div className="text-[10px] font-black uppercase tracking-widest leading-none">Live<br />Demo</div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorks;