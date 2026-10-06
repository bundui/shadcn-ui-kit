import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Component() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">With title</Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm py-3">
          <div className="space-y-1">
            <p className="text-sm font-medium">Tooltip with title</p>
            <p className="text-muted-foreground text-xs">
              Tooltips are made to be highly customizable, with features like dynamic placement,
              rich content, and a robust API. You can even use them as a full-featured dropdown menu
              by setting the <code>trigger</code> prop to <code>click</code>.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
