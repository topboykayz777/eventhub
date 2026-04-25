"use client";

import React, { useEffect } from 'react';

const SecurityLock = () => {
  useEffect(() => {
    // 1. Domain Lock: Prevents the app from running on unauthorized domains
    const authorizedDomains = ['localhost', 'eventhub.ng', 'vilknsbrvakthefsgfwg.supabase.co'];
    const currentDomain = window.location.hostname;
    
    if (!authorizedDomains.some(domain => currentDomain.includes(domain))) {
      document.body.innerHTML = `
        <div style="height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #050505; color: #D4AF37; font-family: serif; text-align: center; padding: 20px;">
          <h1 style="font-size: 3rem; font-style: italic; margin-bottom: 20px;">Unauthorized Access</h1>
          <p style="font-size: 1rem; letter-spacing: 0.3em; text-transform: uppercase; color: #666;">This application is protected by EventHub Security.</p>
        </div>
      `;
    }

    // 2. Inspector Lock: Disables right-click and common dev-tool shortcuts
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
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