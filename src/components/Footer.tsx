"use client";

import React from 'react';

const Footer = () => {
  return (
    <footer className="py-20 px-6 border-t border-border bg-background">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-xl font-serif italic">
          Event<span className="text-[#D4AF37]">Hub</span>
        </div>
        <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <a href="#" className="hover:text-[#D4AF37] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[#D4AF37] transition-colors">Terms</a>
          <a href="#" className="hover:text-[#D4AF37] transition-colors">Contact</a>
        </div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-light">
          © {new Date().getFullYear()} Elite Orchestration. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;