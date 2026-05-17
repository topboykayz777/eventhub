"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Gift } from "lucide-react";

interface SprayAnimationProps {
  isVisible: boolean;
  guestName: string;
  amount: number;
  onComplete: () => void;
}

const SprayAnimation = ({ isVisible, guestName, amount, onComplete }: SprayAnimationProps) => {
  useEffect(() => {
    if (!isVisible) return;

    const confettiTimer = setTimeout(() => {
      const colors = ["#D4AF37", "#ffffff", "#F9E4B7"];
      confetti({
        particleCount: 350,
        spread: 180,
        origin: { y: 0.6 },
        colors,
        scalar: 1.8,
      });
      setTimeout(() => {
        confetti({
          particleCount: 250,
          spread: 140,
          origin: { y: 0.4, x: 0.25 },
          colors,
          scalar: 1.4,
        });
        confetti({
          particleCount: 250,
          spread: 140,
          origin: { y: 0.4, x: 0.75 },
          colors,
          scalar: 1.4,
        });
      }, 400);
    }, 1200);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => {
      clearTimeout(confettiTimer);
      clearTimeout(completeTimer);
    };
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
        >
          {/* Darkened backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Gift‑box */}
          <motion.div
            initial={{ scale: 0, y: 120 }}
            animate={{
              scale: [0, 1.3, 0.9, 1.1, 1],
              y: [120, -20, 10, -5, 0],
              rotate: [0, -8, 8, -8, 0],
            }}
            transition={{
              duration: 1.2,
              times: [0, 0.3, 0.5, 0.7, 1],
              ease: "easeOut",
            }}
            className="relative z-10 max-w-md w-full mx-6"
          >
            <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] border-2 border-[#D4AF37]/30 p-12 text-center shadow-[0_0_100px_rgba(212,175,55,0.3)]">
              {/* Gift icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ repeat: 3, duration: 0.6, ease: "easeInOut" }}
                className="w-20 h-20 rounded-full bg-[#D4AF37] flex items-center justify-center mx-auto mb-8 shadow-2xl"
              >
                <Gift className="w-10 h-10 text-black" />
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37] mb-4">
                  Digital Spray Received
                </p>
                <h2 className="text-4xl md:text-5xl font-serif italic text-[#D4AF37] drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">
                  {guestName}
                </h2>
                <p className="text-5xl md:text-7xl font-serif italic text-[#D4AF37]">
                  ₦{amount.toLocaleString()}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SprayAnimation;