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
import { FileIcon, FolderIcon, ImageIcon, FileTextIcon } from "lucide-react";

const files = [
  { name: "document.pdf", type: "pdf", icon: FileTextIcon },
  { name: "presentation.pptx", type: "presentation", icon: FileIcon },
  { name: "spreadsheet.xlsx", type: "spreadsheet", icon: FileIcon },
  { name: "photo.jpg", type: "image", icon: ImageIcon },
  { name: "archive.zip", type: "archive", icon: FolderIcon },
  { name: "notes.txt", type: "text", icon: FileTextIcon }
];

export default function CommandComponent() {
  const [search, setSearch] = useState("");

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Command className="w-full max-w-md rounded-lg border shadow-md **:data-[slot=input-group]:border-border **:data-[slot=input-group]:bg-background">
      <CommandInput
        placeholder="Search files..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No files found.</CommandEmpty>
        <CommandGroup heading="Files">
          {filteredFiles.map((file) => (
            <CommandItem
              key={file.name}
              onSelect={() => {
                console.log(`Opening: ${file.name}`);
              }}>
              <file.icon />
              <span>{file.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

