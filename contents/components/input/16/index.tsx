"use client";

import { XIcon } from "lucide-react";
import { useId, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Component() {
  const id = useId();
  const [inputValue, setInputValue] = useState("Click to clear");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClearInput = () => {
    setInputValue("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full max-w-sm *:not-first:mt-2">
      <Label htmlFor={id}>Input with clear button</Label>
      <div className="relative">
        <Input
          className="pe-9"
          id={id}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type something..."
          ref={inputRef}
          type="text"
          value={inputValue}
        />
        {inputValue && (
          <button
            aria-label="Clear input"
            className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleClearInput}
            type="button">
            <XIcon aria-hidden="true" size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
