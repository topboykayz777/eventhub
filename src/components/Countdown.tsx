"use client";

import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string;
  isFinished?: boolean;
}

const Countdown = ({ targetDate, isFinished }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOngoing: false
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const distance = target - now;

      if (distance < 0) {
        // Event is ongoing - count up
        const elapsed = now - target;
        setTimeLeft({
          days: Math.floor(elapsed / (1000 * 60 * 60 * 24)),
          hours: Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((elapsed % (1000 * 60)) / 1000),
          isOngoing: true
        });
      } else {
        // Event is upcoming - count down
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
          isOngoing: false
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isFinished) return null;

  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] animate-pulse">
          {timeLeft.isOngoing ? "• Event in Progress" : "• Countdown to Celebration"}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2 md:gap-4 text-center">
        {[
          { label: 'Days', value: timeLeft.days },
          { label: 'Hours', value: timeLeft.hours },
          { label: 'Mins', value: timeLeft.minutes },
          { label: 'Secs', value: timeLeft.seconds }
        ].map((item) => (
          <div key={item.label} className="bg-white/10 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-white/20">
            <div className="text-2xl md:text-5xl font-black text-white">{item.value}</div>
            <div className="text-[8px] md:text-xs uppercase tracking-widest text-white/70 mt-1">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Countdown;