"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Component() {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label={copied ? "Copied" : "Copy to clipboard"}
            className="disabled:opacity-100"
            disabled={copied}
            onClick={handleCopy}
            size="icon"
            variant="outline">
            <div
              className={cn(
                "transition-all",
                copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
              )}>
              <CheckIcon aria-hidden="true" className="stroke-emerald-500" size={16} />
            </div>
            <div
              className={cn(
                "absolute transition-all",
                copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
              )}>
              <CopyIcon aria-hidden="true" size={16} />
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs">Click to copy</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
