"use client";

import React from 'react';
import { Users } from 'lucide-react';

interface CurrentlyOnlineProps {
  count: number;
  users: Array<{ id: string; full_name?: string; email?: string; last_seen_at: string }>;
}

const CurrentlyOnline = ({ count, users }: CurrentlyOnlineProps) => {
  return (
    <div className="p-8 bg-card border border-border rounded-[2.5rem] shadow-sm space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Currently Online</span>
        <Users className="w-4 h-4 text-[#D4AF37]" />
      </div>
      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
        Guests active in last 5 minutes
      </p>
      <p className="text-3xl md:text-4xl font-serif italic text-foreground">
        {count}
      </p>
      {users.length > 0 && (
        <div className="mt-2 space-y-1 text-sm">
          {users.map((user) => (
            <div key={user.id} className="flex items-center gap-2">
              <div className="w-3 h-3 text-[#D4AF37]/50" />
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground truncate max-w-[100px]">
                {user.full_name || user.email?.split('@')[0] || 'Guest'}
              </span>
              <span className="text-[7px] text-muted-foreground">
                {(Date.now() - new Date(user.last_seen_at).getTime()) / 60000 < 1 
                  ? 'just now' 
                  : `${Math.floor((Date.now() - new Date(user.last_seen_at).getTime()) / 60000)}m ago`
                }
              </span>
            }
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrentlyOnline;