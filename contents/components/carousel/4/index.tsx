"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";

const images = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop"
];

export default function CarouselComponent() {
  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));

  return (
    <Carousel className="w-full max-w-xs" opts={{ loop: true }} plugins={[autoplay.current]}>
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
  );
}
