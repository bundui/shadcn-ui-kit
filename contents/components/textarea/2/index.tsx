import { useId } from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function TextareaComponent() {
  const id = useId();
  return (
    <div className="w-full max-w-sm *:not-first:mt-2">
      <Label htmlFor={id}>
        Required textarea <span className="text-destructive">*</span>
      </Label>
      <Textarea id={id} placeholder="Leave a message" required />
    </div>
  );
}
