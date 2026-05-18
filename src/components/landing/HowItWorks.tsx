"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Share2, Monitor, Wallet, PlayCircle, ArrowUpRight } from 'lucide-react';

const steps = [
  {
    title: "The Architecture",
    desc: "Design your event's digital identity. Choose from twenty bespoke themes and upload your cover portrait in 4K resolution.",
    icon: Sparkles,
    video: "https://player.vimeo.com/external/494252666.sd.mp4?s=7a070905e94be8122d2568a5d3f9429188059082&profile_id=165&oauth2_token_id=57447761",
    colSpan: "lg:col-span-7",
    step: "01"
  },
  {
    title: "The Dispatch",
    desc: "Generate your unique link. Share instantly via WhatsApp to start gathering RSVPs in your secure vault.",
    icon: Share2,
    video: "https://player.vimeo.com/external/459389137.sd.mp4?s=984e930501865383569808d4b3b3a620b784a0d9&profile_id=165&oauth2_token_id=57447761",
    colSpan: "lg:col-span-5",
    step: "02"
  },
  {
    title: "The Ledger",
    desc: "Monitor financial gifts in real-time. Approve digital sprays and watch them explode onto the stage.",
    icon: Wallet,
    video: "https://player.vimeo.com/external/394334316.sd.mp4?s=554c2579069d2d94892c571f54a8e0a133866299&profile_id=165&oauth2_token_id=57447761",
    colSpan: "lg:col-span-5",
    step: "03"
  },
  {
    title: "The Vibe Screen",
    desc: "Connect to any display. Watch as guest check-ins and sprays create a live cinematic experience for the room.",
    icon: Monitor,
    video: "https://player.vimeo.com/external/435160492.sd.mp4?s=48421888b142475e840d2f094582f347d4833215&profile_id=165&oauth2_token_id=57447761",
    colSpan: "lg:col-span-7",
    step: "04"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 md:py-48 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 md:mb-32 gap-8">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-[#D4AF37] text-[10px] font-black tracking-[0.6em] uppercase mb-6 block"
            >
              The Methodology
            </motion.span>
            <h2 className="text-4xl md:text-8xl font-serif italic text-white leading-[0.9] tracking-tighter">
              The Art of <br /> <span className="text-[#D4AF37]">Orchestration</span>
            </h2>
          </div>
          <p className="text-gray-500 text-sm md:text-base font-light tracking-wide max-w-xs md:text-right leading-relaxed">
            Four pillars of digital management designed for the modern high-society host.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {steps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className={`${item.colSpan} group relative min-h-[400px] md:min-h-[500px] rounded-[3rem] overflow-hidden border border-white/5 bg-white/[0.02] hover:border-[#D4AF37]/30 transition-all duration-700`}
            >
              {/* Video Background */}
              <div className="absolute inset-0 z-0">
                <video 
                  src={item.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover grayscale brightness-[0.3] group-hover:grayscale-0 group-hover:scale-110 group-hover:brightness-[0.4] transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              </div>

              {/* Content Overlay */}
              <div className="relative z-10 h-full p-10 md:p-14 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-black transition-all duration-500">
                    <item.icon size={24} />
                  </div>
                  <span className="text-[40px] font-serif italic text-white/10 group-hover:text-[#D4AF37]/20 transition-colors duration-500 leading-none select-none">
                    {item.step}
                  </span>
                </div>

                <div className="max-w-md">
                  <h3 className="text-3xl md:text-4xl font-serif italic text-white mb-4 group-hover:text-[#D4AF37] transition-colors duration-500">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <ArrowUpRight className="text-[#D4AF37] w-6 h-6" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/5 border border-white/10 rounded-full group cursor-pointer hover:border-[#D4AF37]/50 transition-all">
            <PlayCircle className="text-[#D4AF37] group-hover:scale-110 transition-transform" size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Watch Masterclass Trailer</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;