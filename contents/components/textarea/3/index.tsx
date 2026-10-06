import { useId } from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function TextareaComponent() {
  const id = useId();
  return (
    <div className="w-full max-w-sm *:not-first:mt-2">
      <Label htmlFor={id}>Textarea with helper text</Label>
      <Textarea id={id} placeholder="Leave a comment" />
      <p
        aria-live="polite"
        className="mt-2 text-muted-foreground text-xs"
        role="region"
      >
        Please add as many details as you can
      </p>
    </div>
  );
}
