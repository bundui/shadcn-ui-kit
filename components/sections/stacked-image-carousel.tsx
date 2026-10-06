"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const ROTATION_INTERVAL_MS = 2000;

type StackedImageCarouselProps = {
  images: string[];
  alt: string;
  className?: string;
  intervalMs?: number;
};

export function StackedImageCarousel({
  images,
  alt,
  className,
  intervalMs = ROTATION_INTERVAL_MS,
}: StackedImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [images.length, intervalMs]);

  const currentSrc = images[currentIndex] ?? images[0];

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
        <motion.div
          className="overflow-hidde absolute inset-0 z-10 rounded-xl"
          initial={false}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 24, scale: 0.98, filter: "blur(6px)" }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
                filter: "blur(0px)",
                transition: {
                  duration: 0.45,
                  ease: [0.25, 0.46, 0.45, 0.94],
                },
              }}
              exit={{
                opacity: 0,
                x: -24,
                scale: 0.98,
                filter: "blur(4px)",
                transition: { duration: 0.3, ease: "easeIn" },
              }}
            >
              <Image
                src={currentSrc}
                alt={alt}
                width={1000}
                height={1000}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="aspect-video rounded-xl border object-cover object-top dark:hidden"
              />
              <Image
                src={currentSrc.replace(".png", "-dark.png")}
                alt={alt}
                width={1000}
                height={1000}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="hidden aspect-video rounded-xl border object-cover object-top dark:block"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
