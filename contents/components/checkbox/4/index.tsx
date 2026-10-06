import { useId } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Component() {
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <Checkbox className="rounded-full" defaultChecked id={id} />
      <Label
        className="peer-data-[state=checked]:line-throgh after:bg-muted-foreground peer-data-[state=checked]:text-muted-foreground relative [--primary:var(--color-emerald-500)] after:absolute after:top-1/2 after:left-0 after:h-px after:w-full after:origin-bottom after:-translate-y-1/2 after:scale-x-0 after:transition-transform after:ease-in-out peer-data-[state=checked]:after:origin-bottom peer-data-[state=checked]:after:scale-x-100"
        htmlFor={id}>
        Fancy todo item
      </Label>
    </div>
  );
}
