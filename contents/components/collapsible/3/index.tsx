"use client";

import { useState } from "react";
import { ChevronDownIcon, SettingsIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CollapsibleComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full max-w-sm">
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer">
            <CardTitle>Settings</CardTitle>
            <CardAction>
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </CardAction>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-2">Card content</CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
