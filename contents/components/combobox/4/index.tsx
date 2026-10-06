"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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
    group: "React",
    items: [
      {
        value: "next.js",
        label: "Next.js"
      },
      {
        value: "remix",
        label: "Remix"
      },
      {
        value: "gatsby",
        label: "Gatsby"
      }
    ]
  },
  {
    group: "Vue",
    items: [
      {
        value: "nuxt.js",
        label: "Nuxt.js"
      },
      {
        value: "vue",
        label: "Vue.js"
      }
    ]
  },
  {
    group: "Other",
    items: [
      {
        value: "sveltekit",
        label: "SvelteKit"
      },
      {
        value: "astro",
        label: "Astro"
      }
    ]
  }
];

export default function Combobox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const allFrameworks = frameworks.flatMap((group) => group.items);

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
              ? allFrameworks.find((framework) => framework.value === value)?.label
              : "Select framework..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Search framework..." className="h-9" />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              {frameworks.map((group) => (
                <CommandGroup key={group.group} heading={group.group}>
                  {group.items.map((framework) => (
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
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

