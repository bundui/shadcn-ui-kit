"use client";

import { Slider } from "@/components/ui/slider";
import { useState } from "react";

export default function Example() {
  const [value, setValue] = useState([33]);

  return (
    <div className="w-full max-w-xs">
      <Slider value={value} onValueChange={setValue} max={100} step={1} />
    </div>
  );
}
