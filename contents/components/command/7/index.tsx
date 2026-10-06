"use client";

import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FileIcon, TerminalIcon, UsersIcon, Sparkles } from "lucide-react";

type FilterType = "all" | "files" | "people" | "commands";

const aiPrompts = [
  { name: "Generate today sales summary", icon: Sparkles },
  { name: "Create action items based on today's forecast", icon: Sparkles }
];

const recentSearches = [
  { name: "My Inbox", subtitle: "Mail", icon: "📥" },
  { name: "Add new task", subtitle: "Personal Draft", icon: "➕" },
  { name: "Data Analyst Team", subtitle: "Group Chat", icon: "👥" }
];

const files = [
  { name: "document.pdf", type: "PDF" },
  { name: "spreadsheet.xlsx", type: "Excel" },
  { name: "presentation.pptx", type: "PowerPoint" },
  { name: "image.jpg", type: "Image" }
];

const commands = [
  { name: "New File", shortcut: "⌘N" },
  { name: "Save", shortcut: "⌘S" },
  { name: "Search", shortcut: "⌘K" },
  { name: "Settings", shortcut: "⌘," }
];

const people = [
  { name: "John Doe", email: "john@example.com" },
  { name: "Sarah Miller", email: "sarah@example.com" },
  { name: "Mike Johnson", email: "mike@example.com" },
  { name: "Emma Wilson", email: "emma@example.com" }
];

export default function CommandComponent() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");

  const getAllItems = () => {
    return [
      ...files.map((item) => ({ ...item, category: "files" })),
      ...people.map((item) => ({ ...item, category: "people" })),
      ...commands.map((item) => ({ ...item, category: "commands" }))
    ];
  };

  const getFilteredItems = () => {
    if (filter === "all") {
      const all = getAllItems();
      if (!search) return all;
      return all.filter(
        (item: any) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    const items = {
      files,
      people,
      commands
    }[filter];

    if (!search) return items;

    return items.filter(
      (item: any) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.email?.toLowerCase().includes(search.toLowerCase())
    );
  };

  const renderItems = () => {
    const items = getFilteredItems();

    if (filter === "all" && !search) {
      return (
        <>
          <CommandGroup heading="AI Prompts">
            {aiPrompts.map((item, index) => (
              <CommandItem key={index} onSelect={() => console.log(`AI: ${item.name}`)}>
                <item.icon className="text-purple-500" />
                <span>{item.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Recent Searches">
            {recentSearches.map((item, index) => (
              <CommandItem key={index} onSelect={() => console.log(`Recent: ${item.name}`)}>
                <span>{item.icon}</span>
                <div className="flex flex-col">
                  <span>{item.name}</span>
                  <span className="text-muted-foreground text-xs">{item.subtitle}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </>
      );
    }

    switch (filter) {
      case "files":
        return items.map((item: any, index: number) => (
          <CommandItem key={index} onSelect={() => console.log(`Open: ${item.name}`)}>
            <FileIcon />
            <span>{item.name}</span>
            <span className="text-muted-foreground ml-auto text-xs">{item.type}</span>
          </CommandItem>
        ));
      case "commands":
        return items.map((item: any, index: number) => (
          <CommandItem key={index} onSelect={() => console.log(`Run: ${item.name}`)}>
            <TerminalIcon />
            <span>{item.name}</span>
            <span className="text-muted-foreground ml-auto text-xs">{item.shortcut}</span>
          </CommandItem>
        ));
      case "people":
        return items.map((item: any, index: number) => (
          <CommandItem key={index} onSelect={() => console.log(`Contact: ${item.name}`)}>
            <UsersIcon />
            <div className="flex flex-col">
              <span>{item.name}</span>
              <span className="text-muted-foreground text-xs">{item.email}</span>
            </div>
          </CommandItem>
        ));
      case "all":
        return items.map((item: any, index: number) => {
          if (item.category === "files") {
            return (
              <CommandItem key={index} onSelect={() => console.log(`Open: ${item.name}`)}>
                <FileIcon />
                <span>{item.name}</span>
                <span className="text-muted-foreground ml-auto text-xs">{item.type}</span>
              </CommandItem>
            );
          }
          if (item.category === "people") {
            return (
              <CommandItem key={index} onSelect={() => console.log(`Contact: ${item.name}`)}>
                <UsersIcon />
                <div className="flex flex-col">
                  <span>{item.name}</span>
                  <span className="text-muted-foreground text-xs">{item.email}</span>
                </div>
              </CommandItem>
            );
          }
          if (item.category === "commands") {
            return (
              <CommandItem key={index} onSelect={() => console.log(`Run: ${item.name}`)}>
                <TerminalIcon />
                <span>{item.name}</span>
                <span className="text-muted-foreground ml-auto text-xs">{item.shortcut}</span>
              </CommandItem>
            );
          }
          return null;
        });
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg border shadow-md">
      <Command className="**:data-[slot=input-group]:border-border **:data-[slot=input-group]:bg-background">
        <CommandInput
          placeholder="Search or type a command..."
          value={search}
          onValueChange={setSearch}
        />
        <div className="border-b px-3 py-2">
          <ToggleGroup
            type="single"
            value={filter}
            onValueChange={(value) => value && setFilter(value as FilterType)}
            variant="outline"
            className="w-full justify-start">
            <ToggleGroupItem value="all" aria-label="All">
              All
            </ToggleGroupItem>
            <ToggleGroupItem value="files" aria-label="Files">
              Files
            </ToggleGroupItem>
            <ToggleGroupItem value="people" aria-label="People">
              Peoples
            </ToggleGroupItem>
            <ToggleGroupItem value="commands" aria-label="Commands">
              Commands
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {filter === "all" && !search ? (
            renderItems()
          ) : (
            <CommandGroup heading={filter.charAt(0).toUpperCase() + filter.slice(1)}>
              {renderItems()}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  );
}
