"use client";

import * as React from "react";
import {
  StarIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  MoreHorizontalIcon,
  CheckCircleIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const reviewImages = [
  "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=200&fit=crop",
];

export default function ReviewCard() {
  const [helpful, setHelpful] = React.useState(1);
  const [unhelpful, setUnhelpful] = React.useState(3);
  const [vote, setVote] = React.useState<"helpful" | "unhelpful" | null>(null);

  function handleVote(type: "helpful" | "unhelpful") {
    if (vote === type) {
      setVote(null);
      type === "helpful" ? setHelpful((n) => n - 1) : setUnhelpful((n) => n - 1);
    } else {
      if (vote === "helpful") setHelpful((n) => n - 1);
      if (vote === "unhelpful") setUnhelpful((n) => n - 1);
      setVote(type);
      type === "helpful" ? setHelpful((n) => n + 1) : setUnhelpful((n) => n + 1);
    }
  }

  return (
    <Card className="w-full shadow-none md:w-[360px]">
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face"
              alt="Somalie"
              className="size-9 rounded-full object-cover"
            />
            <span className="text-sm font-medium">By Somalie</span>
          </div>
          <Button variant="ghost" size="icon" className="size-7 text-muted-foreground">
            <MoreHorizontalIcon className="size-4" />
          </Button>
        </div>

        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              className={cn(
                "size-4",
                i < 1 ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
              )}
            />
          ))}
        </div>

        <div className="space-y-1.5">
          <p className="font-semibold">Best Audio Upgrade</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The soundbar with subwoofer has significantly upgraded my home
            theater system. The sound quality is incredible, and the setup was
            very straightforward. I love the wireless connectivity and the rich
            bass. Totally worth it.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>1 year ago</span>
          <span>•</span>
          <CheckCircleIcon className="size-3.5 text-emerald-500" />
          <span>Verified Purchase</span>
        </div>

        <div className="flex gap-2">
          {reviewImages.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Review photo ${i + 1}`}
              className="size-16 rounded-lg object-cover"
            />
          ))}
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleVote("helpful")}
              className={cn(
                "flex items-center gap-1.5 text-sm transition-colors",
                vote === "helpful"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}>
              <ThumbsUpIcon
                className={cn("size-4", vote === "helpful" && "fill-foreground")}
              />
              Helpful ({helpful})
            </button>
            <button
              onClick={() => handleVote("unhelpful")}
              className={cn(
                "flex items-center gap-1.5 text-sm transition-colors",
                vote === "unhelpful"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}>
              <ThumbsDownIcon
                className={cn("size-4", vote === "unhelpful" && "fill-foreground")}
              />
              Unhelpful ({unhelpful})
            </button>
          </div>
          <button className="text-sm font-medium text-primary hover:underline">
            Report
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
