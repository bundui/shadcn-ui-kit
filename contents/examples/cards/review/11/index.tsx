"use client";

import * as React from "react";
import { StarIcon, ThumbsUpIcon, ThumbsDownIcon } from "lucide-react";
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

export default function ReviewCard() {
  const [likes, setLikes] = React.useState(35);
  const [dislikes, setDislikes] = React.useState(2);
  const [vote, setVote] = React.useState<"like" | "dislike" | null>(null);

  function handleVote(type: "like" | "dislike") {
    if (vote === type) {
      setVote(null);
      type === "like" ? setLikes((n) => n - 1) : setDislikes((n) => n - 1);
    } else {
      if (vote === "like") setLikes((n) => n - 1);
      if (vote === "dislike") setDislikes((n) => n - 1);
      setVote(type);
      type === "like" ? setLikes((n) => n + 1) : setDislikes((n) => n + 1);
    }
  }

  return (
    <div className="w-full space-y-6 md:w-[520px]">
      <div className="space-y-3">
        <div className="flex items-center gap-2.5">
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face"
            alt="Ann D."
            className="size-10 rounded-full object-cover"
          />
          <div>
            <span className="text-sm font-semibold">Ann D.</span>
            <span className="ml-2 text-xs text-muted-foreground">2 days ago</span>
          </div>
        </div>

        <Stars value={3.5} />

        <div className="space-y-1">
          <p className="text-sm font-semibold">Great everyday sneakers</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            These shoes are incredibly comfortable right out of the box. I wore
            them on a full day of errands and my feet felt great the whole time.
            The material feels durable and the sole provides solid grip on both
            wet and dry surfaces. Really happy with this purchase.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground">
            Reply
          </Button>
          <button
            onClick={() => handleVote("like")}
            className={cn(
              "flex items-center gap-1 text-xs transition-colors",
              vote === "like"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}>
            <ThumbsUpIcon
              className={cn("size-3.5", vote === "like" && "fill-foreground")}
            />
            {likes}
          </button>
          <button
            onClick={() => handleVote("dislike")}
            className={cn(
              "flex items-center gap-1 text-xs transition-colors",
              vote === "dislike"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}>
            <ThumbsDownIcon
              className={cn("size-3.5", vote === "dislike" && "fill-foreground")}
            />
            {dislikes}
          </button>
        </div>
      </div>

      <div className="ml-10 space-y-2 border-l-2 pl-5">
        <div className="flex items-center gap-2.5">
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face"
            alt="Andrew G."
            className="size-9 rounded-full object-cover"
          />
          <div>
            <span className="text-sm font-semibold">Andrew G.</span>
            <span className="ml-2 text-xs text-muted-foreground">2 days ago</span>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Are these suitable for running or more casual use? I'm looking for
          something I can use on light jogs but also wear daily without looking
          too sporty.
        </p>
      </div>
    </div>
  );
}
