"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PromoBanner } from "@/lib/services/banner.service";

interface HeroBannerClientProps {
  initialBanners: PromoBanner[];
}

export function HeroBannerClient({ initialBanners }: HeroBannerClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const activeBanners = initialBanners || [];

  // Mount effect to trigger initial animation
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto slide rotation
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  const safeIndex = currentIndex < activeBanners.length ? currentIndex : 0;
  const currentBanner = activeBanners[safeIndex];
  if (!currentBanner) return null;

  return (
    <section className="relative min-h-[calc(100vh-5rem)] w-full bg-secondary overflow-hidden flex flex-col select-none group    ">
      {/* Floating Ambient Motion Orbs */}
      <div className="absolute top-1/4 left-1/4 size-96 bg-primary/15 rounded-full blur-[140px] pointer-events-none animate-pulse duration-[4000ms] z-0" />
      <div className="absolute bottom-1/3 right-1/4 size-96 bg-white/10 rounded-full blur-[160px] pointer-events-none animate-pulse duration-[6000ms] z-0" />

      {/* Background Image Carousel Layers */}
      <div className="absolute inset-0 z-0">
        {activeBanners.map((banner, idx) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === safeIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
          >
            {/* Ken Burns Zoom Effect */}
            <Image
              fill
              unoptimized
              priority={idx === 0}
              alt={banner.title}
              className={`object-contain object-center transform transition-all duration-[8000ms] ease-out ${mounted && idx === safeIndex ? "scale-115" : "scale-100"
                }`}
              src={banner.image_url}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent" />
          </div>
        ))}
      </div>

      {/* Main Hero Content: Tối ưu khoảng cách vừa vặn, sang trọng sau khi lược bỏ Coupon */}
      <div className="relative z-20 flex-1 w-full max-w-7xl mx-auto px-4 md:px-10 flex flex-col justify-center py-20 my-auto">
        <div key={currentBanner.id} className="w-full lg:w-2/3 space-y-6 sm:space-y-7">
          {/* Badge */}
          {currentBanner.badge_text && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out" style={{ animationFillMode: "backwards" }}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest border border-white/20 shadow-sm">
                {currentBanner.badge_text}
              </span>
            </div>
          )}

          {/* Title */}
          <h1
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.12] tracking-tight whitespace-pre-line drop-shadow-sm animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 ease-out"
            style={{ animationFillMode: "backwards" }}
          >
            {currentBanner.title}
          </h1>

          {/* Description */}
          {currentBanner.description && (
            <p
              className="text-base sm:text-lg lg:text-xl text-gray-200 max-w-xl line-clamp-3 font-normal opacity-90 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 ease-out"
              style={{ animationFillMode: "backwards" }}
            >
              {currentBanner.description}
            </p>
          )}

          {/* Call to action (Giữ đúng màu gốc bg-primary, căn chỉnh pt-4 để cân bằng bố cục) */}
          {currentBanner.link_url && (
            <div
              className="pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 ease-out"
              style={{ animationFillMode: "backwards" }}
            >
              <Link
                href={currentBanner.link_url}
                className="inline-flex items-center justify-center gap-2.5 bg-primary hover:bg-primary/90 text-primary-foreground px-9 py-4.5 rounded-full font-bold shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 text-sm tracking-wide uppercase group/btn"
              >
                <span>Khám phá ngay</span>
                <ChevronRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Left/Right Arrows (Màu gốc) */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)}
            aria-label="Previous Slide"
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 size-12 sm:size-14 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 border border-white/10"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % activeBanners.length)}
            aria-label="Next Slide"
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 size-12 sm:size-14 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 border border-white/10"
          >
            <ChevronRight className="size-6" />
          </button>
        </>
      )}

      {/* Carousel Indicators (Màu gốc bg-primary) */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-30">
          {activeBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentIndex
                ? "w-10 bg-primary shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                : "w-3 bg-white/40 hover:bg-white/70 hover:scale-125"
                }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
