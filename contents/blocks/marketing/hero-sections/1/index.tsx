import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <div className="w-full mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-20 lg:max-w-7xl lg:px-8">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <div className="hidden sm:mb-4 sm:flex sm:justify-center">
            <div className="relative rounded-full border px-3 py-1 text-sm">
              Announcing our next round of funding.{" "}
              <Link href="#" className="font-semibold text-indigo-600">
                <span aria-hidden="true" className="absolute inset-0" />
                Read more
              </Link>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-foreground text-4xl leading-tight font-bold md:text-5xl">
              Empower Your Creativity with Innovative Tools
            </h1>
            <p className="text-muted-foreground mt-4 text-lg leading-relaxed text-balance">
              Unlock your potential with a suite of tools designed to transform
              your ideas into reality. Create, build, and inspire with ease
              while achieving stunning results that truly stand out.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-3">
              <Button size="lg" asChild>
                <Link href="#">Get started</Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="font-semibold"
                asChild
              >
                <Link href="#">
                  Learn more <ArrowRightIcon />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
