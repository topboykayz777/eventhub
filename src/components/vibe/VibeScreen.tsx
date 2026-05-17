"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Heart,
  Sparkles,
  Wifi,
  WifiOff,
  Loader2,
  UserCheck,
  Gift,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import VibeBackground from "@/components/vibe/VibeBackground";
import VibeHeroNotification, { VibeEvent } from "@/components/vibe/VibeHeroNotification";
import VibeStats from "@/components/vibe/VibeStats";
import VibeSidebar from "@/components/vibe/VibeSidebar";

interface ActivityItem {
  id: string;
  type: "spray" | "checkin" | "message";
  title: string;
  detail: string;
  amount?: number;
  timestamp: number;
}

const VibeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [slug, setSlug] = useState("");
  const [event, setEvent] = useState<any>(null);
  const [isLive, setIsLive] = useState<boolean | null>(null);
  const [stats, setStats] = useState({ checkedIn: 0, totalSprayed: 0 });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activeNotification, setActiveNotification] = useState<VibeEvent | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [recentSprays, setRecentSprays] = useState<{
    id: string;
    guest_name: string;
    amount: number;
  }[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "online" | "offline">(
    "connecting",
  );
  const eventRef = useRef<any>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const notificationQueue = useRef<VibeEvent[]>([]);
  const isProcessingQueue = useRef(false);

  const themeConfigs: Record<string, any> = {
    modern: { bg: "bg-[#050505]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/20", glass: "bg-white/5", dark: true },
    traditional: { bg: "bg-[#064e3b]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/30", glass: "bg-black/20", dark: true },
    elegant: { bg: "bg-[#f8f8f8]", accent: "text-black", border: "border-black/10", glass: "bg-white/80", dark: false },
    sahara: { bg: "bg-[#451a03]", accent: "text-[#fbbf24]", border: "border-[#fbbf24]/20", glass: "bg-black/20", dark: true },
    velvet: { bg: "bg-[#2e1065]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/20", glass: "bg-black/20", dark: true },
    garden: { bg: "bg-[#064e3b]", accent: "text-[#10b981]", border: "border-[#10b981]/20", glass: "bg-black/20", dark: true },
    oceanic: { bg: "bg-[#1e3a8a]", accent: "text-[#93c5fd]", border: "border-[#93c5fd]/20", glass: "bg-black/20", dark: true },
    rose: { bg: "bg-[#831843]", accent: "text-[#fbcfe8]", border: "border-[#fbcfe8]/20", glass: "bg-black/20", dark: true },
    earth: { bg: "bg-[#431407]", accent: "text-[#fb923c]", border: "border-[#fb923c]/20", glass: "bg-black/20", dark: true },
    silver: { bg: "bg-[#1f2937]", accent: "text-[#9ca3af]", border: "border-[#9ca3af]/20", glass: "bg-black/20", dark: true },
    dynasty: { bg: "bg-[#7f1d1d]", accent: "text-[#D4AF37]", border: "border-[#D4AF37]/20", glass: "bg-black/20", dark: true },
    vintage: { bg: "bg-[#fef3c7]", accent: "text-[#92400e]", border: "border-[#92400e]/20", glass: "bg-white/40", dark: false },
    onyx: { bg: "bg-black", accent: "text-[#06b6d4]", border: "border-[#06b6d4]/20", glass: "bg-white/5", dark: true },
    lavender: { bg: "bg-[#f5f3ff]", accent: "text-[#8b5cf6]", border: "border-[#8b5cf6]/20", glass: "bg-white/80", dark: false },
    midnight: { bg: "bg-[#020617]", accent: "text-[#38bdf8]", border: "border-[#38bdf8]/20", glass: "bg-white/5", dark: true },
    champagne: { bg: "bg-[#fafaf9]", accent: "text-[#d97706]", border: "border-[#d97706]/20", glass: "bg-white/80", dark: false },
    forest: { bg: "bg-[#022c22]", accent: "text-[#10b981]", border: "border-[#10b981]/20", glass: "bg-white/5", dark: true },
    sunset: { bg: "bg-[#451a03]", accent: "text-[#f97316]", border: "border-[#f97316]/20", glass: "bg-white/5", dark: true },
    marble: { bg: "bg-[#f9fafb]", accent: "text-[#111827]", border: "border-[#e5e7eb]", glass: "bg-white/80", dark: false },
    platinum: { bg: "bg-[#f3f4f6]", accent: "text-[#1f2937]", border: "border-[#d1d5db]", glass: "bg-white/80", dark: false },
  };

  const processQueue = useCallback(async () => {
    if (isProcessingQueue.current || notificationQueue.current.length === 0) return;
    isProcessingQueue.current = true;

    const next = notificationQueue.current.shift()!;
    setActiveNotification(next);
    setActivities((prev) => [next, ...prev].slice(0, 15));
    setShowOverlay(true);

    if (next.type === "spray") {
      setRecentSprays((prev) => [{ id: next.id, guest_name: next.detail, amount: next.amount || 0 }, ...prev].slice(0, 2));
      confetti({
        particleCount: 400,
        spread: 120,
        origin: { y: 0.6 },
        colors: ["#D4AF37", "#ffffff", "#F9E4B7"],
        zIndex: 200,
        scalar: 1.5,
      });
    } else if (next.type === "checkin") {
      setRecentSprays((prev) => [{ id: next.id, guest_name: next.detail, amount: 0 }, ...prev].slice(0, 2));
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
    setActiveNotification(null);
    setShowOverlay(false);
    await new Promise((resolve) => setTimeout(resolve, 800));

    isProcessingQueue.current = false;
    processQueue();
  }, [processQueue]);

  const addToQueue = useCallback(
    (notif: Omit<VibeEvent, "id" | "config">) => {
      const currentEvent = eventRef.current;
      const config = themeConfigs[currentEvent?.theme || "modern"];

      notificationQueue.current.push({
        ...notif,
        id: Math.random().toString(36).substring(7),
        config,
        timestamp: Date.now(),
      } as VibeEvent);

      processQueue();
    },
    [processQueue],
  );

  useEffect(() => {
    const fetchInitialAndSubscribe = async () => {
      if (!slug) return;

      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("*")
        .ilike("slug", slug.trim())
        .maybeSingle();

      if (eventError || !eventData) {
        console.error("Event fetch error:", eventError);
        return;
      }

      setEvent(eventData);
      eventRef.current = eventData;

      const started = new Date() >= new Date(eventData.event_date);
      setIsLive(started && !eventData.is_finished);

      const [rsvpsRes, budgetRes] = await Promise.all([
        supabase.from("rsvps").select("checked_in").eq("event_id", eventData.id),
        supabase
          .from("budget_items")
          .select("amount")
          .eq("event_id", eventData.id)
          .eq("status", "approved")
          .eq("type", "income"),
      ]);

      setStats({
        checkedIn: rsvpsRes.data?.filter((r) => r.checked_in).length || 0,
        totalSprayed: budgetRes.data?.reduce((acc, curr) => acc + curr.amount, 0) || 0,
      });

      const channel = supabase
        .channel(`vibe-realtime-${eventData.id}`, {
          config: { broadcast: { self: true }, presence: { key: eventData.id } },
        })
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "budget_items",
              filter: `event_id=eq.${eventData.id}`,
            },
            (payload) => {
              const isNewlyApproved =
                (payload.eventType === "INSERT" && payload.new.status === "approved") ||
                (payload.eventType === "UPDATE" && payload.new.status === "approved" && payload.old?.status !== "approved");

              if (isNewlyApproved && payload.new.type === "income") {
                const guestName = payload.new.description.replace("Digital Spray from ", "");
                addToQueue({ type: "spray", title: "Digital Spray Received", detail: guestName, amount: payload.new.amount });
                setStats((prev) => ({ ...prev, totalSprayed: prev.totalSprayed + payload.new.amount }));
              }
            },
          )
          .on("postgres_changes", { event: "UPDATE", schema: "public", table: "rsvps", filter: `event_id=eq.${eventData.id}` }, (payload) => {
            if (payload.new.checked_in && !payload.old?.checked_in) {
              addToQueue({ type: "checkin", title: "Guest Arrival", detail: payload.new.guest_name });
              setStats((prev) => ({ ...prev, checkedIn: prev.checkedIn + 1 }));
            }
            if (payload.new.plus_one_checked_in && !payload.old?.plus_one_checked_in) {
              const name = payload.new.plus_one_name || `${payload.new.guest_name}'s Guest`;
              addToQueue({ type: "checkin", title: "Guest Arrival", detail: name });
              setStats((prev) => ({ ...prev, checkedIn: prev.checkedIn + 1 }));
            }
          })
          .on("postgres_changes", { event: "UPDATE", schema: "public", table: "events", filter: `id=eq.${eventData.id}` }, (payload) => {
            setEvent(payload.new);
            eventRef.current = payload.new;
            if (payload.new.message !== payload.old?.message && payload.new.message) {
              addToQueue({ type: "message", title: "Host's Live Update", detail: payload.new.message });
            }
            if (payload.new.is_finished) {
              setIsLive(false);
            }
          })
          .subscribe((status) => {
            if (status === "SUBSCRIBED") setConnectionStatus("online");
            else if (status === "CLOSED" || status === "CHANNEL_ERROR") setConnectionStatus("offline");
          });

        return () => {
          supabase.removeChannel(channel);
        };
      };

      fetchInitialAndSubscribe();
    };

    fetchInitialAndSubscribe();
  }, [slug, addToQueue]);

  const overlayStyle: React.CSSProperties = {
    ...overlayStyle,
    maxWidth: "280px",
    padding: "20px",
  };

  const renderOverlay = () => {
    if (!showOverlay || !eventRef.current) return null;

    const currentSpray = activeNotification;
    if (!currentSpray || currentSpray.type !== "spray") return null;

    return (
      <div ref={overlayRef} style={overlayStyle}>
        <Gift className="text-[#C9A84C]" size={48} />
        <p style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>{currentSpray.detail}</p>
        <p style={{ color: "#C9A84C", fontSize: "18px", fontWeight: "bold" }}>
          ₦{(currentSpray.amount || 0).toLocaleString()}
        </p>
      </div>
    );
  };

  const config = themeConfigs[event?.theme || "modern"];

  if (!event || isLive === null) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  if (!isLive) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-12 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Lock className="text-[#D4AF37] w-12 h-12 mb-12 mx-auto" />
          <h1 className="text-5xl md:text-7xl font-serif italic mb-6">Vibe Screen Inactive</h1>
          <p className="text-gray-500 uppercase tracking-widest text-[10px] font-bold mb-12">
            The stream activates during the event window.
          </p>
          <Button onClick={() => navigate("/")} variant="outline" className="border-white/10 rounded-none px-12 py-8 text-[10px] font-bold uppercase tracking-widest">
            Return to Portal
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${config.bg} ${config.dark !== false ? "text-white" : "text-black"} overflow-hidden relative`}>
      <VibeHeroNotification event={activeNotification} />

      <div className="fixed top-6 left-6 z-[110] transition-all duration-500">
        {connectionStatus === "online" ? (
          <div className="flex items-center gap-3 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full backdrop-blur-md">
            <Wifi size={12} className="text-green-500" />
            <span className="text-[8px] font-black uppercase tracking-widest text-green-500">Live Sync Active</span>
          </div>
        ) : connectionStatus === "connecting" ? (
          <div className="flex items-center gap-3 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full backdrop-blur-md">
            <Loader2 size={12} className="text-amber-500 animate-spin" />
            <span className="text-[8px] font-black uppercase tracking-widest text-amber-500">Connecting...</span>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full backdrop-blur-md">
            <WifiOff size={12} className="text-red-500" />
            <span className="text-[8px] font-black uppercase tracking-widest text-red-500">Sync Disconnected</span>
          </div>
        )}
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row h-screen">
        {/* Memory Wall */}
        <div className="h-[55vh] lg:h-full lg:w-3/4 relative overflow-hidden">
          <VibeBackground mediaUrls={event.gallery_urls || []} fallbackUrl={event.photo_url} />
        </div>

        {/* Sidebar */}
        <div className={`h-[45vh] lg:h-full lg:w-1/4 ${config.glass} backdrop-blur-3xl border-t lg:border-t-0 lg:border-l ${config.border} flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.4)]`}>
          {/* Header & Stats */}
          <div className="p-6 lg:p-10 flex flex-col justify-between border-b border-white/5 shrink-0">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                  <Sparkles className={config.accent} size={16} />
                </div>
                <span className={`${config.accent} text-[10px] font-black uppercase tracking-[0.4em] uppercase`}>Live Feed</span>
              </div>
              <h1 className="text-2xl lg:text-4xl font-serif italic leading-tight line-clamp-2">{event.event_name}</h1>
            </div>

            <div className="mt-8">
              <VibeStats stats={stats} config={config} />
            </div>
          </div>

          {/* Live Activity Feed */}
          <div className="flex-1 flex flex-col min-h-0 space-y-4">
            {/* Host Message */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Heart size={14} className={config.accent} />
                <span className={`${config.accent} text-[8px] font-black uppercase tracking-[0.3em]`}>Host's Message</span>
              </div>
              <p className="text-sm lg:text-base font-light italic opacity-80 leading-relaxed">
                "{event.message || 'Thank you for being part of our special day.'}"
              </p>
            </div>

            {/* Recent Activity (max 2) */}
            <div className="space-y-2">
              {activities.slice(0, 2).map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-[1rem] bg-[#0f0f0f]/30 px-4 py-3 border border-[#D4AF37]/10">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                    {item.type === "spray" ? (
                      <Gift className="text-[#D4AF37] w-6 h-6" />
                    : item.type === "checkin" ? (
                      <UserCheck className="text-green-500 w-5 h-5" />
                    : (
                      <AlertCircle className="text-[#D4AF37] w-5 h-5"
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-white truncate">{item.detail}</p>
                    {item.amount && (
                      <p className="text-[#D4AF37] font-medium">{`₦${item.amount.toLocaleString()}`}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VibeScreen;