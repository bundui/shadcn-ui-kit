import { useId } from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Component() {
  const id = useId();
  return (
    <div className="w-full max-w-sm *:not-first:mt-2">
      <Label htmlFor={id}>Textarea with error</Label>
      <Textarea aria-invalid defaultValue="Hello!" id={id} placeholder="Leave a comment" />
      <p aria-live="polite" className="text-destructive mt-2 text-xs" role="alert">
        Message should be at least 10 characters
      </p>
    </div>
  );
}
