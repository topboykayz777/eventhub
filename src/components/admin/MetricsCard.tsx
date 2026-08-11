"use client";

import React from 'react';
import { Calendar, Users, Coins, Building2 } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  subtext?: string;
  color?: string; // e.g., 'text-green-500'
}

const MetricsCard = ({ title, value, icon, subtext, color }: MetricsCardProps) => {
  return (
    <div className="p-8 bg-card border border-border rounded-[2.5rem] shadow-sm space-y-2">
      <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center mb-4">
        <icon className="text-[#D4AF37] w-5 h-5" />
      </div>
      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{title}</p>
      <p className="text-3xl md:text-4xl font-serif italic text-foreground">{value}</p>
      {subtext && (
        <span className={`text-[8px] font-bold uppercase ${color || 'text-green-500'} tracking-wider`}>
          {subtext}
        </span>
      )}
    </div>
  );
};

export default MetricsCard;