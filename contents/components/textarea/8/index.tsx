"use client";

import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function TextareaComponent() {
  const [value, setValue] = useState("");
  const maxLength = 200;

  return (
    <div className="flex w-full max-w-sm flex-col gap-2 *:not-first:mt-2">
      <Label htmlFor="message">Message</Label>
      <Textarea
        id="message"
        maxLength={maxLength}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter your message here..."
        value={value}
      />
      <p className="text-muted-foreground text-right text-sm">
        {value.length}/{maxLength}
      </p>
    </div>
  );
}
