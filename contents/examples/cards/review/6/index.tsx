"use client";

import * as React from "react";
import { StarIcon, MessageSquareIcon, SendIcon, HeartIcon } from "lucide-react";
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
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}>
              <StarIcon className="size-5 fill-amber-400 text-amber-400" />
            </span>
          </span>
        );
      })}
    </div>
  );
}

export default function ReviewCard() {
  const [liked, setLiked] = React.useState(false);

  return (
    <Card className="w-full shadow-none md:w-[700px]">
      <CardContent>
        <div className="flex gap-5">
          <div className="flex shrink-0 flex-col items-center gap-2">
            <img
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face"
              alt="Towhidur Rahman"
              className="size-16 rounded-xl object-cover"
            />
            <div className="text-center">
              <p className="text-sm font-bold leading-tight">
                Towhidur
                <br />
                Rahman
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Total Spend: <span className="font-bold text-foreground">$200</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Total Review: <span className="font-bold text-foreground">14</span>
              </p>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <Stars value={3} />
              <span className="text-sm text-muted-foreground">24-10-2022</span>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              My first and only order on Etsy, and I'm beyond delighted! I
              requested a custom piece based on two stones I was called to invite
              together in this kind of creation. The fun and genuine joy I invite
              together in this kind of creation. The fun and genuine joy.
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-1.5">
                  <MessageSquareIcon className="size-3.5" />
                  Public Comment
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-1.5">
                  <SendIcon className="size-3.5" />
                  Direct Message
                </Button>
              </div>
              <button
                onClick={() => setLiked((v) => !v)}
                className="text-muted-foreground transition-colors hover:text-foreground">
                <HeartIcon
                  className={cn(
                    "size-5",
                    liked && "fill-red-500 text-red-500"
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
