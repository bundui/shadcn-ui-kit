import { useId } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Component() {
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <Checkbox defaultChecked id={id} />
      <Label className="peer-data-[state=checked]:line-through" htmlFor={id}>
        Simple todo item
      </Label>
    </div>
  );
}
