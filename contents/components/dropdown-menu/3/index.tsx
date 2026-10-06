import { BoltIcon, ChevronDownIcon, CopyPlusIcon, FilesIcon, Layers2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function Component() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Menu with icons
          <ChevronDownIcon aria-hidden="true" className="-me-1 opacity-60" size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <CopyPlusIcon aria-hidden="true" className="opacity-60" size={16} />
          Copy
        </DropdownMenuItem>
        <DropdownMenuItem>
          <BoltIcon aria-hidden="true" className="opacity-60" size={16} />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Layers2Icon aria-hidden="true" className="opacity-60" size={16} />
          Group
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FilesIcon aria-hidden="true" className="opacity-60" size={16} />
          Clone
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
