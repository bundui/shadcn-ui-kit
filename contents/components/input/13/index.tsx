"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useId, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Component() {
  const id = useId();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <div className="w-full max-w-sm *:not-first:mt-2">
      <Label htmlFor={id}>Show/hide password input</Label>
      <div className="relative">
        <Input
          className="pe-9"
          id={id}
          placeholder="Password"
          type={isVisible ? "text" : "password"}
        />
        <button
          aria-controls="password"
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          onClick={toggleVisibility}
          type="button">
          {isVisible ? (
            <EyeOffIcon aria-hidden="true" size={16} />
          ) : (
            <EyeIcon aria-hidden="true" size={16} />
          )}
        </button>
      </div>
    </div>
  );
}
