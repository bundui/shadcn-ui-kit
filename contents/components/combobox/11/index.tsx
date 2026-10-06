"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Clock } from "lucide-react";

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
  },
  {
    value: "solid",
    label: "Solid.js"
  },
  {
    value: "qwik",
    label: "Qwik"
  }
];

export default function Combobox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [recent, setRecent] = React.useState<string[]>([]);

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue;
    setValue(newValue);
    setOpen(false);

    if (newValue) {
      setRecent((prev) => {
        const filtered = prev.filter((v) => v !== newValue);
        return [newValue, ...filtered].slice(0, 3);
      });
    }
  };

  const recentFrameworks = recent
    .map((val) => frameworks.find((f) => f.value === val))
    .filter(Boolean) as typeof frameworks;

  const otherFrameworks = frameworks.filter((f) => !recent.includes(f.value));

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
              {recentFrameworks.length > 0 && (
                <CommandGroup heading="Recent">
                  {recentFrameworks.map((framework) => (
                    <CommandItem
                      key={framework.value}
                      value={framework.value}
                      onSelect={handleSelect}>
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
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
              )}
              <CommandGroup heading="All frameworks">
                {otherFrameworks.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={handleSelect}>
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

