"use client";

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from './LoadingScreen';

const RouteWatcher = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(true);

  useEffect(() => {
    // Show loader on every route change
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 2000); // Show for 2 seconds to ensure "Did you know" facts are readable

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isNavigating && <LoadingScreen key="loader" />}
      </AnimatePresence>
      {children}
    </>
  );
};

export default RouteWatcher;