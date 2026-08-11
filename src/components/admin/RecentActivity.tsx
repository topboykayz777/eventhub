"use client";

import React from 'react';
import { Coins, Users } from 'lucide-react';

interface BudgetItem {
  id: string;
  description: string;
  amount: number | null;
  status: string;
  created_at: string;
}

interface Rsvp {
  id: string;
  guest_name: string;
  guest_phone: string;
  checked_in: boolean;
}

interface RecentActivityProps {
  recentSprays: BudgetItem[];
  recentRSVPs: Rsvp[];
}

const RecentActivity = ({ recentSprays, recentRSVPs }: RecentActivityProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Recent Digital Sprays */}
      <div className="bg-card border border-border rounded-[3rem] p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Coins className="text-[#D4AF37] w-5 h-5" />
          <h3 className="text-xl font-serif italic">Recent Digital Sprays</h3>
        </div>

        <div className="space-y-3">
          {recentSprays.map((item) => (
            <div key={item.id} className="p-4 rounded-2xl bg-secondary/50 border border-border flex justify-between items-center text-xs">
              <div>
                <p className="font-serif italic text-sm text-foreground">{item.description}</p>
                <p className="text-[9px] text-muted-foreground uppercase">{new Date(item.created_at).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="font-serif italic text-base text-[#D4AF37]">₦{item.amount?.toLocaleString()}</p>
                <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full ${
                  item.status === 'approved' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}

          {recentSprays.length === 0 && (
            <p className="text-center text-xs text-muted-foreground italic py-8">No spray transfers recorded yet.</p>
          )}
        </div>
      </div>

      {/* Recent RSVPs */}
      <div className="bg-card border border-border rounded-[3rem] p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Users className="text-[#D4AF37] w-5 h-5" />
          <h3 className="text-xl font-serif italic">Recent Guest RSVPs</h3>
        </div>

        <div className="space-y-3">
          {recentRSVPs.map((item) => (
            <div key={item.id} className="p-4 rounded-2xl bg-secondary/50 border border-border flex justify-between items-center text-xs">
              <div>
                <p className="font-serif italic text-sm text-foreground">{item.guest_name}</p>
                <p className="text-[9px] text-muted-foreground">{item.guest_phone}</p>
              </div>
              <div className="text-right">
                <span className={`text-[7px] font-black uppercase px-2.5 py-1 rounded-full ${
                  item.checked_in ? 'bg-green-500/10 text-green-500' : 'bg-secondary text-muted-foreground'
                }`}>
                  {item.checked_in ? 'Checked In' : 'RSVP Confirmed'}
                </span>
              </div>
            </div>
          ))}

          {recentRSVPs.length === 0 && (
            <p className="text-center text-xs text-muted-foreground italic py-8">No guest RSVPs registered yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;