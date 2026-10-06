"use client";

import { useId } from "react";
import { withMask } from "use-mask-input";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Component() {
  const id = useId();
  return (
    <div className="w-full max-w-sm *:not-first:mt-2">
      <Label htmlFor={id}>Input with mask</Label>
      <Input
        id={id}
        placeholder="AB12 CDE"
        ref={(input) => {
          if (input) {
            withMask("AA99 AAA", {
              placeholder: "",
              showMaskOnHover: false
            })(input);
          }
        }}
        type="text"
      />
    </div>
  );
}
