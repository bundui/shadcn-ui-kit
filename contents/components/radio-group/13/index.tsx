"use client";

import { RiStarFill } from "@remixicon/react";
import { useId, useState } from "react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Component() {
  const id = useId();
  const [hoverRating, setHoverRating] = useState("");
  const [currentRating, setCurrentRating] = useState("");

  return (
    <fieldset className="space-y-4">
      <legend className="text-foreground text-sm leading-none font-medium">
        How would you rate this product?
      </legend>
      <RadioGroup className="inline-flex gap-0" onValueChange={setCurrentRating}>
        {["1", "2", "3", "4", "5"].map((value) => (
          <label
            className="group has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative cursor-pointer rounded p-0.5 outline-none has-focus-visible:ring-[3px]"
            key={value}
            onMouseEnter={() => setHoverRating(value)}
            onMouseLeave={() => setHoverRating("")}>
            <RadioGroupItem className="sr-only" id={`${id}-${value}`} value={value} />
            <RiStarFill
              className={`transition-all ${
                (hoverRating || currentRating) >= value ? "text-amber-500" : "text-input"
              } group-hover:scale-110`}
              size={24}
            />
            <span className="sr-only">
              {value} star{value === "1" ? "" : "s"}
            </span>
          </label>
        ))}
      </RadioGroup>
    </fieldset>
  );
}
