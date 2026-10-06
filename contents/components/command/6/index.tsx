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
import {
  CalendarIcon,
  MailIcon,
  MessageSquareIcon,
  FileIcon,
  ImageIcon,
  MusicIcon,
  VideoIcon
} from "lucide-react";

const quickActions = [
  {
    group: "Communication",
    items: [
      { icon: MailIcon, label: "New Email", shortcut: "⌘E" },
      { icon: MessageSquareIcon, label: "New Message", shortcut: "⌘M" },
      { icon: CalendarIcon, label: "New Event", shortcut: "⌘N" }
    ]
  },
  {
    group: "Media",
    items: [
      { icon: ImageIcon, label: "Upload Image", shortcut: "⌘I" },
      { icon: VideoIcon, label: "Upload Video", shortcut: "⌘V" },
      { icon: MusicIcon, label: "Upload Audio", shortcut: "⌘A" }
    ]
  },
  {
    group: "Documents",
    items: [{ icon: FileIcon, label: "New Document", shortcut: "⌘D" }]
  }
];

export default function CommandComponent() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full max-w-md rounded-lg border shadow-md">
      <Command className="**:data-[slot=input-group]:border-border **:data-[slot=input-group]:bg-background">
        <CommandInput placeholder="Search for actions..." />
        <CommandList>
          <CommandEmpty>No actions found.</CommandEmpty>
          {quickActions.map((group) => (
            <CommandGroup key={group.group} heading={group.group}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.label}
                  onSelect={() => {
                    console.log(`Action: ${item.label}`);
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
