"use client";

import { type Tag, TagInput } from "emblor";
import { useId, useState } from "react";

import { Label } from "@/components/ui/label";

const tags = [
  {
    id: "1",
    text: "Sport"
  },
  {
    id: "2",
    text: "Coding"
  },
  {
    id: "3",
    text: "Travel"
  }
];

export default function Component() {
  const id = useId();
  const [exampleTags, setExampleTags] = useState<Tag[]>(tags);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  return (
    <div className="w-full max-w-sm *:not-first:mt-2">
      <Label htmlFor={id}>Input with tags</Label>
      <TagInput
        activeTagIndex={activeTagIndex}
        id={id}
        inlineTags={false}
        inputFieldPosition="top"
        placeholder="Add a tag"
        setActiveTagIndex={setActiveTagIndex}
        setTags={(newTags) => {
          setExampleTags(newTags);
        }}
        styleClasses={{
          input:
            "rounded-md transition-[color,box-shadow] placeholder:text-muted-foreground/70 focus-visible:border-ring outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          tag: {
            body: "relative h-7 bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
            closeButton:
              "absolute -inset-y-px -end-px p-0 rounded-s-none rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground"
          },
          tagList: {
            container: "gap-1"
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
