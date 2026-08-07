"use client";

import { useEffect, useState } from "react";

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    
    // Calculate end of current day
    const getEndOfDay = () => {
      const now = new Date();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      return endOfDay.getTime();
    };

    const targetTime = getEndOfDay();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        // If passed, maybe reset to next day (or keep 0)
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer(); // Initial call
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (!mounted) {
    // Return placeholder to prevent hydration mismatch
    return (
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 bg-red-100 text-red-700 rounded-lg flex items-center justify-center text-2xl font-bold shadow-sm mb-1">00</div>
          <span className="text-xs font-semibold text-muted-foreground">Giờ</span>
        </div>
        <div className="text-2xl font-bold text-muted-foreground mt-2">:</div>
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 bg-red-100 text-red-700 rounded-lg flex items-center justify-center text-2xl font-bold shadow-sm mb-1">00</div>
          <span className="text-xs font-semibold text-muted-foreground">Phút</span>
        </div>
        <div className="text-2xl font-bold text-muted-foreground mt-2">:</div>
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 bg-red-100 text-red-700 rounded-lg flex items-center justify-center text-2xl font-bold shadow-sm mb-1">00</div>
          <span className="text-xs font-semibold text-muted-foreground">Giây</span>
        </div>
      </div>
    );
  }

  // Helper to format numbers with leading zero
  const formatNum = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 bg-gradient-to-b from-red-500 to-yellow-500 text-white rounded-lg flex items-center justify-center text-2xl font-bold shadow-md mb-1">
          {formatNum(timeLeft.hours)}
        </div>
        <span className="text-xs font-semibold text-muted-foreground">Giờ</span>
      </div>
      <div className="text-2xl font-bold text-muted-foreground mt-2">:</div>
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 bg-gradient-to-t from-red-500 to-yellow-500 text-white rounded-lg flex items-center justify-center text-2xl font-bold shadow-md mb-1">
          {formatNum(timeLeft.minutes)}
        </div>
        <span className="text-xs font-semibold text-muted-foreground">Phút</span>
      </div>
      <div className="text-2xl font-bold text-muted-foreground mt-2">:</div>
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 bg-gradient-to-b from-red-500 to-yellow-500 text-white rounded-lg flex items-center justify-center text-2xl font-bold shadow-md mb-1">
          {formatNum(timeLeft.seconds)}
        </div>
        <span className="text-xs font-semibold text-muted-foreground">Giây</span>
      </div>
    </div>
  );
}
