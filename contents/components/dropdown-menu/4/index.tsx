import {
  BoltIcon,
  ChevronDownIcon,
  CopyPlusIcon,
  FilesIcon,
  Layers2Icon,
  TrashIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Component() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Grouped items
          <ChevronDownIcon
            aria-hidden="true"
            className="-me-1 opacity-60"
            size={16}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <CopyPlusIcon aria-hidden="true" className="opacity-60" size={16} />
            Copy
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BoltIcon aria-hidden="true" className="opacity-60" size={16} />
            Edit
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Layers2Icon aria-hidden="true" className="opacity-60" size={16} />
            Group
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FilesIcon aria-hidden="true" className="opacity-60" size={16} />
            Clone
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive">
            <TrashIcon aria-hidden="true" size={16} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
