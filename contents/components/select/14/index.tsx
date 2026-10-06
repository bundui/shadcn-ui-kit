"use client";

import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useId, useState } from "react";

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
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const frameworks = [
  {
    label: "Next.js",
    value: "next.js"
  },
  {
    label: "SvelteKit",
    value: "sveltekit"
  },
  {
    label: "Nuxt.js",
    value: "nuxt.js"
  },
  {
    label: "Remix",
    value: "remix"
  },
  {
    label: "Astro",
    value: "astro"
  },
  {
    label: "Angular",
    value: "angular"
  },
  {
    label: "Vue.js",
    value: "vue"
  },
  {
    label: "React",
    value: "react"
  },
  {
    label: "Ember.js",
    value: "ember"
  },
  {
    label: "Gatsby",
    value: "gatsby"
  },
  {
    label: "Eleventy",
    value: "eleventy"
  },
  {
    label: "SolidJS",
    value: "solid"
  },
  {
    label: "Preact",
    value: "preact"
  },
  {
    label: "Qwik",
    value: "qwik"
  },
  {
    label: "Alpine.js",
    value: "alpine"
  },
  {
    label: "Lit",
    value: "lit"
  }
];

export default function Component() {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  return (
    <div className="w-full max-w-xs">
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            aria-expanded={open}
            className="border-input bg-background hover:bg-background w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
            id={id}
            role="combobox"
            variant="outline">
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {value
                ? frameworks.find((framework) => framework.value === value)?.label
                : "Select framework"}
            </span>
            <ChevronDownIcon
              aria-hidden="true"
              className="text-muted-foreground/80 shrink-0"
              size={16}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="border-input w-full min-w-(--radix-popper-anchor-width) p-0">
          <Command>
            <CommandInput placeholder="Search framework..." />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {frameworks.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                    value={framework.value}>
                    {framework.label}
                    {value === framework.value && <CheckIcon className="ml-auto" size={16} />}
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
