"use client";

import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { FileIcon, FolderIcon, SettingsIcon, UserIcon, SearchIcon, HomeIcon } from "lucide-react";

export default function CommandComponent() {
  const [open, setOpen] = useState(false);

  const commands = [
    {
      group: "Navigation",
      items: [
        { icon: HomeIcon, label: "Home", shortcut: "⌘H" },
        { icon: FileIcon, label: "Documents", shortcut: "⌘D" },
        { icon: FolderIcon, label: "Projects", shortcut: "⌘P" }
      ]
    },
    {
      group: "Actions",
      items: [
        { icon: SearchIcon, label: "Search", shortcut: "⌘K" },
        { icon: SettingsIcon, label: "Settings", shortcut: "⌘," },
        { icon: UserIcon, label: "Profile", shortcut: "⌘U" }
      ]
    }
  ];

  return (
    <div className="w-full max-w-md rounded-lg border shadow-md">
      <Command className="**:data-[slot=input-group]:border-border **:data-[slot=input-group]:bg-background">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {commands.map((group) => (
            <CommandGroup key={group.group} heading={group.group}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.label}
                  onSelect={() => {
                    console.log(`Selected: ${item.label}`);
                    setOpen(false);
                  }}>
                  <item.icon />
                  <span>{item.label}</span>
                  <CommandShortcut>{item.shortcut}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </div>
  );
}
