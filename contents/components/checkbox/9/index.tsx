import { useId } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Component() {
  const id = useId();
  return (
    <div className="relative flex w-full items-start gap-2 rounded-md border border-input p-4 shadow-xs outline-none has-data-[state=checked]:border-primary/50">
      <Checkbox
        aria-describedby={`${id}-description`}
        className="order-1 after:absolute after:inset-0"
        id={id}
      />
      <div className="grid grow gap-2">
        <Label htmlFor={id}>
          Label{" "}
          <span className="font-normal text-muted-foreground text-xs leading-[inherit]">
            (Sublabel)
          </span>
        </Label>
        <p className="text-muted-foreground text-xs" id={`${id}-description`}>
          A short description goes here.
        </p>
      </div>
    </div>
  );
}
