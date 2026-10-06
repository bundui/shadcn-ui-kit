"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js"
  },
  {
    value: "sveltekit",
    label: "SvelteKit"
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js"
  },
  {
    value: "remix",
    label: "Remix"
  },
  {
    value: "astro",
    label: "Astro"
  },
  {
    value: "gatsby",
    label: "Gatsby"
  }
];

export default function Combobox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue("");
  };

  return (
    <div className="w-full max-w-xs">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between">
            <span className={cn(!value && "text-muted-foreground")}>
              {value
                ? frameworks.find((framework) => framework.value === value)?.label
                : "Select framework..."}
            </span>
            <div className="flex items-center gap-1">
              {value && (
                <button
                  onClick={handleClear}
                  className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleClear(e as any);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}>
                  <X className="h-4 w-4" />
                </button>
              )}
              <ChevronsUpDown className="opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Search framework..." className="h-9" />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {frameworks.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}>
                    {framework.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === framework.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

