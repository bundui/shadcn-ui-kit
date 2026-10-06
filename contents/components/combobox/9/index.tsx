"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

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

const allFrameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "gatsby", label: "Gatsby" },
  { value: "solid", label: "Solid.js" },
  { value: "qwik", label: "Qwik" }
];

export default function Combobox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [frameworks, setFrameworks] = React.useState(allFrameworks);

  React.useEffect(() => {
    if (search.length > 0) {
      setLoading(true);
      const timer = setTimeout(() => {
        const filtered = allFrameworks.filter((framework) =>
          framework.label.toLowerCase().includes(search.toLowerCase())
        );
        setFrameworks(filtered);
        setLoading(false);
      }, 300);
      return () => {
        clearTimeout(timer);
        setLoading(false);
      };
    } else {
      setFrameworks(allFrameworks);
    }
  }, [search]);

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
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search framework..."
              className="h-9"
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
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
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

