"use client";

import { type Tag, TagInput } from "emblor";
import { useId, useState } from "react";

import { Label } from "@/components/ui/label";

const tags = [
  {
    id: "1",
    text: "Red"
  }
];

export default function Component() {
  const id = useId();
  const [exampleTags, setExampleTags] = useState<Tag[]>(tags);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  return (
    <div className="w-full max-w-sm *:not-first:mt-2">
      <Label htmlFor={id}>Input with inner tags</Label>
      <TagInput
        activeTagIndex={activeTagIndex}
        id={id}
        placeholder="Add a tag"
        setActiveTagIndex={setActiveTagIndex}
        setTags={(newTags) => {
          setExampleTags(newTags);
        }}
        styleClasses={{
          inlineTagsContainer:
            "border-input rounded-md bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring outline-none focus-within:ring-[3px] focus-within:ring-ring/50 p-1 gap-1",
          input: "w-full min-w-[80px] shadow-none px-2 h-7",
          tag: {
            body: "h-7 relative bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
            closeButton:
              "absolute -inset-y-px -end-px p-0 rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground"
          }
        }}
        tags={exampleTags}
      />
      <p aria-live="polite" className="text-muted-foreground mt-2 text-xs" role="region">
        Built with{" "}
        <a
          className="hover:text-foreground underline"
          href="https://github.com/JaleelB/emblor"
          rel="noreferrer noopener nofollow"
          target="_blank">
          emblor
        </a>
      </p>
    </div>
  );
}
