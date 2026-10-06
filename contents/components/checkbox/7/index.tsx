import { useId } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Component() {
  const id = useId();
  return (
    <div className="flex items-start gap-2">
      <Checkbox aria-describedby={`${id}-description`} id={id} />
      <div className="grid grow gap-2">
        <Label htmlFor={id}>
          Label{" "}
          <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
            (Sublabel)
          </span>
        </Label>
        <p className="text-muted-foreground text-xs" id={`${id}-description`}>
          You can use this checkbox with a label and a description.
        </p>
      </div>
    </div>
  );
}
