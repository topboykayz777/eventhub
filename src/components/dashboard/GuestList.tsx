"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showSuccess, showError } from "@/utils/toast";
import { Search, Upload, FileDown } from "lucide-react";

interface GuestListProps {
  rsvps: any[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenScanner: () => void;
  onExportCSV: () => void;
  onToggleCheckIn: (id: string, checked: boolean) => void;
  onUpdate: () => Promise<void>;
}

const GuestList = ({
  rsvps,
  searchQuery,
  onSearchChange,
  onOpenScanner,
  onExportCSV,
  onUpdate,
}: GuestListProps) => {
  const [checkingIn, setCheckingIn] = useState<string | null>(null);

  const handleToggleCheckIn = async (id: string, currentStatus: boolean) => {
    setCheckingIn(id);
    try {
      const response = await fetch(`/api/rsvps/${id}/checkin`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checked_in: !currentStatus }),
      });
      
      if (!response.ok) throw new Error("Failed to update status");
      
      await onUpdate();
      showSuccess("Check-in status updated.");
    } catch (err: any) {
      showError(err.message || "Failed to update check-in status.");
    } finally {
      setCheckingIn(null);
    }
  };

  const filteredRsvps = rsvps.filter((r) =>
    r.guest_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.guest_phone?.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input
              placeholder="Search guests..."
              className="h-12 pl-10 bg-white/5 border-white/10 rounded-none text-[10px] font-bold uppercase tracking-[0.2em]"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Button
            onClick={onOpenScanner}
            className="h-12 bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-none text-[10px] font-bold uppercase tracking-[0.3em] w-full md:w-auto"
          >
            <Upload className="w-4 h-4 mr-2" /> Scan QR
          </Button>
        </div>
        <Button
          onClick={onExportCSV}
          variant="outline"
          className="h-12 border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-none text-[10px] font-bold uppercase tracking-[0.3em] w-full md:w-auto"
        >
          <FileDown className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
        {filteredRsvps.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">
              {searchQuery ? "No matching guests found" : "No guests yet"}
            </p>
          </div>
        ) : (
          filteredRsvps.map((rsvp: any) => (
            <div
              key={rsvp.id}
              className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/[0.05] transition-colors group"
            >
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    rsvp.checked_in ? "bg-green-500" : "bg-gray-600"
                  }`}
                />
                <div>
                  <p className="text-sm font-medium text-white">{rsvp.guest_name}</p>
                  <p className="text-[10px] text-gray-500 font-mono">{rsvp.guest_phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {rsvp.table_number && (
                  <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500 bg-white/5 px-2 py-1 rounded">
                    Table {rsvp.table_number}
                  </span>
                )}
                <Button
                  onClick={() => handleToggleCheckIn(rsvp.id, rsvp.checked_in)}
                  disabled={checkingIn === rsvp.id}
                  variant="ghost"
                  className={`text-[10px] font-bold uppercase tracking-widest ${
                    rsvp.checked_in
                      ? "text-green-500 hover:text-green-400"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  {checkingIn === rsvp.id
                    ? "Updating..."
                    : rsvp.checked_in
                    ? "Checked In"
                    : "Check In"}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GuestList;