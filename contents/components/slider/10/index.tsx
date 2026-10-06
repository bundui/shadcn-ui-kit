"use client";

import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function SliderComponent() {
  const min_price = 5;
  const max_price = 1240;
  const [value, setValue] = useState([min_price, max_price]);

  const formatPrice = (price: number) => {
    return price === max_price ? `$${price.toLocaleString()}+` : `$${price.toLocaleString()}`;
  };

  return (
    <div className="w-full max-w-xs *:not-first:mt-3">
      <Label className="tabular-nums">
        From {formatPrice(value[0])} to {formatPrice(value[1])}
      </Label>
      <Slider
        aria-label="Price range slider"
        max={max_price}
        min={min_price}
        onValueChange={setValue}
        value={value}
      />
    </div>
  );
}
