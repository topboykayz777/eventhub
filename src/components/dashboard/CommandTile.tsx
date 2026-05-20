"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import InfoButton from './InfoButton';

interface CommandTileProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
  variant?: 'gold' | 'silver' | 'green';
  className?: string;
  disabled?: boolean;
}

const CommandTile = ({ icon, label, description, onClick, variant = 'silver', className, disabled }: CommandTileProps) => {
  const variants = {
    gold: "border-[#D4AF37]/20 hover:border-[#D4AF37]/50 bg-[#D4AF37]/5",
    silver: "border-white/5 hover:border-white/20 bg-white/5",
    green: "border-[#25D366]/20 hover:border-[#25D366]/50 bg-[#25D366]/5",
  };

  const iconColors = {
    gold: "text-[#D4AF37]",
    silver: "text-gray-400",
    green: "text-[#25D366]",
  };

  return (
    <div className={cn(
      "relative group transition-all duration-500",
      className
    )}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "w-full h-32 md:h-40 rounded-[2rem] border flex flex-col items-center justify-center gap-4 transition-all duration-500",
          variants[variant],
          disabled && "opacity-50 cursor-not-allowed grayscale"
        )}
      >
        <div className={cn("transition-transform duration-500 group-hover:scale-110", iconColors[variant])}>
          {icon}
        </div>
        <span className={cn("text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] transition-colors", 
          variant === 'gold' ? 'text-white' : 'text-gray-400 group-hover:text-white'
        )}>
          {label}
        </span>
      </button>
      
      <div className="absolute top-4 right-4">
        <InfoButton text={description} />
      </div>
    </div>
  );
};

export default CommandTile;