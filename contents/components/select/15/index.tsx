"use client";

import { CheckIcon, ChevronDownIcon, PlusIcon } from "lucide-react";
import { useId, useState } from "react";

import { cn } from "@/lib/utils";
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

const organizations = [
  {
    label: "Shadcn UI Kit",
    value: "shadcnuikit"
  },
  {
    label: "Bundui",
    value: "bundui"
  },
  {
    label: "Lens Themes",
    value: "lensthemes"
  }
];

export default function Component() {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("shadcnuikit");

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
                ? organizations.find((organization) => organization.value === value)?.label
                : "Select organization"}
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
            <CommandInput placeholder="Find organization" />
            <CommandList>
              <CommandEmpty>No organization found.</CommandEmpty>
              <CommandGroup>
                {organizations.map((organization) => (
                  <CommandItem
                    key={organization.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                    value={organization.value}>
                    {organization.label}
                    {value === organization.value && <CheckIcon className="ml-auto" size={16} />}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <Button className="w-full justify-start font-normal" variant="ghost">
                  <PlusIcon aria-hidden="true" className="-ms-2 opacity-60" size={16} />
                  New organization
                </Button>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
