"use client";

import { useId } from "react";
import { withMask } from "use-mask-input";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Component() {
  const id = useId();
  return (
    <div className="w-full max-w-sm *:not-first:mt-2">
      <Label htmlFor={id}>Timestamp</Label>
      <Input
        id={id}
        placeholder="00:00:00"
        ref={(input) => {
          if (input) {
            withMask("99:99:99", {
              placeholder: "-",
              showMaskOnHover: false
            })(input);
          }
        }}
        type="text"
      />
    </div>
  );
}
