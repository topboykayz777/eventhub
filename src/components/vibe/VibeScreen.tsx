import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, UserCheck, Ticket, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showError, showSuccess } from '@/utils/toast';
import confetti from 'canvas-confetti';
import { Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// ... existing imports and component definition ...

const VibeScreen = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [event, setEvent] = useState<any>(null);
  const [isLive, setIsLive] = useState<boolean | null>(null);
  const [stats, setStats] = useState({ checkedIn: 0, totalSprayed: 0 });
  const [activities, setActivities] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [activeNotification, setActiveNotification] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'online' | 'offline'>('connecting');
  
  const notificationQueue = useRef<any[]>([]);
  const isProcessingQueue = useRef(false);
  const eventRef = useRef<any>(null);
  
  // FIXED: Properly declare state for spray animation and log
  const [showOverlay, setShowOverlay] = useState(false);
  const [recentSprays, setRecentSprays] = useState<any[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);

  const themeConfigs: Record<string, any> = {
    // ... existing theme configs ...
  };

  // NEW: Handle spray approval animation and log update
  const handleNewSpray = useCallback((spray: any) => {
    // Add to queue (existing logic)
    notificationQueue.current.push(spray);
    processQueue();

    // Update recent sprays log (max 3, most recent first)
    setRecentSprays(prev => [spray, ...prev].slice(0, 3));

    // Trigger animation
    setShowOverlay(true);
    // Auto hide after 4 seconds
    setTimeout(() => setShowOverlay(false), 4000);
  }, []);

  // NEW: Animation trigger
  useEffect(() => {
    if (!showOverlay || !overlayRef.current) return;

    // Confetti burst
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C9A84C', '#ffffff'],
    });

    // Shake animation
    const element = overlayRef.current;
    element.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-10px)' },
      { transform: 'translateX(10px)' },
      { transform: 'translateX(-10px)' },
      { transform: 'translateX(10px)' },
      { transform: 'translateX(0)' }
    ], {
      duration: 1000,
      easing: 'ease-out'
    }).finished.then(() => {
      // Fade out
      setShowOverlay(false);
    });
  }, [showOverlay]);

  // NEW: Process queue (modified to call handleNewSpray)
  const processQueue = useCallback(async () => {
    if (isProcessingQueue.current || notificationQueue.current.length === 0) return;
    isProcessingQueue.current = true;

    const next = notificationQueue.current.shift()!;
    setActiveNotification(next);
    setActivities(prev => [next, ...prev].slice(0, 15));

    if (next.type === 'spray') {
      // NEW: Trigger animation and log update
      handleNewSpray(next);
    }

    // ... existing processing logic (unchanged) ...

    isProcessingQueue.current = false;
    processQueue();
  }, [handleNewSpray]);

  // NEW: Render overlay when showOverlay is true
  const overlayStyle: React.CSSProperties = {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '320px',
    width: '100%',
    textAlign: 'center',
    zIndex: 200,
    opacity: showOverlay ? 1 : 0,
    transition: 'opacity 0.5s ease-out',
  };

  // ... existing useEffect for channel subscription (unchanged) ...

  // NEW: Render overlay component
  const renderOverlay = () => {
    if (!showOverlay || !eventRef.current) return null;
    
    const currentSpray = activeNotification;
    if (!currentSpray || currentSpray.type !== 'spray') return null;

    return (
      <div ref={overlayRef} style={overlayStyle}>
        <Gift className="text-[#C9A84C] text-8xl mb-4" />
        <p className="text-white text-3xl font-bold">{currentSpray.guest_name}</p>
        <p className="text-[#C9A84C] text-2xl font-bold">₦{currentSpray.amount.toLocaleString()}</p>
      </div>
    );
  };

  // ... existing render return (unchanged until near the end) ...

  return (
    <div className="h-full flex flex-col">
      {/* ... existing UI ... */}

      {/* NEW: Live Activity Log */}
      <div className="mt-6">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] mb-2">
          Recent Sprays
        </h3>
        <div className="max-h-40 overflow-y-auto space-y-3">
          {recentSprays.slice().reverse().map((item, i) => (
            <div key={i} className="flex items-start gap-3 rounded-[1rem] bg-[#0f0f0f]/30 px-4 py-3 border border-[#D4AF37]/10">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mr-3">
                <UserCheck className="text-[#D4AF37] w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.guest_name}</p>
                <p className="text-[#C9A84C] font-medium">₦{item.amount.toLocaleString()}</p>
                <p className="text-xs text-[#D4AF37]/70">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NEW: Gift Box Animation Overlay */}
      {renderOverlay()}
    </div>
  );
};

export default VibeScreen;