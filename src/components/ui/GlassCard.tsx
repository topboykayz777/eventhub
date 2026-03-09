"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

const GlassCard = ({ children, className, delay = 0, hover = true }: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      whileHover={hover ? { y: -5, transition: { duration: 0.3 } } : {}}
      className={cn(
        "bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden transition-all duration-500",
        hover && "hover:border-[#D4AF37]/30 hover:shadow-[0_20px_50px_rgba(212,175,55,0.1)]",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;