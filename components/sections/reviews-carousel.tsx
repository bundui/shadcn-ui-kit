"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import ReviewCard from "./review-card";
import { reviews } from "./reviews-data";

export default function ReviewsCarousel() {
  return (
    <Carousel
      opts={{ loop: true, align: "start" }}
      plugins={[
        AutoScroll({
          speed: 1,
          startDelay: 0,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
        }),
      ]}
      className="border-t sm:hidden"
    >
      <CarouselContent className="ml-0">
        {reviews.map((review) => (
          <CarouselItem key={review.id} className="basis-[85%] border-e pl-0">
            <ReviewCard review={review} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
