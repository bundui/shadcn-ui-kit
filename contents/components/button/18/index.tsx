"use client";

import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const options = [
  {
    description:
      "All commits from this branch will be added to the base branch via a commit version.",
    label: "Merge pull request"
  },
  {
    description:
      "The 6 commits from this branch will be combined into one commit in the base branch.",
    label: "Squash and merge"
  },
  {
    description: "The 6 commits from this branch will be rebased and added to the base branch.",
    label: "Rebase and merge"
  }
];

export default function Component() {
  const [selectedIndex, setSelectedIndex] = useState("0");

  return (
    <div className="divide-primary-foreground/30 inline-flex divide-x rounded-md shadow-xs rtl:space-x-reverse">
      <Button className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10">
        {options[Number(selectedIndex)].label}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Options"
            className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
            size="icon">
            <ChevronDownIcon aria-hidden="true" size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="max-w-64 md:max-w-xs"
          side="bottom"
          sideOffset={4}>
          <DropdownMenuRadioGroup onValueChange={setSelectedIndex} value={selectedIndex}>
            {options.map((option, index) => (
              <DropdownMenuRadioItem
                className="items-start [&>span]:pt-1.5"
                key={option.label}
                value={String(index)}>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">{option.label}</span>
                  <span className="text-muted-foreground text-xs">{option.description}</span>
                </div>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
