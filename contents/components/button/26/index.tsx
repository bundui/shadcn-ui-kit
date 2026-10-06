import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function Component() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button aria-label="Add new item" variant="outline" size="icon">
          <PlusIcon />
          <span className="sr-only">Add new item</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Add New Item</TooltipContent>
    </Tooltip>
  );
}
