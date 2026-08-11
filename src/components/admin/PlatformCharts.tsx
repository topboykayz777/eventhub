"use client";

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';

interface ChartDataItem {
  month: string;
  events: number;
  sprays: number;
}

interface PlatformChartsProps {
  chartData: ChartDataItem[];
}

const PlatformCharts = ({ chartData }: PlatformChartsProps) => {
  if (chartData.length === 0) return null;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-card border border-border p-8 rounded-[3rem] shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Event Creation Pace</span>
          <BarChart3 className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis dataKey="month" stroke="#888888" fontSize={10} tickLine={false} />
              <YAxis stroke="#888888" fontSize={10} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                itemStyle={{ color: '#D4AF37', fontSize: '12px' }}
              />
              <Bar dataKey="events" fill="#D4AF37" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border border-border p-8 rounded-[3rem] shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Digital Spraying Volume</span>
          <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis dataKey="month" stroke="#888888" fontSize={10} tickLine={false} />
              <YAxis stroke="#888888" fontSize={10} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                itemStyle={{ color: '#D4AF37', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="sprays" stroke="#D4AF37" fill="#D4AF3720" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PlatformCharts;