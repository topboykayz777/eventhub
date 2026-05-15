"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface VibeStatsProps {
  stats: {
    checkedIn: number;
    totalSprayed: number;
  };
  config: any;
}

const VibeStats = ({ stats, config }: VibeStatsProps) => {
  const isDark = config.dark !== false;

  return (
    <div className="flex gap-20">
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-right"
      >
        <p className={`text-sm font-bold uppercase tracking-[0.4em] opacity-40 mb-2 ${isDark ? 'text-white' : 'text-black'}`}>Verified Guests</p>
        <p className="text-5xl lg:text-7xl font-serif italic">{stats.checkedIn}</p>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="text-right"
      >
        <p className={`text-sm font-bold uppercase tracking-[0.4em] opacity-40 mb-2 ${isDark ? 'text-white' : 'text-black'}`}>Digital Sprays</p>
        <p className={`${config.accent} text-5xl lg:text-7xl font-serif italic`}>₦{stats.totalSprayed.toLocaleString()}</p>
      </motion.div>
    </div>
  );
};

export default VibeStats;