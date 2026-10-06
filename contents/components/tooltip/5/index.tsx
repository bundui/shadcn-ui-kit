import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function TooltipComponent() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="hover:bg-accent rounded-full p-2">
          <InfoIcon className="text-muted-foreground size-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>More information</p>
      </TooltipContent>
    </Tooltip>
  );
}
