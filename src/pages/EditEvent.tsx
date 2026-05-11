"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccess, showError } from "@/utils/toast";
import { motion } from "framer-motion";
import { Image as ImageIcon, Loader2, X, Upload } from "lucide-react";
import Navbar from "@/components/Navbar";

const THEME_OPTIONS = [
  { id: "modern", label: "Midnight Noir", color: "bg-black" },
  { id: "traditional", label: "Royal Heritage", color: "bg-[#064e3b]" },
  { id: "elegant", label: "Pure Ivory", color: "bg-white" },
  { id: "sahara", label: "Sahara Gold", color: "bg-[#78350f]" },
  { id: "velvet", label: "Midnight Velvet", color: "bg-[#4c1d95]" },
  { id: "garden", label: "Emerald Garden", color: "bg-[#065f46]" },
  { id: "oceanic", label: "Oceanic Silk", color: "bg-[#1e3a8a]" },
  { id: "rose", label: "Sunset Rose", color: "bg-[#9d174d]" },
  { id: "earth", label: "Ancestral Earth", color: "bg-[#7c2d12]" },
  { id: "silver", label: "Celestial Silver", color: "bg-[#374151]" },
  { id: "dynasty", label: "Crimson Dynasty", color: "bg-[#991b1b]" },
  { id: "vintage", label: "Vintage Parchment", color: "bg-[#fef3c7]" }
];

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState({
    event_name: "",
    event_date: "",
    venue: "",
    message: "",
    theme: "modern",
    photo_url: "",
    gallery_urls: [] as string[]
  });

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        showError(error.message);
        return;
      }
      setEvent(data);
      setLoading(false);
    };
    fetchEvent();
  }, [id, navigate]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      const fileName = `${Math.random()}.${file.name.split(".").pop()}`;
      const { error: uploadError } = await supabase.storage
        .from("event-photos")
        .upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("event-photos")
        .getPublicUrl(fileName);

      setEvent(prev => ({ ...prev, photo_url: publicUrl }));

      const newGallery = [...event.gallery_urls, publicUrl];
      await supabase
        .from("events")
        .update({ gallery_urls: newGallery })
        .eq("id", id)
        .select();

      showSuccess("Cover image added to gallery.");
    } catch (err: any) {
      showError(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("events")
        .update({
          event_name: event.event_name,
          event_date: event.event_date,
          venue: event.venue,
          message: event.message,
          theme: event.theme,
          photo_url: event.photo_url,
          gallery_urls: event.gallery_urls
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      showSuccess("Event updated successfully.");
      navigate(`/event/${data.slug}`);
    } catch (err: any) {
      showError(err.message ?? "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const themeClasses: Record<string, string> = {
    modern: "bg-black/10 border-[#D4AF37]/30",
    traditional: "bg-[#064e3b]/10 border-[#D4AF37]/30",
    elegant: "bg-white/10 border-[#D4AF37]/30",
    sahara: "bg-[#78350f]/10 border-[#D4AF37]/30",
    velvet: "bg-[#4c1d95]/10 border-[#D4AF37]/30",
    garden: "bg-[#065f46]/10 border-[#D4AF37]/30",
    oceanic: "bg-[#1e3a8a]/10 border-[#D4AF37]/30",
    rose: "bg-[#9d174d]/10 border-[#D4AF37]/30",
    earth: "bg-[#7c2d12]/10 border-[#D4AF37]/30",
    silver: "bg-[#374151]/10 border-[#D4AF37]/30",
    dynasty: "bg-[#991b1b]/10 border-[#D4AF37]/30",
    vintage: "bg-[#fef3c7]/10 border-[#D4AF37]/30"
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto py-12 px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-10">
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.4em] uppercase mb-2">Edit Event</span>
            <h1 className="text-4xl md:text-6xl font-serif italic mb-4">Customize Your Celebration</h1>
          </div>

          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Event Name</Label>
                  <Input
                    required
                    placeholder="e.g. The Balogun Wedding"
                    className="h-14 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light"
                    value={event.event_name}
                    onChange={(e) => setEvent(prev => ({ ...prev, event_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Event Date</Label>
                  <Input
                    type="datetime-local"
                    required
                    className="h-14 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light"
                    value={event.event_date}
                    onChange={(e) => setEvent(prev => ({ ...prev, event_date: e.target.value }))}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Venue</Label>
                  <Input
                    required
                    placeholder="Eko Hotel & Suites, VI, Lagos"
                    className="h-14 bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light"
                    value={event.venue}
                    onChange={(e) => setEvent(prev => ({ ...prev, venue: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Host’s Message</Label>
                <textarea
                  placeholder="A personal note to your guests..."
                  className="min-h-[150px] bg-white/5 border-white/10 rounded-none focus:border-[#D4AF37]/50 text-lg font-light resize-none"
                  value={event.message}
                  onChange={(e) => setEvent(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>

              <div className="space-y-8">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Theme</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {THEME_OPTIONS.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setEvent(prev => ({ ...prev, theme: theme.id }))}
                      className={`relative p-4 rounded-[2rem] border transition-all ${
                        event.theme === theme.id
                          ? `${themeClasses[theme.id]} border-[#D4AF37]/30`
                          : "border-white/5 hover:border-[#D4AF37]/20"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2">
                        <ImageIcon className={`w-6 h-6 ${
                          event.theme === theme.id ? "text-[#D4AF37]" : "text-gray-400"
                        }`} />
                      </div>
                      <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-gray-400">{theme.label}</span>
                      <div className={`absolute top-0 right-0 w-8 h-8 ${theme.color} opacity-20 -mr-2 -mt-2 rounded-full`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Cover Portrait / Gallery</Label>
                {event.photo_url ? (
                  <div className="relative aspect-video w-full overflow-hidden border border-white/10 rounded-[2rem]">
                    <img src={event.photo_url} className="w-full h-full object-cover" alt="Preview" />
                    <button
                      type="button"
                      onClick={() => setEvent(prev => ({ ...prev, photo_url: "" }))}
                      className="absolute top-2 right-2 bg-black/50 p-2 rounded-full text-white hover:bg-red-500 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <Label htmlFor="photo-upload" className="cursor-pointer">
                      <div className="h-32 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 hover:border-[#D4AF37]/30 bg-white/5">
                        <Upload className="text-gray-600 w-10 h-10" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                          Upload High‑Resolution Portrait(s)
                        </span>
                      </div>
                    </Label>
                    <Input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                  </div>
                )}
              </div>

              <div className="pt-8">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black py-10 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default EditEvent;