"use client";

import React from 'react';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InfoButtonProps {
  text: string;
}

const InfoButton = ({ text }: InfoButtonProps) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all">
            <Info size={12} />
          </button>
        </TooltipTrigger>
        <TooltipContent className="bg-[#1a1a1a] border border-[#D4AF37]/30 text-white p-4 max-w-[200px] rounded-xl shadow-2xl">
          <p className="text-[10px] font-medium leading-relaxed tracking-wide">
            {text}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InfoButton;