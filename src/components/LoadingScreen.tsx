"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const facts = [
  "Did you know? You can scan guest QR codes directly from your phone's browser.",
  "Did you know? Pro users can send mass WhatsApp messages to their entire guest list.",
  "Did you know? You can assign table numbers to guests to organize your seating plan.",
  "Did you know? Your event page stays active for 5 days after the party ends.",
  "Did you know? Guests can leave 'Digital Toasts' that you can choose to show live.",
  "Did you know? You can export your guest list to CSV for your caterers and security.",
  "Did you know? The 'Vibe List' lets you export all guest song requests for your DJ.",
  "Did you know? You can now receive cash gifts directly through your event page!",
  "Did you know? Every digital gift is automatically recorded in your Financial Ledger."
];

const LoadingScreen = () => {
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    // Pick a random starting fact
    setFactIndex(Math.floor(Math.random() * facts.length));
    
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % facts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] bg-[#050505] flex flex-col items-center justify-center p-8"
    >
      <div className="relative mb-12">
        <div className="w-20 h-20 border border-[#D4AF37] flex items-center justify-center rotate-45 animate-pulse">
          <span className="text-[#D4AF37] font-serif text-4xl -rotate-45">E</span>
        </div>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-4 border border-[#D4AF37]/20 rounded-full border-dashed"
        />
      </div>

      <div className="max-w-md text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={factIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] leading-relaxed"
          >
            {facts[factIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <div className="w-48 h-px bg-white/5 relative overflow-hidden">
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;