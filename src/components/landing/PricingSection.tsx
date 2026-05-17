import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { showSuccess, showError } from "@/utils/toast";

const PricingSection = () => {
  const navigate = useNavigate();
  const [betaRemaining, setBetaRemaining] = useState(50);

  const handleSubmit = (plan: string) => {
    if (plan === "beta" && betaRemaining > 0) {
      navigate("/create-event");
    } else {
      showError("Beta tier is full or not available.");
    }
  };

  return (
    <div className="py-40 px-6">
      {/* ... existing content ... */}

      <div className="flex items-center gap-2">
        <Button
          onClick={() => handleSubmit("beta")}
          disabled={betaRemaining <= 0}
          className="bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-none px-8 py-6 text-[10px] font-bold uppercase tracking-widest"
        >
          {betaRemaining > 0 ? "Secure This Tier" : "Full"}
        </Button>
      </div>
    </div>
  );
};

export default PricingSection;