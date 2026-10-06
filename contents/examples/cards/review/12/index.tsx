"use client";

import * as React from "react";
import { StarIcon, Share2Icon, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.min(Math.max(value - i, 0), 1);
        return (
          <span key={i} className="relative inline-block size-4">
            <StarIcon className="size-4 fill-muted text-muted" />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}>
              <StarIcon className="size-4 fill-amber-400 text-amber-400" />
            </span>
          </span>
        );
      })}
    </div>
  );
}

const advantages = [
  "Fast and reliable shipping",
  "Excellent build quality",
  "Great value for money",
];

const disadvantages = [
  "Limited color options",
  "Slightly bulky design",
  "No carrying case included",
];

export default function ReviewCard() {
  const [votes, setVotes] = React.useState(12);
  const [vote, setVote] = React.useState<"up" | "down" | null>(null);

  function handleVote(type: "up" | "down") {
    if (vote === type) {
      setVote(null);
      type === "up" ? setVotes((n) => n - 1) : setVotes((n) => n + 1);
    } else {
      if (vote === "up") setVotes((n) => n - 1);
      if (vote === "down") setVotes((n) => n + 1);
      setVote(type);
      type === "up" ? setVotes((n) => n + 1) : setVotes((n) => n - 1);
    }
  }

  return (
    <Card className="w-full shadow-none md:w-[380px]">
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
              alt="Joe Hawkins"
              className="size-10 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm font-semibold">Joe Hawkins</span>
                <span className="text-sm text-muted-foreground">gave it</span>
                <Stars value={4.5} />
              </div>
              <p className="text-xs text-muted-foreground">Nov 15, 2023</p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="icon"
            className="size-8 shrink-0 rounded-full text-primary">
            <Share2Icon className="size-3.5" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm font-semibold">Price</p>
            <p className="text-sm font-medium text-primary">Competitive</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Build Quality</p>
            <p className="text-sm font-medium text-primary">Excellent</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold">Advantages</p>
            {advantages.map((item) => (
              <p key={item} className="text-xs text-muted-foreground">
                &bull; {item}
              </p>
            ))}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold">Disadvantages</p>
            {disadvantages.map((item) => (
              <p key={item} className="text-xs text-muted-foreground">
                &bull; {item}
              </p>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold">Comment</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Ordered these for a long-haul trip and they held up perfectly. Sound
            quality is impressive for the price point, and the noise cancellation
            works well in busy environments. Battery life exceeded expectations
            on back-to-back travel days.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-1">
          <Button
            variant="secondary"
            size="icon"
            className={cn(
              "size-9 rounded-full",
              vote === "up" && "bg-primary/10 text-primary"
            )}
            onClick={() => handleVote("up")}>
            <ArrowUpIcon className="size-4" />
          </Button>
          <span className="min-w-6 text-center text-sm font-medium">{votes}</span>
          <Button
            variant="secondary"
            size="icon"
            className={cn(
              "size-9 rounded-full",
              vote === "down" && "bg-primary/10 text-primary"
            )}
            onClick={() => handleVote("down")}>
            <ArrowDownIcon className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
