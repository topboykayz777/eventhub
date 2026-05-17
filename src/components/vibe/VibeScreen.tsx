import React, { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, UserCheck, Ticket, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showError, showSuccess } from "@/utils/toast";
import confetti from "canvas-confetti";
import { Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const VibeScreen = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [event, setEvent] = useState<any>(null);
  const [isLive, setIsLive] = useState<boolean | null>(null);
  const [stats, setStats] = useState({ checkedIn: 0, totalSprayed: 0 });
  const [activities, setActivities] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [activeNotification, setActiveNotification] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'online' | 'offline'>('connecting');
  
  const notificationQueue = useRef<any[]>([]);
  const isProcessingQueue = useRef(false);
  const eventRef = useRef<any>(null);
    // NEW: state for limited display of notifications
  const [displayNotifications, setDisplayNotifications] = useState<any[]>([]);

  // NEW: ref for overlay element (used for animation)
  const overlayRef = useRef<HTMLDivElement>(null);

  // NEW: animation trigger for overlay
  const [showOverlay, setShowOverlay] = useState(false);

  // NEW: recent sprays log (max 2)
  const [recentSprays, setRecentSprays] = useState<any[]>([]);

  // NEW: process queue now updates displayNotifications (max 2)
  const processQueue = useCallback(async () => {
    if (isProcessingQueue.current || notificationQueue.current.length === 0) return;
    isProcessingQueue.current = true;

    const next = notificationQueue.current.shift()!;
    setActiveNotification(next);
    setActivities(prev => [...prev, next]);

    // Update the limited display list (max 2)
    setDisplayNotifications(notificationQueue.current.slice(-2));

    if (next.type === "spray") {
      // Trigger animation and log update
      setShowOverlay(true);
      setRecentSprays(prev => [next, ...prev].slice(0, 2));
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#C9A84C", "#ffffff"],
      });
      setTimeout(() => setShowOverlay(false), 4000);
    }

    // Existing processing logic (unchanged)
    if (next.type === "checkin") {
      // ... existing check‑in handling ...
    }
    if (next.type === "message") {
      // ... existing message handling ...
    }

    isProcessingQueue.current = false;
    processQueue();
  }, []);

  // NEW: render only the last two notifications in the overlay
  const renderOverlay = () => {
    if (!showOverlay || !eventRef.current) return null;
    const limited = displayNotifications.slice(-2); // keep only two most recent
    return (
      <div
        ref={overlayRef}
        style={{
          position: "fixed" as const,
          inset: 0,
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(212,175,55,0.2)",
          borderRadius: "16px",
          padding: "1rem",
          maxHeight: "300px",
          overflowY: "auto",
          zIndex: 200,
          textAlign: "center",
        }}
      >
        {limited.map((item, i) => (
          <div
            key={item.id}
            className="flex items-start gap-3 rounded-[1rem] bg-[#0f0f0f]/30 px-4 py-3 border border-[#D4AF37]/10"
          >
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
              <Coins className="text-[#D4AF37] w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{item.guest_name}</p>
              <p className="text-[#C9A84C] font-medium">{`₦${item.amount.toLocaleString()}`}</p>
              <p className="text-xs text-[#D4AF37]/70">
                {new Date(item.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // NEW: Updated render return – overlay now uses the limited list and bottom‑anchored style
  return (
    <div className="h-full flex flex-col">
      {/* ... existing UI ... */}

      {/* NEW: Render the limited notification overlay at the bottom */}
      {renderOverlay()}

      {/* ... rest of the component ... */}
    </div>
  );
};

export default VibeScreen;