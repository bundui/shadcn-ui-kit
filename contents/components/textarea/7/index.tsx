"use client";

import { useId } from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function TextareaComponent() {
  const id = useId();
  return (
    <div className="w-full max-w-sm *:not-first:mt-2">
      <Label htmlFor={id}>Autogrowing textarea</Label>
      <Textarea
        className="field-sizing-content max-h-29.5 min-h-0 resize-none py-1.75"
        id={id}
        placeholder="Leave a comment"
      />
    </div>
  );
}
