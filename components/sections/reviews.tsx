import { Badge } from "@/components/ui/badge";
import ReviewCard from "./review-card";
import ReviewsCarousel from "./reviews-carousel";
import { reviews } from "./reviews-data";

export default function ReviewsSection() {
  return (
    <section id="reviews" className="relative scroll-mt-28">
      <div className="container border-x px-0 pt-8 lg:pt-16">
        <header className="mx-auto mb-8 max-w-2xl space-y-2 text-center lg:mb-12">
          <Badge variant="outline">Reviews</Badge>
          <h2 className="font-heading font-semibold mb-4 text-xl text-balance lg:text-4xl/tight">
            What are people saying about the{" "}
            <span className="underline">Shadcn UI Kit</span>?
          </h2>
        </header>
        <ReviewsCarousel />
        <div className="hidden border-t sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b last:border-b-0 sm:border-e sm:last:col-span-2 sm:max-lg:nth-[2n]:border-e-0 sm:max-lg:last:border-e-0 lg:nth-[3n]:border-e-0 lg:nth-last-[-n+3]:border-b-0 lg:last:col-span-1"
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
