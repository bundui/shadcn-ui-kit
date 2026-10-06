"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArchiveIcon,
  CalendarPlusIcon,
  ClockIcon,
  ListFilterIcon,
  MailCheckIcon,
  MoreHorizontalIcon,
  TagIcon,
  Trash2Icon,
} from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";

export default function ButtonGroupComponent() {
  const [label, setLabel] = React.useState("personal");

  return (
    <ButtonGroup>
      <Button variant="outline">Save and Exit</Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="More Options">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <MailCheckIcon />
              Mark as Read
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ArchiveIcon />
              Archive
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <ClockIcon />
              Snooze
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CalendarPlusIcon />
              Add to Calendar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ListFilterIcon />
              Add to List
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <TagIcon />
                Label As...
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={label} onValueChange={setLabel}>
                  <DropdownMenuRadioItem value="personal">
                    Personal
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="work">
                    Work
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="other">
                    Other
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">
              <Trash2Icon />
              Trash
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
