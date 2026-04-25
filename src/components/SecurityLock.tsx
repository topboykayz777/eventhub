"use client";

import React, { useEffect } from 'react';

const SecurityLock = () => {
  useEffect(() => {
    // 1. Domain Lock: Prevents the app from running on unauthorized domains
    // We've added Dyad and development domains to the whitelist
    const authorizedDomains = [
      'localhost', 
      '127.0.0.1', 
      'eventhub.ng', 
      'vilknsbrvakthefsgfwg.supabase.co',
      'dyad.sh',
      'lovable.app',
      'webcontainer.io'
    ];
    const currentDomain = window.location.hostname;
    
    const isAuthorized = authorizedDomains.some(domain => currentDomain.includes(domain));
    
    // Only trigger the lock in production and if the domain is truly unauthorized
    if (!isAuthorized && window.location.hostname !== '') {
      console.warn("Unauthorized domain detected. Security lock active.");
      // We'll just log it for now instead of wiping the body to prevent accidental lockouts
    }

    // 2. Inspector Lock: Disables right-click and common dev-tool shortcuts
    // This is what prevents people from easily copying your code/assets
    const handleContextMenu = (e: MouseEvent) => {
      // Disable right-click to prevent "Inspect Element"
      e.preventDefault();
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U (View Source)
      if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null;
};

export default SecurityLock;