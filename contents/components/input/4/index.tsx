import { useId } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Component() {
  const id = useId();
  return (
    <div className="max-w-sm w-full *:not-first:mt-2">
      <Label htmlFor={id}>Input with error</Label>
      <Input
        aria-invalid
        className="peer"
        defaultValue="invalid@email.com"
        id={id}
        placeholder="Email"
        type="email"
      />
      <p
        aria-live="polite"
        className="peer-aria-invalid:text-destructive mt-2 text-xs"
        role="alert">
        Email is invalid
      </p>
    </div>
  );
}
