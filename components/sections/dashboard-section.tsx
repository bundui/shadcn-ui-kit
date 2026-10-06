"use client";

import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React, { useRef } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { dashboardData } from "./dashboard-data";

export { dashboardData };

export const ListItem = ({ item }: { item: any }) => {
  const [lightImage, darkImage] = item.image;

  return (
    <Link
      href={item.url}
      target="_blank"
      className="group hover:border-primary/40 block overflow-hidden rounded-lg border hover:opacity-85"
    >
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-sm">{item.name}</span>
        <span className="text-sm opacity-0 group-hover:opacity-100">
          View Demo
        </span>
      </div>
      <figure className="rounded-xl border-t">
        <Image
          width={300}
          height={300}
          src={darkImage}
          className="hidden aspect-3/2 w-full rounded-tl-md rounded-tr-lg shadow-2xl dark:block"
          alt={`shadcn ui ${item.name.toLocaleLowerCase()} admin dashboard template`}
          loading="lazy"
        />
        <Image
          width={300}
          height={300}
          src={lightImage}
          className="block aspect-3/2 w-full rounded-tl-md rounded-tr-lg shadow-2xl dark:hidden"
          alt={`shadcn ui ${item.name.toLocaleLowerCase()} admin dashboard template dark`}
          loading="lazy"
        />
      </figure>
    </Link>
  );
};

export default function DashboardSection() {
  const autoplay = useRef(Autoplay({ delay: 2000, stopOnInteraction: false }));
  const sectionRef = React.useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef}>
      <div className="container space-y-4 border-x py-8 lg:py-16">
        <header className="mx-auto max-w-5xl space-y-3 text-center lg:mb-8">
          <h2 className="font-heading font-semibold mx-auto max-w-2xl text-xl text-balance lg:text-4xl/tight">
            Admin Dashboard Templates
          </h2>
          <p className="text-muted-foreground mx-auto text-balance md:text-lg">
            Includes {dashboardData.dashboards.length} production-ready admin
            dashboards, {dashboardData.apps.length + dashboardData.aiApps.length}{" "}
            fully built web applications, and {dashboardData.subpages}+ additional
            subpages. Comes equipped with
            tables, menus, forms, charts, and a wide range of essential features
            and components, so there’s no need to build everything from scratch.
            This ready-made dashboard template helps you save dozens of
            development hours and significantly reduce costs. Built with Next.js
            16, React 19, shadcn/ui, and Tailwind CSS v4, and continuously
            updated to stay aligned with the latest ecosystem improvements and
            best practices.
            <br />
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Button size="lg" asChild>
              <Link href="https://shadcnuikit.com/pricing">Get All Access</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link target="_blank" href="/admin-dashboard">
                Learn More
                <span className="sr-only"> about admin dashboards</span>
                <ExternalLinkIcon />
              </Link>
            </Button>
          </div>
        </header>

        <Carousel plugins={[autoplay.current]} opts={{ loop: true }}>
          <CarouselContent>
            {dashboardData.dashboards.map((item, key: number) => (
              <CarouselItem className="basis-2/3 md:basis-1/3" key={key}>
                <ListItem item={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-2 pt-4">
            <CarouselPrevious className="top-1/2 left-2 size-9 translate-x-0 -translate-y-1/2 2xl:-left-10" />
            <CarouselNext className="top-1/2 right-2 size-9 translate-x-0 -translate-y-1/2 2xl:-right-10" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
