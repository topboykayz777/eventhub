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
    <div className="grid grid-cols-2 gap-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-black/5'}`}
      >
        <p className={`text-[7px] font-black uppercase tracking-widest opacity-40 mb-1 ${isDark ? 'text-white' : 'text-black'}`}>Guests</p>
        <p className="text-2xl font-serif italic">{stats.checkedIn}</p>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-black/5'}`}
      >
        <p className={`text-[7px] font-black uppercase tracking-widest opacity-40 mb-1 ${isDark ? 'text-white' : 'text-black'}`}>Sprays</p>
        <p className={`${config.accent} text-2xl font-serif italic`}>₦{stats.totalSprayed.toLocaleString()}</p>
      </motion.div>
    </div>
  );
};

export default VibeStats;