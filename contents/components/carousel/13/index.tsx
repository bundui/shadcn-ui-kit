"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";

const images = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop"
];

export default function CarouselComponent() {
  const [api, setApi] = useState<CarouselApi>();
  const [progress, setProgress] = useState(0);
  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!api) {
      return;
    }

    const autoplayPlugin = api.plugins()?.autoplay;
    if (!autoplayPlugin) {
      return;
    }

    let interval: NodeJS.Timeout;

    const updateProgress = () => {
      const timeUntilNext = autoplayPlugin.timeUntilNext();
      if (timeUntilNext !== null) {
        const total = 4000;
        const remaining = timeUntilNext;
        const percentage = ((total - remaining) / total) * 100;
        setProgress(percentage);
      }
    };

    const startProgress = () => {
      clearInterval(interval);
      setProgress(0);
      interval = setInterval(updateProgress, 50);
    };

    const handleSelect = () => {
      autoplayPlugin.reset();
      startProgress();
    };

    startProgress();

    api.on("select", handleSelect);

    return () => {
      clearInterval(interval);
      api.off("select", handleSelect);
    };
  }, [api]);

  return (
    <div className="w-full max-w-xs">
      <Carousel
        setApi={setApi}
        className="w-full"
        plugins={[autoplay.current]}
        opts={{
          loop: true
        }}>
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index}>
              <figure>
                <Image
                  src={src}
                  alt={`Image ${index + 1}`}
                  width={800}
                  height={600}
                  className="aspect-4/3 rounded-lg object-cover"
                />
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="bg-muted mt-4 h-1 w-full overflow-hidden rounded-full">
        <div
          ref={progressRef}
          className="bg-primary h-full transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
