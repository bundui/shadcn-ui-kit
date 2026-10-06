"use client";

import { XIcon } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";

export default function Component() {
  const [badges, setBadges] = useState([
    { id: "react", label: "React" },
    { id: "tailwind", label: "Tailwind" },
    { id: "shadcn", label: "Shadcn" }
  ]);

  const handleRemove = (id: string) => {
    setBadges((prev) => prev.filter((badge) => badge.id !== id));
  };

  return (
    <div className="flex gap-2">
      {badges.map((badge) => (
        <Badge key={badge.id} className="gap-0 rounded-md px-2 py-1" variant="outline">
          {badge.label}
          <button
            aria-label="Delete"
            className="text-foreground/60 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 -my-[5px] -ms-0.5 -me-2 inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-[inherit] p-0 transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
            onClick={() => handleRemove(badge.id)}
            type="button">
            <XIcon aria-hidden="true" size={14} />
          </button>
        </Badge>
      ))}
    </div>
  );
}
