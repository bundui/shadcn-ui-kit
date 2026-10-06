"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function SliderComponent() {
  const minValue = 0;
  const maxValue = 200;
  const steps = 5;
  const [value, setValue] = useState([100]);

  const decreaseValue = () => setValue((prev) => [Math.max(minValue, prev[0] - steps)]);
  const increaseValue = () => setValue((prev) => [Math.min(maxValue, prev[0] + steps)]);

  return (
    <div className="w-full max-w-xs *:not-first:mt-3">
      <Label className="tabular-nums">{value[0]} credits/mo</Label>
      <div className="flex items-center gap-4">
        <div>
          <Button
            aria-label="Decrease value"
            className="size-8"
            disabled={value[0] === 0}
            onClick={decreaseValue}
            size="icon"
            variant="outline">
            <MinusIcon aria-hidden="true" size={16} />
          </Button>
        </div>
        <Slider
          aria-label="Dual range slider with buttons"
          className="grow"
          max={maxValue}
          min={minValue}
          onValueChange={setValue}
          step={steps}
          value={value}
        />
        <div>
          <Button
            aria-label="Increase value"
            className="size-8"
            disabled={value[0] === 200}
            onClick={increaseValue}
            size="icon"
            variant="outline">
            <PlusIcon aria-hidden="true" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
