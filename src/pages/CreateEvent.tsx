"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccess, showError } from "@/utils/toast";
import { motion } from "framer-motion";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    venue: "",
    venue_map_url: "",
    message: "",
    plan: "Beta",
    theme: "modern",
    photo_url: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.eventName || !formData.eventDate || !formData.venue) {
      showError("Please fill in the required fields.");
      return;
    }

    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        showError("You must be logged in to create an event.");
        setLoading(false);
        return;
      }

      const slug = formData.eventName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") + "-" + Date.now();

      const { error } = await supabase.from("events").insert({
        host_id: user.id,
        event_name: formData.eventName,
        event_date: formData.eventDate,
        venue: formData.venue,
        venue_map_url: formData.venue_map_url || null,
        message: formData.message || null,
        plan: formData.plan,
        theme: formData.theme,
        photo_url: formData.photo_url || null,
        slug,
        is_paid: false
      });

      if (error) throw error;

      showSuccess("Event created successfully!");
      navigate(`/event/${slug}`);
    } catch (error: any) {
      showError(error.message || "Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `event-images/${fileName}`;

      const { data, error } = await supabase.storage
        .from("event-images")
        .upload(filePath, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("event-images")
        .getPublicUrl(data.path);

      setFormData({ ...formData, photo_url: urlData.publicUrl });
      showSuccess("Image uploaded successfully!");
    } catch (error: any) {
      showError(error.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const themeColors: Record<string, { bg: string; accent: string; text: string }> = {
    modern: { bg: "from-slate-900 to-slate-800", accent: "bg-blue-500", text: "text-blue-400" },
    gold: { bg: "from-amber-900 to-amber-800", accent: "bg-[#D4AF37]", text: "text-[#D4AF37]" },
    rose: { bg: "from-rose-900 to-rose-800", accent: "bg-rose-500", text: "text-rose-400" },
    emerald: { bg: "from-emerald-900 to-emerald-800", accent: "bg-emerald-500", text: "text-emerald-400" },
    violet: { bg: "from-violet-900 to-violet-800", accent: "bg-violet-500", text: "text-violet-400" },
    ocean: { bg: "from-cyan-900 to-cyan-800", accent: "bg-cyan-500", text: "text-cyan-400" },
    sunset: { bg: "from-orange-900 to-orange-800", accent: "bg-orange-500", text: "text-orange-400" },
  };

  const selectedTheme = themeColors[formData.theme] || themeColors.modern;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      
      <div className="max-w-5xl mx-auto py-24 px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block"
          >
            Create Your Event
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif italic mb-8"
          >
            Design Your <span className="text-[#D4AF37]">Celebration</span>
          </motion.h1>
          <p className="text-gray-500 max-w-2xl mx-auto font-light tracking-wide">
            Fill in the details below to create a stunning digital event page.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Event Details */}
          <div className="p-8 md:p-12 rounded-[3rem] border border-white/5 bg-white/[0.02] space-y-8">
            <h2 className="text-2xl font-serif italic mb-8">Event Details</h2>
            
            <div className="space-y-2">
              <Label className="text-gray-400">Event Name *</Label>
              <Input
                placeholder="e.g. Kael & Felix Wedding Reception"
                value={formData.eventName}
                onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                className="h-14 bg-white/5 border-white/10 rounded-none text-lg text-white placeholder:text-gray-600"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-gray-400">Event Date *</Label>
                <Input
                  type="datetime-local"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="h-14 bg-white/5 border-white/10 rounded-none text-lg text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-400">Venue *</Label>
                <Input
                  placeholder="e.g. Eko Hotels & Suites, Victoria Island"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="h-14 bg-white/5 border-white/10 rounded-none text-lg text-white placeholder:text-gray-600"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-400">Venue Map URL (Google Maps link)</Label>
              <Input
                placeholder="https://maps.google.com/..."
                value={formData.venue_map_url}
                onChange={(e) => setFormData({ ...formData, venue_map_url: e.target.value })}
                className="h-14 bg-white/5 border-white/10 rounded-none text-lg text-white placeholder:text-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-400">Message to Guests</Label>
              <Textarea
                placeholder="Write a warm welcome message for your guests..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="min-h-[120px] bg-white/5 border-white/10 rounded-none text-lg text-white placeholder:text-gray-600"
              />
            </div>
          </div>

          {/* Service Tier */}
          <div className="p-8 md:p-12 rounded-[3rem] border border-white/5 bg-white/[0.02] space-y-8">
            <h2 className="text-2xl font-serif italic mb-8">Service Tier</h2>
            
            <Select onValueChange={(v) => setFormData({ ...formData, plan: v })} defaultValue="Beta">
              <SelectTrigger className="h-16 bg-[#D4AF37]/50 border-[#D4AF37]/30 rounded-none text-lg font-light text-[#D4AF37]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-[#D4AF37]/30 text-[#D4AF37]">
                <SelectItem value="Beta">Beta Access - #100 (First 50 Testers)</SelectItem>
                <SelectItem value="Basic" disabled>Basic (₦25,000)</SelectItem>
                <SelectItem value="Standard" disabled>Standard (₦75,000)</SelectItem>
                <SelectItem value="Pro" disabled>Pro (₦150,000)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Theme Selection */}
          <div className="p-8 md:p-12 rounded-[3rem] border border-white/5 bg-white/[0.02] space-y-8">
            <h2 className="text-2xl font-serif italic mb-8">Choose Your Theme</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(themeColors).map(([key, theme]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormData({ ...formData, theme: key })}
                  className={`p-6 rounded-2xl bg-gradient-to-br ${theme.bg} border-2 transition-all ${
                    formData.theme === key ? "border-[#D4AF37] scale-105" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <span className={`text-sm font-bold uppercase tracking-widest ${theme.text}`}>
                    {key}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Cover Image */}
          <div className="p-8 md:p-12 rounded-[3rem] border border-white/5 bg-white/[0.02] space-y-8">
            <h2 className="text-2xl font-serif italic mb-8">Cover Image</h2>
            
            <div className="space-y-2">
              <Label className="text-gray-400">Upload a cover photo for your event page</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="h-14 bg-white/5 border-white/10 rounded-none text-lg text-white file:bg-[#D4AF37] file:text-black file:border-0 file:px-6 file:py-2 file:rounded-none file:font-bold file:uppercase file:tracking-widest file:text-[10px]"
              />
              {uploading && <p className="text-[#D4AF37] text-sm">Uploading...</p>}
              {formData.photo_url && (
                <div className="mt-4 relative rounded-2xl overflow-hidden">
                  <img src={formData.photo_url} alt="Preview" className="w-full h-48 object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="text-center pt-8">
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#D4AF37] hover:bg-[#B8860B] text-black px-16 py-8 rounded-none text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500"
            >
              {loading ? "Creating..." : "Create Event Page"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;