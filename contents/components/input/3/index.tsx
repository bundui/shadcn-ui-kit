import { useId } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Component() {
  const id = useId();
  return (
    <div className="max-w-sm w-full *:not-first:mt-2">
      <Label htmlFor={id}>Input with helper text</Label>
      <Input id={id} placeholder="Email" type="email" />
      <p aria-live="polite" className="text-muted-foreground mt-2 text-xs" role="region">
        We won&lsquo;t share your email with anyone
      </p>
    </div>
  );
}
