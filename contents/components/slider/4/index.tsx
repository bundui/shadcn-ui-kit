"use client";

import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function SliderComponent() {
  const [value, setValue] = useState([25]);

  return (
    <div className="w-full max-w-xs space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Slider aria-label="Slider with output" onValueChange={setValue} value={value} />
        <output className="w-10 text-sm font-medium tabular-nums">{value[0]}</output>
      </div>
    </div>
  );
}
