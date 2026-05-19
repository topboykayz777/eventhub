"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import InfoButton from './InfoButton';

interface BentoTileProps {
  children: React.ReactNode;
  title: string;
  infoText: string;
  className?: string;
  icon?: React.ReactNode;
}

const BentoTile = ({ children, title, infoText, className, icon }: BentoTileProps) => {
  return (
    <div className={cn(
      "glass-premium rounded-[2rem] border border-white/5 p-6 md:p-8 flex flex-col h-full group hover:border-[#D4AF37]/20 transition-all duration-500",
      className
    )}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          {icon && <div className="text-[#D4AF37] opacity-70 group-hover:opacity-100 transition-opacity">{icon}</div>}
          <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 group-hover:text-white transition-colors">
            {title}
          </h3>
        </div>
        <InfoButton text={infoText} />
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default BentoTile;