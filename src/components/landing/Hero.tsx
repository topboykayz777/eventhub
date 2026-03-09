"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#1a1a2e] pt-20 pb-32 px-6">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [-50, 50, -50],
            y: [-20, 20, -20]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#e94560]/20 blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            x: [50, -50, 50],
            y: [20, -20, 20]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#0f3460]/40 blur-[120px]"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#e94560] text-sm font-bold mb-8 backdrop-blur-md">
            <Sparkles size={16} />
            <span>The #1 Digital Invite Platform in Nigeria</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter">
            CELEBRATE YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e94560] via-[#ff6b6b] to-[#e94560] animate-gradient-x">
              OWAMBE
            </span> <br />
            DIGITALLY
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Create stunning event pages, manage RSVPs in real-time, and share the joy instantly on WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/create-event">
              <Button size="lg" className="bg-[#e94560] hover:bg-[#d43d56] text-white text-xl px-10 py-8 rounded-2xl shadow-[0_0_40px_rgba(233,69,96,0.3)] transform transition hover:scale-105 font-bold">
                Start Creating Free
              </Button>
            </Link>
            <Link to="/vendors">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 text-xl px-10 py-8 rounded-2xl backdrop-blur-md font-bold">
                Find Vendors
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Floating Elements Simulation */}
        <div className="mt-20 relative max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative rounded-[2.5rem] overflow-hidden border-8 border-white/5 shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80" 
              alt="Event Preview" 
              className="w-full h-auto opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-transparent to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;