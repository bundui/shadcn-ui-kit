"use client";

import Link from "next/link";
import { FullscreenIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function FullscreenLink({ href }: { href: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          target="_blank"
          aria-label="Open in full screen"
          className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
        >
          <FullscreenIcon />
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        <p>Full screen</p>
      </TooltipContent>
    </Tooltip>
  );
}
