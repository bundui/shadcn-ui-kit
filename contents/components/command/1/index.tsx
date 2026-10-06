"use client";

import {
  ShoppingBagIcon,
  ShirtIcon,
  HomeIcon,
  Gamepad2Icon,
  BookIcon,
  HeartIcon
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";

export default function Example() {
  return (
    <div className="w-full max-w-md rounded-lg border shadow-md">
      <Command className="**:data-[slot=input-group]:border-border **:data-[slot=input-group]:bg-background">
        <CommandInput placeholder="Search categories..." />
        <CommandList>
          <CommandEmpty>No categories found.</CommandEmpty>
          <CommandGroup>
            <CommandItem>
              <ShoppingBagIcon />
              <span>Electronics</span>
            </CommandItem>
            <CommandItem>
              <ShirtIcon />
              <span>Clothing & Fashion</span>
            </CommandItem>
            <CommandItem>
              <HomeIcon />
              <span>Home & Garden</span>
            </CommandItem>
            <CommandItem>
              <Gamepad2Icon />
              <span>Sports & Outdoors</span>
            </CommandItem>
            <CommandItem>
              <HeartIcon />
              <span>Beauty & Personal Care</span>
            </CommandItem>
            <CommandItem>
              <BookIcon />
              <span>Books & Media</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
