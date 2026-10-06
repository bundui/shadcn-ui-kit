"use client";

import { OTPInput, type SlotProps } from "input-otp";
import { useId } from "react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export default function Component() {
  const id = useId();
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>OTP input single</Label>
      <OTPInput
        containerClassName="flex items-center gap-3 has-disabled:opacity-50"
        id={id}
        maxLength={4}
        render={({ slots }) => (
          <div className="flex">
            {slots.map((slot, idx) => (
              <Slot key={String(idx)} {...slot} />
            ))}
          </div>
        )}
      />
    </div>
  );
}

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "border-input bg-background text-foreground relative -ms-px flex size-9 items-center justify-center border font-medium shadow-xs transition-[color,box-shadow] first:ms-0 first:rounded-s-md last:rounded-e-md",
        { "border-ring ring-ring/50 z-10 ring-[3px]": props.isActive }
      )}>
      {props.char !== null && <div>{props.char}</div>}
    </div>
  );
}
