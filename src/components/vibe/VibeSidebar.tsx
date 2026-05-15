"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Coins, MessageSquare } from 'lucide-react';

interface Activity {
  id: string;
  type: 'spray' | 'checkin' | 'message';
  title: string;
  detail: string;
  amount?: number;
  timestamp: number;
}

interface VibeSidebarProps {
  activities: Activity[];
  config: any;
}

const VibeSidebar = ({ activities, config }: VibeSidebarProps) => {
  const isDark = config.dark !== false;

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className={`text-[8px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Live Activity
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 flex flex-col gap-3">
          <AnimatePresence initial={false} mode="popLayout">
            {activities.map((activity) => (
              <motion.div
                key={activity.id}
                layout
                initial={{ opacity: 0, x: 30, filter: "blur(5px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={`p-4 rounded-2xl border ${
                  activity.type === 'spray' 
                    ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30' 
                    : isDark ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    activity.type === 'spray' ? 'bg-[#D4AF37] text-black' : 
                    activity.type === 'checkin' ? 'bg-green-500/20 text-green-500' : 'bg-white/10 text-[#D4AF37]'
                  }`}>
                    {activity.type === 'spray' ? <Coins size={14} /> : 
                     activity.type === 'checkin' ? <UserCheck size={14} /> : <MessageSquare size={14} />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-[7px] font-black uppercase tracking-widest mb-0.5 ${
                      activity.type === 'spray' ? 'text-[#D4AF37]' : 'opacity-40'
                    }`}>
                      {activity.title}
                    </p>
                    <h4 className={`text-sm font-serif italic truncate ${isDark ? 'text-white' : 'text-black'}`}>
                      {activity.detail}
                    </h4>
                    {activity.amount && (
                      <p className="text-lg font-serif italic text-[#D4AF37] mt-0.5">
                        ₦{activity.amount.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        <div className={`absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t ${
          isDark ? `from-${config.bg.replace('bg-[', '').replace(']', '')} to-transparent` : 'from-white to-transparent'
        } pointer-events-none`} />
      </div>
    </div>
  );
};

export default VibeSidebar;