"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Code, Globe, Zap } from "lucide-react";

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
    icon: Code
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
    icon: Zap
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
    icon: Globe
  },
  {
    value: "remix",
    label: "Remix",
    icon: Code
  },
  {
    value: "astro",
    label: "Astro",
    icon: Globe
  }
];

export default function Combobox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const selectedFramework = frameworks.find((framework) => framework.value === value);
  const Icon = selectedFramework?.icon;

  return (
    <div className="w-full max-w-xs">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between">
            <div className="flex items-center gap-2">
              {Icon && <Icon className="h-4 w-4" />}
              <span>
                {value
                  ? selectedFramework?.label
                  : "Select framework..."}
              </span>
            </div>
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Search framework..." className="h-9" />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {frameworks.map((framework) => {
                  const FrameworkIcon = framework.icon;
                  return (
                    <CommandItem
                      key={framework.value}
                      value={framework.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}>
                      <FrameworkIcon className="mr-2 h-4 w-4" />
                      {framework.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === framework.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

