"use client";

import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command";
import { SettingsIcon, BellIcon, ShieldIcon, PaletteIcon, GlobeIcon, LockIcon } from "lucide-react";

const settings = [
  {
    category: "General",
    items: [
      { icon: SettingsIcon, label: "General Settings", path: "/settings/general" },
      { icon: BellIcon, label: "Notifications", path: "/settings/notifications" },
      { icon: GlobeIcon, label: "Language", path: "/settings/language" }
    ]
  },
  {
    category: "Security",
    items: [
      { icon: LockIcon, label: "Password", path: "/settings/password" },
      { icon: ShieldIcon, label: "Privacy", path: "/settings/privacy" }
    ]
  },
  {
    category: "Appearance",
    items: [{ icon: PaletteIcon, label: "Theme", path: "/settings/theme" }]
  }
];

export default function CommandComponent() {
  const [search, setSearch] = useState("");

  const filteredSettings = settings
    .map((category) => ({
      ...category,
      items: category.items.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase())
      )
    }))
    .filter((category) => category.items.length > 0);

  return (
    <div className="w-full max-w-md rounded-lg border shadow-md">
      <Command className="**:data-[slot=input-group]:border-border **:data-[slot=input-group]:bg-background">
        <CommandInput placeholder="Search settings..." value={search} onValueChange={setSearch} />
        <CommandList>
          <CommandEmpty>No settings found.</CommandEmpty>
          {filteredSettings.map((category, index) => (
            <div key={category.category}>
              <CommandGroup heading={category.category}>
                {category.items.map((item) => (
                  <CommandItem
                    key={item.path}
                    onSelect={() => {
                      console.log(`Navigate to: ${item.path}`);
                    }}>
                    <item.icon />
                    <span>{item.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              {index < filteredSettings.length - 1 && <CommandSeparator />}
            </div>
          ))}
        </CommandList>
      </Command>
    </div>
  );
}
