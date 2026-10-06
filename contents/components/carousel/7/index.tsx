"use client";

import { StarIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    quote:
      "The component library saved us weeks of design work. The defaults look right out of the box and everything fits together.",
    author: "John Doe",
    initials: "JD",
    avatar: "https://i.pravatar.cc/150?img=11",
    role: "CEO at Nordwind",
    rating: 5,
  },
  {
    quote:
      "Clean code, thoughtful details and great documentation. Our design team adopted it in a single sprint.",
    author: "Jane Smith",
    initials: "JS",
    avatar: "https://i.pravatar.cc/150?img=32",
    role: "Product Designer at Loopline",
    rating: 5,
  },
  {
    quote:
      "Best developer experience I have had with a UI kit. Accessibility comes built in, which sealed the deal for us.",
    author: "Bob Johnson",
    initials: "BJ",
    avatar: "https://i.pravatar.cc/150?img=53",
    role: "Frontend Developer at Fieldset",
    rating: 4,
  },
];

export default function CarouselComponent() {
  return (
    <Carousel className="w-full max-w-md">
      <CarouselContent>
        {testimonials.map((testimonial, index) => (
          <CarouselItem key={index}>
            <div className="p-2">
              <Card className="bg-muted/50 shadow-none">
                <CardContent className="flex flex-col gap-4">
                  <div
                    aria-label={`Rating: ${testimonial.rating} out of 5`}
                    className="flex gap-0.5"
                    role="img"
                  >
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <StarIcon
                        aria-hidden="true"
                        className={cn(
                          "size-4",
                          starIndex < testimonial.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/40",
                        )}
                        key={starIndex}
                      />
                    ))}
                  </div>
                  <blockquote className="text-base leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <div className="mt-2 flex items-center gap-3">
                    <Avatar size="lg">
                      <AvatarImage
                        alt={testimonial.author}
                        src={testimonial.avatar}
                      />
                      <AvatarFallback>{testimonial.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">
                        {testimonial.author}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
