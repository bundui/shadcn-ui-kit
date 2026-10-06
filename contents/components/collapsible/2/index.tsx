"use client";

import { useState } from "react";
import { ChevronDownIcon, FolderIcon, FileIcon, FolderOpenIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

export default function CollapsibleComponent() {
  const [srcOpen, setSrcOpen] = useState(false);
  const [componentsOpen, setComponentsOpen] = useState(false);
  const [utilsOpen, setUtilsOpen] = useState(false);

  return (
    <div className="w-full max-w-md space-y-1 rounded-md border p-2 font-mono text-sm">
      <Collapsible open={srcOpen} onOpenChange={setSrcOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="h-8 w-full justify-start gap-2 px-2">
            {srcOpen ? (
              <FolderOpenIcon className="text-primary h-4 w-4" />
            ) : (
              <FolderIcon className="h-4 w-4" />
            )}
            <span>src</span>
            <ChevronDownIcon
              className={`ml-auto h-3 w-3 transition-transform duration-200 ${srcOpen ? "rotate-180" : ""}`}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1 pl-6">
          <Collapsible open={componentsOpen} onOpenChange={setComponentsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="h-8 w-full justify-start gap-2 px-2">
                {componentsOpen ? (
                  <FolderOpenIcon className="text-primary h-4 w-4" />
                ) : (
                  <FolderIcon className="h-4 w-4" />
                )}
                <span>components</span>
                <ChevronDownIcon
                  className={`ml-auto h-3 w-3 transition-transform duration-200 ${componentsOpen ? "rotate-180" : ""}`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pl-6">
              <div className="hover:bg-muted flex items-center gap-2 rounded px-2 py-1.5 text-xs">
                <FileIcon className="h-3 w-3" />
                <span>button.tsx</span>
              </div>
              <div className="hover:bg-muted flex items-center gap-2 rounded px-2 py-1.5 text-xs">
                <FileIcon className="h-3 w-3" />
                <span>input.tsx</span>
              </div>
              <div className="hover:bg-muted flex items-center gap-2 rounded px-2 py-1.5 text-xs">
                <FileIcon className="h-3 w-3" />
                <span>card.tsx</span>
              </div>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible open={utilsOpen} onOpenChange={setUtilsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="h-8 w-full justify-start gap-2 px-2">
                {utilsOpen ? (
                  <FolderOpenIcon className="text-primary h-4 w-4" />
                ) : (
                  <FolderIcon className="h-4 w-4" />
                )}
                <span>utils</span>
                <ChevronDownIcon
                  className={`ml-auto h-3 w-3 transition-transform duration-200 ${utilsOpen ? "rotate-180" : ""}`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pl-6">
              <div className="hover:bg-muted flex items-center gap-2 rounded px-2 py-1.5 text-xs">
                <FileIcon className="h-3 w-3" />
                <span>helpers.ts</span>
              </div>
              <div className="hover:bg-muted flex items-center gap-2 rounded px-2 py-1.5 text-xs">
                <FileIcon className="h-3 w-3" />
                <span>constants.ts</span>
              </div>
            </CollapsibleContent>
          </Collapsible>
          <div className="hover:bg-muted flex items-center gap-2 rounded px-2 py-1.5 text-xs">
            <FileIcon className="h-3 w-3" />
            <span>app.tsx</span>
          </div>
          <div className="hover:bg-muted flex items-center gap-2 rounded px-2 py-1.5 text-xs">
            <FileIcon className="h-3 w-3" />
            <span>index.ts</span>
          </div>
        </CollapsibleContent>
      </Collapsible>
      <div className="hover:bg-muted flex items-center gap-2 rounded px-2 py-1.5 text-xs">
        <FileIcon className="h-3 w-3" />
        <span>package.json</span>
      </div>
      <div className="hover:bg-muted flex items-center gap-2 rounded px-2 py-1.5 text-xs">
        <FileIcon className="h-3 w-3" />
        <span>tsconfig.json</span>
      </div>
    </div>
  );
}
