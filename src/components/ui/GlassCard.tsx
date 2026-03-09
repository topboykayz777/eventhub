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
      transition={{ delay, duration: 0.5 }}
      className={cn(
        "bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] overflow-hidden shadow-2xl",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;