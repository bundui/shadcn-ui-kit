"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Lock } from "lucide-react";

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
    label: "Next.js",
    disabled: false
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
    disabled: false
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
    disabled: true
  },
  {
    value: "remix",
    label: "Remix",
    disabled: false
  },
  {
    value: "astro",
    label: "Astro",
    disabled: true
  },
  {
    value: "gatsby",
    label: "Gatsby",
    disabled: false
  }
];

export default function Combobox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <div className="w-full max-w-xs">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between">
            {value
              ? frameworks.find((framework) => framework.value === value)?.label
              : "Select framework..."}
            <ChevronsUpDown className="opacity-50" />
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
                    disabled={framework.disabled}
                    onSelect={(currentValue) => {
                      if (!framework.disabled) {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }
                    }}>
                    <div className="flex items-center gap-2 flex-1">
                      {framework.disabled && <Lock className="h-3 w-3 text-muted-foreground" />}
                      <span className={cn(framework.disabled && "text-muted-foreground")}>
                        {framework.label}
                      </span>
                    </div>
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

