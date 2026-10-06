"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const MotionImage = motion.create(Image);

const figureVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const imageTransition = { duration: 0.6 };

const templates = [
  {
    src: "/images/templates/neofolio/01.png",
    alt: "Neofolio Template",
    className: "hover:rotate-5",
    rotate: -10,
  },
  {
    src: "/images/templates/cosmic/01.png",
    alt: "Cosmic Template",
    className: "hover:-rotate-5",
    rotate: 5,
  },
  {
    src: "/images/templates/soho/01.png",
    alt: "Soho Template",
    className: "hover:-rotate-3",
    rotate: 10,
  },
];

export function TemplateStack() {
  return (
    <motion.figure
      className="relative grid grid-cols-3 gap-8 p-4"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={figureVariants}
    >
      {templates.map((template) => (
        <MotionImage
          key={template.src}
          src={template.src}
          alt={template.alt}
          width={400}
          height={300}
          sizes="(min-width: 768px) 220px, 30vw"
          className={cn(
            "aspect-4/3 rounded-md border object-cover transition-transform",
            template.className,
          )}
          variants={{
            hidden: { opacity: 0, y: 16, rotate: 0 },
            show: {
              opacity: 1,
              y: 0,
              rotate: template.rotate,
              transition: imageTransition,
            },
          }}
        />
      ))}
    </motion.figure>
  );
}
