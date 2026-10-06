"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const images = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop",
];

export default function CarouselComponent() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="flex w-full max-w-sm gap-2">
      <Carousel setApi={setApi} className="min-w-0 flex-1">
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index}>
              <figure>
                <Image
                  src={src}
                  alt={`Image ${index + 1}`}
                  width={800}
                  height={600}
                  className="aspect-4/3 w-full rounded-lg object-cover"
                />
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className="top-auto right-10 bottom-2 left-auto my-0 size-7 text-white hover:bg-white/10 hover:text-white"
          variant="ghost"
        />
        <CarouselNext
          className="top-auto right-2 bottom-2 my-0 size-7 text-white hover:bg-white/10 hover:text-white"
          variant="ghost"
        />
      </Carousel>
      <div className="grid w-16 shrink-0 grid-rows-4 gap-2">
        {images.map((src, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "overflow-hidden rounded-md border-2 transition-all",
              index === current
                ? "border-primary"
                : "border-transparent opacity-50"
            )}
          >
            <Image
              src={src}
              alt={`Thumbnail ${index + 1}`}
              width={160}
              height={120}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
