"use client";

import React from 'react';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  // VibeScreen is a full-screen display and should not be constrained by the global layout
  const isVibeScreen = location.pathname.startsWith('/vibe/');
  
  if (isVibeScreen) {
    return <div className="w-full min-h-screen overflow-x-hidden">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#050505] w-full flex flex-col overflow-x-hidden">
      {/* 
        This wrapper ensures that content never touches the screen edges on mobile (px-5 = 20px)
        and is centered with a max-width of 1280px on desktop.
      */}
      <div className="w-full max-w-[1280px] mx-auto px-5 sm:px-6 md:px-8 lg:px-10 flex-1 flex flex-col relative">
        {children}
      </div>
    </div>
  );
};

export default Layout;