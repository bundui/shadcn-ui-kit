"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    title: "Beautiful Landscape",
    description: "Explore the wonders of nature"
  },
  {
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
    title: "Mountain View",
    description: "Experience breathtaking views"
  },
  {
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    title: "Forest Path",
    description: "Discover hidden trails"
  }
];

export default function CarouselComponent() {
  return (
    <Carousel className="w-full max-w-lg">
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index}>
            <div className="relative overflow-hidden rounded-lg">
              <figure>
                <Image
                  src={slide.image}
                  alt={slide.title}
                  width={800}
                  height={600}
                  className="aspect-video object-cover"
                />
              </figure>
              <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/40 to-transparent p-6">
                <h3 className="mb-1 text-lg font-semibold text-white">{slide.title}</h3>
                <p className="text-sm text-white/80">{slide.description}</p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
