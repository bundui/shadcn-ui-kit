"use client";

import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sparkles,
  UserIcon,
  UserMinusIcon,
  CheckCircleIcon,
  SearchIcon,
  FilterIcon,
  XIcon,
} from "lucide-react";

const actions = [
  {
    name: "Assign to Simon Prusin",
    icon: Avatar,
    avatar: "https://i.pravatar.cc/150?img=1",
    shortcut: null,
  },
  {
    name: "Assign to...",
    icon: UserIcon,
    shortcut: "A",
  },
  {
    name: "Un-assign",
    icon: UserMinusIcon,
    shortcut: "U",
  },
];

const keywordResults = [
  {
    name: "Simon Prusin",
    subtitle: "simonprusin@gmail.com",
    icon: Avatar,
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Sign up flow",
    subtitle: "Notion Page",
    icon: "N",
    type: "notion",
  },
  {
    name: "Sign up flow Design",
    subtitle: "MSP-10",
    icon: CheckCircleIcon,
    type: "task",
  },
  {
    name: "Sign up Error",
    subtitle: "MSD_10",
    icon: CheckCircleIcon,
    type: "task",
  },
];

export default function CommandComponent() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredActions = actions.filter((action) =>
    action.name.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredKeywords = keywordResults.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.subtitle?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="w-full max-w-md rounded-lg border shadow-md">
      <Command className="**:data-[slot=input-group]:border-border **:data-[slot=input-group]:bg-background">
        <div className="flex items-center gap-2 border-b px-3">
          <div className="flex-1">
            <CommandInput
              placeholder="Search or type a command..."
              value={search}
              onValueChange={setSearch}
              className="border-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <FilterIcon className="text-muted-foreground h-4 w-4" />
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setOpen(false)}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {!search && (
            <CommandGroup>
              <CommandItem onSelect={() => console.log("Smart search")}>
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span>Smart search</span>
                <CommandShortcut>⌘M</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          )}
          {filteredActions.length > 0 && (
            <CommandGroup heading="Actions">
              {filteredActions.map((action, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => {
                    console.log(`Action: ${action.name}`);
                    setOpen(false);
                  }}
                >
                  {action.avatar ? (
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={action.avatar} alt={action.name} />
                      <AvatarFallback>SP</AvatarFallback>
                    </Avatar>
                  ) : (
                    <action.icon className="h-4 w-4" />
                  )}
                  <span>{action.name}</span>
                  {action.shortcut && (
                    <CommandShortcut>{action.shortcut}</CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {filteredKeywords.length > 0 && (
            <CommandGroup heading="Keyword">
              {filteredKeywords.map((item, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => {
                    console.log(`Selected: ${item.name}`);
                    setOpen(false);
                  }}
                >
                  {item.avatar ? (
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={item.avatar} alt={item.name} />
                      <AvatarFallback>
                        {item.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  ) : item.type === "notion" ? (
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-white text-xs font-bold text-black">
                      {item.icon && <item.icon />}
                    </div>
                  ) : (
                    <item.icon className="h-4 w-4 text-green-500" />
                  )}
                  <div className="flex flex-col">
                    <span>{item.name}</span>
                    {item.subtitle && (
                      <span className="text-muted-foreground text-xs">
                        {item.subtitle}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
        <div className="border-t px-3 py-2">
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <span>↑↓ Navigate</span>
              <span>← Confirm</span>
            </div>
            <span>esc Close</span>
          </div>
        </div>
      </Command>
    </div>
  );
}
