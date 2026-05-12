"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coins,
  UserCheck,
  Sparkles,
  Users,
  Clock,
  Loader2,
  Megaphone,
  Camera,
  Timer,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import confetti from "canvas-confetti";

interface Activity {
  id: string;
  type: "spray" | "checkin" | "rsvp";
  title: string;
  subtitle: string;
  amount?: number;
  timestamp: number;
}

const THEME_COLORS: Record<string, string> = {
  modern: "#D4AF37",
  traditional: "#064e3b",
  elegant: "#FFFFFF",
  sahara: "#78350f",
  velvet: "#4c1d95",
  garden: "#065f46",
  oceanic: "#1e3a8a",
  rose: "#9d174d",
  earth: "#7c2d12",
  silver: "#374151",
  dynasty: "#991b1b",
  vintage: "#fef3c7",
  onyx: "#1a1a1a",
  champagne: "#fff7ed",
  pearl: "#0f172a",
  tuscan: "#fefce8",
  frost: "#f0f9ff",
  magenta: "#db2777",
  jade: "#166534",
  saffron: "#9a3412",
  slate: "#475569",
  lavender: "#5b21b6",
  ruby: "#e11d48",
  golden: "#854d0e",
  birch: "#4b5563",
  bronze: "#9a3412",
  teal: "#115e59",
  charcoal: "#111827",
  sand: "#fafaf9",
  forest: "#022c22",
  ember: "#450a0a",
  blossom: "#fb7185",
  solstice: "#1e1b4b",
  breeze: "#38bdf8",
};

interface VibeScreenProps {
  eventId: string;
}

const VibeScreen = ({ eventId }: VibeScreenProps) => {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState({ rsvps: 0, sprays: 0, checkins: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [tickerGuests, setTickerGuests] = useState<string[]>([]);

  const addActivity = useCallback(
    (activity: Omit<Activity, "timestamp">) => {
      const newActivity: Activity = {
        ...activity,
        timestamp: Date.now(),
      };

      // Immediate visual cue for check‑in
      if (activity.type === "checkin") {
        const msg =
          activity.amount && activity.amount > 50000
            ? `Wow she just got #${activity.amount.toLocaleString()} sprayed!`
            : "Hey my man just got in!";
        // Show as a toast‑like notification
        // Using a simple in‑page alert for demo purposes
        const notification = document.createElement("div");
        notification.className =
          "fixed top-4 right-4 z-50 bg-[#D4AF37]/80 text-white px-4 py-2 rounded-md shadow-lg font-medium tracking-wider";
        notification.textContent = msg;
        document.body.appendChild(notification);
        setTimeout(() => {
          notification.remove();
        }, 4000);
      }

      setActivities((prev) => {
        // Remove duplicates by id
        if (prev.some((a) => a.id === newActivity.id)) return prev;
        return [...prev, newActivity].slice(0, 8);
      });
    },
    [],
  );

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (event?.gallery_urls?.length > 0) {
      const interval = setInterval(() => {
        setCurrentPhotoIndex((i) => (i + 1) % event.gallery_urls.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [event]);

  const fetchInitialData = async (eventId: string) => {
    const { data: rsvps } = await supabase
      .from("rsvps")
      .select("id, guest_name, checked_in, updated_at, created_at")
      .eq("event_id", eventId)
      .order("updated_at", { ascending: false })
      .limit(20);

    const { data: sprays } = await supabase
      .from("budget_items")
      .select("id, description, amount, created_at")
      .eq("event_id", eventId)
      .eq("type", "income")
      .ilike("description", "%Digital Spray%")
      .order("created_at", { ascending: false })
      .limit(10);

    const initialActivities: Activity[] = [
      ...(rsvps || [])
        .filter((r: any) => r.checked_in)
        .map((r: any) => ({
          id: `checkin-${r.id}`,
          type: "checkin" as const,
          title: "GUEST CHECKED IN",
          subtitle: r.guest_name,
          timestamp: new Date(r.updated_at).getTime(),
        })),
      ...(sprays || []).map((s: any) => ({
        id: `spray-${s.id}`,
        type: "spray" as const,
        title: "DIGITAL SPRAY",
        subtitle: s.description,
        amount: s.amount,
        timestamp: new Date(s.created_at).getTime(),
      })),
    ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 8);

    setActivities(initialActivities);
    const { count: rsvpCount } = await supabase
      .from("rsvps")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId);
    const { count: checkinCount } = await supabase
      .from("rsvps")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId)
      .eq("checked_in", true);
    const totalSprays = sprays?.reduce((acc: number, s: any) => acc + s.amount, 0) || 0;

    setStats({ rsvps: rsvpCount || 0, checkins: checkinCount || 0, sprays: totalSprays });
  };

  const fetchEvent = async () => {
    const { data } = await supabase
      .from("events")
      .select("id, event_name, event_date, venue, venue_map_url, message, theme, photo_url, gallery_urls, is_paid, slug")
      .ilike("slug", eventId.trim())
      .maybeSingle();

    if (data) {
      setEvent(data);
      await fetchInitialData(data.id);
      const channel = supabase
        .channel(`vibe-realtime-${data.id}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "rsvps",
            filter: `event_id=eq.${data.id}`,
          },
          (payload: any) => {
            if (payload.new.checked_in && !payload.old.checked_in) {
              addActivity({
                id: `checkin-${payload.new.id}`,
                type: "checkin" as const,
                title: "GUEST CHECKED IN",
                subtitle: payload.new.guest_name,
                timestamp: new Date(payload.new.updated_at).getTime(),
              });
              setStats((prev) => ({ ...prev, checkins: prev.checkins + 1 }));
              setTickerGuests((g) => [payload.new.guest_name, ...g]);
            }
          },
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "budget_items",
            filter: `event_id=eq.${data.id}`,
          },
          (payload: any) => {
            if (payload.new.type === "income" && payload.new.description.includes("Digital Spray")) {
              addActivity({
                id: `spray-${payload.new.id}`,
                type: "spray" as const,
                title: "DIGITAL SPRAY",
                subtitle: payload.new.description,
                amount: payload.new.amount,
                timestamp: new Date(payload.new.created_at).getTime(),
              });
              setStats((prev) => ({ ...prev, sprays: prev.sprays + payload.new.amount }));
            }
          },
        )
        .subscribe();

      setLoading(false);
      return () => {
        supabase.removeChannel(channel);
      };
    }
  };

  useEffect(() => {
    if (eventId) fetchEvent();
  }, [eventId]);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" />
    </div>
  );

  const theme = event.theme || "modern";
  const config = THEME_COLORS[theme] || THEME_COLORS.modern;
  const textColor = "#FFFFFF";
  const mutedColor = "rgba(255,255,255,0.6)";

  const isConcluded = event?.event_date
    ? new Date(event.event_date).getTime() + 86400000 < Date.now()
    : false;

  return (
    <div
      className={`min-h-screen ${
        isConcluded ? "bg-[#050505]" : `bg-${theme}`
      } ${textColor} overflow-hidden relative font-serif flex flex-col`}
    >
      {/* Background glow */}
      <div
        className={`absolute inset-0 ${
          isConcluded
            ? "bg-[#050505]/80"
            : `bg-[#050505]/95 backdrop-blur-xl`
        } rounded-full animate-pulse`}
      />
      <div className="relative z-10 flex-1 flex flex-col p-4 md:p-10 max-h-screen">
        {/* Header */}
        <div className="flex justify-between items-start mb-4 md:mb-8 shrink-0">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <span className={`text-${config} text-[8px] md:text-[10px] font-bold tracking-[0.6em] uppercase mb-1 block`}>
              Live Event Feed
            </span>
            <h1 className="text-2xl md:text-5xl italic leading-tight">
              {event.event_name}
            </h1>
          </motion.div>
          <div className="text-right">
            <div className={`flex items-center gap-2 md:gap-3 text-lg md:text-3xl font-light tracking-widest`}>
              <Clock className={`${config} w-4 h-4 md:w-7 md:h-7`} />
              {currentTime.toLocaleTimeString("en-NG", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <p className={`${mutedColor} text-[7px] md:text-[10px] uppercase tracking-[0.4em]`}>
              {currentTime.toLocaleDateString("en-NG", {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Main content grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-10 min-h-0 overflow-hidden">
          {/* Left column – recent activity */}
          <div className="lg:col-span-7 flex flex-col min-h-0">
            <h2 className={`text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em] ${mutedColor} mb-3 flex items-center gap-2`}>
              <Sparkles className={`${config} w-3 h-3`} /> Recent Activity
            </h2>
            <div className="flex-1 space-y-3 md:space-y-4 overflow-y-auto custom-scrollbar pr-2">
              {activities.map((activity) => (
                <motion.div
                  key={activity.id}
                  layout
                  initial={{ opacity: 0, x: -50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  className={`p-4 md:p-6 rounded-3xl flex items-center justify-between backdrop-blur-2xl border shadow-2xl ${
                    activity.type === "spray"
                      ? `bg-[#D4AF37]/10 border-[#D4AF37]/30 shadow-[#D4AF37]/5`
                      : `bg-[#25D366]/10 border-[#25D366]/30 shadow-[#25D366]/5`
                  }`}
                >
                  <div className="flex items-center gap-4 md:gap-6">
                    <div
                      className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center ${
                        activity.type === "spray"
                          ? "bg-[#D4AF37] text-black"
                          : "bg-[#25D366] text-white"
                      }`}
                    >
                      {activity.type === "spray"
                        ? <Coins size={24} />
                        : <UserCheck size={24} />}
                    </div>
                    <div>
                      <p className={`text-[7px] md:text-[9px] font-black uppercase tracking-[0.4em] mb-1 ${
                        activity.type === "spray"
                          ? "text-[#D4AF37]"
                          : "text-[#25D366]"
                      }`}>
                        {activity.title}
                      </p>
                      <p className="text-lg md:text-3xl font-light italic truncate max-w-[200px] md:max-w-none">
                        {activity.subtitle}
                      </p>
                    </div>
                  </div>
                  {activity.amount && (
                    <div className="text-2xl md:text-5xl font-serif italic text-[#D4AF37]">
                      ₦{activity.amount.toLocaleString()}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right column – stats & gallery */}
          <div className="lg:col-span-5 flex flex-col gap-4 md:gap-8 min-h-0">
            <div className="flex-1 rounded-[3rem] overflow-hidden border {config === "modern" ? "border-[#D4AF37]/30" : "border-[#25D366]/30"} shadow-2xl bg-black/40 relative min-h-[250px]">
              {event?.gallery_urls?.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentPhotoIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    src={event.gallery_urls[currentPhotoIndex]}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </AnimatePresence>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 opacity-20">
                  <Camera size={40} />
                </div>
              )}
              <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 border border-white/10">
                <Camera size={12} className={config} />
                <span className="text-[8px] font-black uppercase tracking-widest text-white">
                  Live Gallery
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-6 shrink-0">
              <div className="bg-[#D4AF37]/10 border-[#D4AF37]/5 p-6 md:p-10 rounded-[2rem] text-center backdrop-blur-xl">
                <Users className={`${config} w-6 h-6 mx-auto mb-3`} />
                <p className="text-2xl md:text-4xl font-light">{stats.checkins}</p>
                <p className={`text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] ${mutedColor}`}>
                  Guests Checked In
                </p>
              </div>
              <div className="bg-[#25D366]/10 border-[#25D366]/5 p-6 md:p-10 rounded-[2rem] text-center backdrop-blur-xl">
                <Coins className={`${config} w-6 h-6 mx-auto mb-3`} />
                <p className="text-2xl md:text-4xl font-light">
                  ₦{stats.sprays.toLocaleString()}
                </p>
                <p className={`text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] ${mutedColor}`}>
                  Total Sprayed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee ticker */}
        <div className="mt-6 md:mt-10 pt-6 border-t border-white/5 overflow-hidden relative shrink-0">
          <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
            <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.5em] {mutedColor} flex items-center gap-3">
              <CheckCircle2 size={14} className="text-[#25D366] text-[#25D366]" />
              Verified Entry:
            </span>
            {tickerGuests.length > 0 ? (
              <>
                {tickerGuests.map((name, i) => (
                  <span key={i} className="text-base md:text-2xl font-light italic flex items-center gap-6">
                    {name} <span className={config}>•</span>
                  </span>
                ))}
                {tickerGuests.map((name, i) => (
                  <span key={`dup-${i}`} className="text-base md:text-2xl font-light italic flex items-center gap-6">
                    {name} <span className={config}>•</span>
                  </span>
                ))}
              </>
            ) : (
              <span className="text-base md:text-2xl font-light italic opacity-30">
                Waiting for first arrival...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Marquee animation CSS */}
      <style dangerouslySetInnerHTML={{ __html: `@keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }`}} />
    </div>
  );
};

export default VibeScreen;