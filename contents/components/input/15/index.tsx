"use client";

import { useId } from "react";

import { useCharacterLimit } from "@/hooks/use-character-limit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Component() {
  const id = useId();
  const maxLength = 50;
  const {
    value,
    characterCount,
    handleChange,
    maxLength: limit
  } = useCharacterLimit({ maxLength });

  return (
    <div className="w-full max-w-sm *:not-first:mt-2">
      <Label htmlFor={id}>Input with character limit</Label>
      <div className="relative">
        <Input
          aria-describedby={`${id}-description`}
          className="peer pe-14"
          id={id}
          maxLength={maxLength}
          onChange={handleChange}
          type="text"
          value={value}
        />
        <div
          aria-live="polite"
          className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-xs tabular-nums peer-disabled:opacity-50"
          id={`${id}-description`}
          role="status">
          {characterCount}/{limit}
        </div>
      </div>
    </div>
  );
}
