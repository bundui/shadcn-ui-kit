"use client";

import { useId, useState } from "react";

import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { cn } from "@/lib/utils";

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
  }
];

export default function ComboboxComponent() {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>();

  return (
    <div className="w-full max-w-xs">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]">
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {value
                ? frameworks.find((framework) => framework.value === value)?.label
                : "Select framework..."}
            </span>
            <ChevronsUpDownIcon className="text-muted-foreground/80 shrink-0" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="border-input w-[var(--radix-popper-anchor-width)] p-0"
          align="start">
          <Command>
            <CommandInput placeholder="Find framework" />
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
                    {value === framework.value && <CheckIcon size={16} className="ml-auto" />}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <Button variant="ghost" className="w-full justify-start font-normal">
                  <PlusIcon className="-ms-2 opacity-60" aria-hidden="true" />
                  New framework
                </Button>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
