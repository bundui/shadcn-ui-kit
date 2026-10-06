"use client";

import * as React from "react";
import { StarIcon, ReplyIcon, Share2Icon, ThumbsUpIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.min(Math.max(value - i, 0), 1);
        return (
          <span key={i} className="relative inline-block size-5">
            <StarIcon className="size-5 fill-muted text-muted" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <StarIcon className="size-5 fill-amber-400 text-amber-400" />
            </span>
          </span>
        );
      })}
    </div>
  );
}

export default function ReviewCard() {
  const [likes, setLikes] = React.useState(20);
  const [liked, setLiked] = React.useState(false);

  function toggle() {
    setLiked((v) => !v);
    setLikes((n) => (liked ? n - 1 : n + 1));
  }

  return (
    <Card className="w-full shadow-none md:w-[600px]">
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face"
              alt="Guy Hawkins"
              className="size-11 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">Guy Hawkins</p>
              <p className="text-sm text-muted-foreground">22 Oct, 2020</p>
            </div>
          </div>
          <Stars value={3.5} />
        </div>

        <p className="text-muted-foreground leading-relaxed">
          Customer reviews influence choices, providing insights on product
          quality, service, and satisfaction. Honest feedback guides decisions,
          shaping consumer experiences.
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <ReplyIcon className="size-4" />
              Reply
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <Share2Icon className="size-4" />
              Share
            </Button>
          </div>
          <button
            onClick={toggle}
            className={cn(
              "flex items-center gap-1.5 text-sm transition-colors",
              liked ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}>
            <span>{likes}</span>
            <ThumbsUpIcon className={cn("size-4", liked && "fill-foreground")} />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
