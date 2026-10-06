"use client";

import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Component() {
  const [framework, setFramework] = useState("nextjs");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Radio items
          <ChevronDownIcon
            aria-hidden="true"
            className="-me-1 opacity-60"
            size={16}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup onValueChange={setFramework} value={framework}>
          <DropdownMenuRadioItem value="nextjs">Next.js</DropdownMenuRadioItem>
          <DropdownMenuRadioItem disabled value="sveltekit">
            SvelteKit
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="remix">Remix</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="astro">Astro</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
