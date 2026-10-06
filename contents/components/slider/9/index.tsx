"use client";

import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function SliderComponent() {
  const [value, setValue] = useState([3]);

  const emojis = ["😡", "🙁", "😐", "🙂", "😍"];
  const labels = ["Awful", "Poor", "Okay", "Good", "Amazing"];

  return (
    <div className="w-full max-w-xs">
      <div className="flex items-center gap-2">
        <Slider
          aria-label="Rate your experience"
          max={5}
          min={1}
          onValueChange={setValue}
          value={value}
        />
        <span className="text-2xl">{emojis[value[0] - 1]}</span>
      </div>
    </div>
  );
}
