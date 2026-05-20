"use client";

import React from 'react';
import { Info } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

interface InfoButtonProps {
  text: string;
}

const InfoButton = ({ text }: InfoButtonProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button 
          type="button" 
          className="inline-flex items-center justify-center ml-2 text-muted-foreground hover:text-[#D4AF37] transition-all hover:scale-110 focus:outline-none"
        >
          <Info size={14} className="opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="bg-popover border-border text-foreground text-[11px] font-medium leading-relaxed p-4 max-w-[240px] shadow-2xl rounded-2xl z-[200] animate-in fade-in zoom-in-95 duration-200"
        side="top"
        align="center"
      >
        {text}
      </PopoverContent>
    </Popover>
  );
};

export default InfoButton;