import {
  Heading1Icon,
  Heading2Icon,
  MinusIcon,
  PlusIcon,
  TextQuoteIcon,
  TypeIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Component() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Open edit menu"
          className="rounded-full shadow-none"
          size="icon"
          variant="ghost"
        >
          <PlusIcon aria-hidden="true" size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="pb-2">
        <DropdownMenuLabel>Add block</DropdownMenuLabel>
        <DropdownMenuItem>
          <div
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-md border bg-background"
          >
            <TypeIcon className="opacity-60" size={16} />
          </div>
          <div>
            <div className="font-medium text-sm">Text</div>
            <div className="text-muted-foreground text-xs">
              Start writing with plain text
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <div
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-md border bg-background"
          >
            <TextQuoteIcon className="opacity-60" size={16} />
          </div>
          <div>
            <div className="font-medium text-sm">Quote</div>
            <div className="text-muted-foreground text-xs">Capture a quote</div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <div
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-md border bg-background"
          >
            <MinusIcon className="opacity-60" size={16} />
          </div>
          <div>
            <div className="font-medium text-sm">Divider</div>
            <div className="text-muted-foreground text-xs">
              Visually divide blocks
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <div
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-md border bg-background"
          >
            <Heading1Icon className="opacity-60" size={16} />
          </div>
          <div>
            <div className="font-medium text-sm">Heading 1</div>
            <div className="text-muted-foreground text-xs">
              Big section heading
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <div
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-md border bg-background"
          >
            <Heading2Icon className="opacity-60" size={16} />
          </div>
          <div>
            <div className="font-medium text-sm">Heading 2</div>
            <div className="text-muted-foreground text-xs">
              Medium section subheading
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
