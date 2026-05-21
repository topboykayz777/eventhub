"use client";

import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Gallery from '../components/landing/Gallery';
import CTA from '../components/landing/CTA';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <main className="bg-background min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Gallery />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;