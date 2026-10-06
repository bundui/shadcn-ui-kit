"use client";

import { useState } from "react";
import { ReplyIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton
} from "@/components/ui/input-group";

export default function CollapsibleComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState("");

  return (
    <div className="w-full max-w-md space-y-4 rounded-lg border p-4">
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarImage src="https://i.pravatar.cc/150?img=1" alt="User" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">John Doe</span>
            <span className="text-muted-foreground text-xs">2 hours ago</span>
          </div>
          <p className="text-sm">
            Just finished building an amazing new feature! What do you think about it?
          </p>
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 gap-2">
                <span className="text-xs">Reply</span>
                <ReplyIcon className="h-3 w-3" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <form className="space-y-2">
                <InputGroup>
                  <InputGroupInput placeholder="Write your comment..." />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton variant="default">Send</InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </form>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}
