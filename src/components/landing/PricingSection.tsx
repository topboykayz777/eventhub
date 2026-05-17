import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { showError } from "@/utils/toast";
import { Sparkles, Shield, Zap, Users } from "lucide-react";

const PricingSection = () => {
  const navigate = useNavigate();
  const [betaRemaining] = useState(50);

  return (
    <div className="py-40 px-6">
      {/* ... existing pricing content ... */}

      {/* Premium Beta Glassmorphism Card */}
      <div className="max-w-lg mx-auto mt-32">
        <div className="relative group">
          {/* Animated glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/5 to-[#D4AF37]/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
          
          <div className="relative bg-white/[0.04] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 md:p-16 shadow-[0_8px_60px_rgba(0,0,0,0.5)] overflow-hidden">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 via-transparent to-transparent opacity-30" />
            
            <div className="relative z-10 space-y-10 text-center">
              {/* Header */}
              <div className="space-y-6">
                <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mx-auto shadow-lg">
                  <Sparkles className="text-[#D4AF37] w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-3xl font-serif italic text-white mb-2">
                    Beta <span className="text-[#D4AF37]">Access</span>
                  </h3>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em]">
                    Exclusive Early Adopter Tier
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-base leading-relaxed font-light max-w-sm mx-auto">
                Get early access to the EventHub orchestration suite. Build, manage, and host your events with all foundational tools before the public launch.
              </p>

              {/* Features */}
              <div className="grid grid-cols-3 gap-6 border-t border-b border-white/5 py-8">
                {[
                  { icon: Shield, label: "Full RSVP" },
                  { icon: Users, label: "Guest Management" },
                  { icon: Zap, label: "Priority Updates" }
                ].map((item, i) => (
                  <div key={i} className="text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/5 flex items-center justify-center mx-auto">
                      <item.icon className="text-[#D4AF37] w-5 h-5" />
                    </div>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400">{item.label}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600">
                  {betaRemaining} spots remaining
                </p>
                <Button
                  onClick={() => navigate("/create-event")}
                  className="bg-[#D4AF37] hover:bg-[#B8860B] text-black px-12 py-8 rounded-none text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500 shadow-2xl shadow-[#D4AF37]/20 w-full md:w-auto"
                >
                  Secure Beta Access
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;