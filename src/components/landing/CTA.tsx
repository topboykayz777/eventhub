"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CTA = () => {
  return (
    <section className="py-40 px-6 bg-background relative border-t border-border">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-7xl font-serif italic mb-12">
          Your Next Legacy <br/> Starts <span className="text-[#D4AF37]">Here</span>
        </h2>
        <Link to="/create-event">
          <Button 
            size="lg" 
            className="bg-[#D4AF37] hover:bg-[#B8860B] text-black text-[12px] px-16 py-9 rounded-none font-black tracking-[0.4em] uppercase transition-all duration-500 shadow-2xl"
          >
            Create Your Masterpiece
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTA;