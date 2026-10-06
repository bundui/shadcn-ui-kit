import { useId } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Component() {
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} />
      <Label htmlFor={id}>
        I agree to the{" "}
        <a className="underline" href="https://shadcnuikit.com" rel="noreferrer" target="_blank">
          terms of service
        </a>
      </Label>
    </div>
  );
}
