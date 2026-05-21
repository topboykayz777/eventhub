"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/landing/Hero';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        {/* Additional sections can be added here once components are created */}
      </main>
      {/* Footer component can be added here once created */}
    </div>
  );
};

export default Index;