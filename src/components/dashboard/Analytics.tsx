"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalyticsProps {
  rsvps: any[];
}

const Analytics = ({ rsvps }: AnalyticsProps) => {
  const getChartData = () => {
    const groups = rsvps.reduce((acc: any, r: any) => {
      const date = new Date(r.created_at).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(groups).map(([date, count]) => ({ date, count }));
  };

  return (
    <div className="h-[400px] w-full bg-white/5 p-10 border border-white/5">
      <div className="flex justify-between items-center mb-10">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">RSVP Velocity</span>
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">Real-time Data</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={getChartData()}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#333" 
            fontSize={8} 
            tickLine={false} 
            axisLine={false}
            tick={{ fill: '#666', fontWeight: 'bold' }}
          />
          <YAxis 
            stroke="#333" 
            fontSize={8} 
            tickLine={false} 
            axisLine={false}
            tick={{ fill: '#666', fontWeight: 'bold' }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '0px' }}
            itemStyle={{ color: '#D4AF37', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
          />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#D4AF37" 
            strokeWidth={2} 
            dot={{ fill: '#D4AF37', r: 4 }} 
            activeDot={{ r: 6, stroke: '#000', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Analytics;