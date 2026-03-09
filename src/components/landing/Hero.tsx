"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, PartyPopper, Music, Camera } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0a0a1a] pt-20 pb-32 px-6">
      {/* Dynamic Moving Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#e94560]/30 blur-[120px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#4ecca3]/20 blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-[#6366f1]/20 blur-[120px] animate-blob animation-delay-4000" />
      </div>

      {/* Floating Icons */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-40 left-[10%] text-[#e94560] opacity-50 hidden lg:block"
      >
        <PartyPopper size={48} />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute bottom-40 right-[15%] text-[#4ecca3] opacity-50 hidden lg:block"
      >
        <Music size={48} />
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 border border-white/20 text-[#e94560] text-sm font-black mb-8 backdrop-blur-xl animate-pulse">
            <Sparkles size={16} />
            <span>NIGERIA'S PREMIER EVENT HUB</span>
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black text-white mb-8 leading-[0.85] tracking-tighter">
            YOUR EVENT, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e94560] via-[#ff6b6b] to-[#4ecca3] bg-[length:200%_auto] animate-gradient-x">
              REIMAGINED
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            The ultimate digital companion for Owambes, Weddings, and Birthdays. 
            Create, manage, and celebrate with style.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/create-event">
              <Button size="lg" className="bg-[#e94560] hover:bg-[#d43d56] text-white text-xl px-12 py-8 rounded-2xl shadow-[0_0_50px_rgba(233,69,96,0.4)] transform transition hover:scale-110 font-black">
                CREATE EVENT NOW
              </Button>
            </Link>
            <Link to="/vendors">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-xl px-12 py-8 rounded-2xl backdrop-blur-md font-black">
                EXPLORE VENDORS
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Floating Preview Cards */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80", delay: 0 },
            { img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80", delay: 0.2 },
            { img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80", delay: 0.4 }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: item.delay, duration: 0.8 }}
              className={`relative rounded-[2rem] overflow-hidden border-4 border-white/10 shadow-2xl ${i === 1 ? 'md:-translate-y-12' : 'md:translate-y-4'} animate-float`}
              style={{ animationDelay: `${i * 1.5}s` }}
            >
              <img src={item.img} alt="Event" className="w-full h-64 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;