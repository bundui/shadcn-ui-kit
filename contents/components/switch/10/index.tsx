import { useId } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SwitchComponent() {
  const id = useId();
  return (
    <div className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
      <Switch
        aria-describedby={`${id}-description`}
        className="order-1 after:inset-0"
        id={id}
        size="sm"
      />
      <div className="grid grow gap-2">
        <Label htmlFor={id}>
          Label{" "}
          <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
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
