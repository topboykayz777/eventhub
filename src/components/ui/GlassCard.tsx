"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const GlassCard = ({ children, className, delay = 0 }: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "bg-[#1a1a1a]/40 backdrop-blur-md border border-white/5 rounded-none overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;