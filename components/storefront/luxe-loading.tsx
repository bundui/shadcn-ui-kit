"use client";

import Image from "next/image";
import React from "react";

interface LuxeLoadingProps {
  label?: string;
  className?: string;
  mode?: "absolute" | "fixed" | "relative";
}

export function LuxeLoading({ 
  label = "Đang tải dữ liệu...", 
  className = "",
  mode = "fixed" 
}: LuxeLoadingProps) {
  const positionClasses = 
    mode === "absolute"
      ? "absolute inset-0 z-50 min-h-[60vh] flex flex-col items-center justify-center p-4 bg-background/60 dark:bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300"
      : mode === "fixed"
      ? "fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-background/60 dark:bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300"
      : "relative flex flex-col items-center justify-center py-20 px-4 min-h-[50vh]";

  return (
    <div className={`${positionClasses} space-y-2 ${className}`}>
      {/* Glowing Pedestal / Cosmic Logo Container */}
      <div className="relative flex items-center justify-center p-4">
        {/* Pulsing Outer Cosmic Ring */}
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-violet-400/10 via-purple-400/10 to-fuchsia-400/10 blur-xl animate-pulse duration-[2500ms]" />
        
        {/* Spinning Gradient Border */}
        {/* <div className="ab  solute inset-0 rounded-2xl bg-gradient-to-tr from-violet-500 via-purple-500 to-indigo-500 opacity-60 blur-sm -z-10" /> */}

        {/* Brand Logo & Shimmering Aura */}
        <div className="relative bg-card/80 dark:bg-slate-950/80 backdrop-blur-md px-8 py-5 rounded-2xl border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.25)] flex flex-col items-center gap-3.5 animate-luxe-float">
          <div className="relative">
            {/* <div className="absolute -inset-1.5 rounded-lg bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-500 blur-lg opacity-70 animate-pulse" /> */}
            <Image src="/icons/luxecommerce.png" alt="Luxe Commerce" width={52} height={52} className="relative drop-shadow-md" />
          </div>

          {/* Shimmering Brand Name */}
          <div className="flex items-center tracking-tight text-3xl font-black">
            <span className="bg-gradient-to-r from-violet-500 via-purple-400 to-fuchsia-400 dark:from-violet-300 dark:via-purple-200 dark:to-fuchsia-300 bg-clip-text text-transparent animate-shimmer-metallic drop-shadow-[0_0_12px_rgba(168,85,247,0.45)]">
              Luxe
            </span>
            <span className="ml-0.5 bg-gradient-to-r from-slate-700 via-slate-500 to-slate-800 dark:from-slate-100 dark:via-white dark:to-slate-300 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
              Commerce
            </span>
            {/* <img src="/icons/star.png" alt="Star" width={24} height={24} className="ml-1.5 w-5 h-5 animate__animated animate__flash animate__infinite inline-block" /> */}
          </div>
        </div>
      </div>

      {/* Loading Text Label & Pulsing Dots */}
      <div className="flex flex-col items-center space-y-4 text-center">
        <p className="text-sm font-semibold tracking-wide uppercase bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600 dark:from-purple-300 dark:via-fuchsia-300 dark:to-purple-300 bg-clip-text text-transparent animate-pulse">
          {label}
        </p>
        
        {/* Hiệu ứng xoay vòng kép ánh kim Luxe */}
        <div className="relative flex items-center justify-center w-16 h-16">
          {/* Vòng xoay ngoài cùng chuyển màu violet -> fuchsia */}
          <div className="absolute inset-0 rounded-full border-[3px] border-purple-500/20 border-t-purple-500 border-r-fuchsia-400 animate-spin shadow-[0_0_12px_rgba(168,85,247,0.35)]" />
          {/* Vòng xoay ngược chiều phía trong */}
          <div className="absolute inset-2 rounded-full border-[2.5px] border-violet-500/20 border-b-violet-400 border-l-indigo-400 animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
          {/* Lõi ánh sáng nhấp nháy ở giữa */}
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-purple-400 to-fuchsia-300 shadow-[0_0_10px_rgba(216,180,254,0.9)] animate-pulse" />
        </div>
      </div>
    </div>
  );
}
