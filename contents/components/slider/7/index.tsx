"use client";

import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function SliderComponent() {
  const [value, setValue] = useState([3]);

  const labels = ["Awful", "Poor", "Okay", "Good", "Amazing"];

  return (
    <div className="w-full max-w-xs space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Label className="leading-6">Rate your experience</Label>
        <span className="text-sm font-medium">{labels[value[0] - 1]}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-2xl">😡</span>
        <Slider
          aria-label="Rate your experience"
          max={5}
          min={1}
          onValueChange={setValue}
          value={value}
        />
        <span className="text-2xl">😍</span>
      </div>
    </div>
  );
}
