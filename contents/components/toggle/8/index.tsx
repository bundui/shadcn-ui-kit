"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

export default function ToggleComponent() {
  const [isStarred, setIsStarred] = useState(false);
  return (
    <Toggle
      aria-label="Toggle star"
      pressed={isStarred}
      onPressedChange={setIsStarred}
      variant="outline"
      className="data-[state=on]:bg-yellow-500 data-[state=on]:text-yellow-950 data-[state=on]:*:[svg]:fill-yellow-950"
    >
      <Star />
      Star
    </Toggle>
  );
}

