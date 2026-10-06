import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { TooltipContent } from "@/components/ui/tooltip";

export default function TextareaComponent() {
  return (
    <div className="grid w-full max-w-sm gap-1.5 *:not-first:mt-2">
      <Label htmlFor="message">
        Your message{" "}
        <Tooltip>
          <TooltipTrigger asChild>
            <InfoIcon className="text-muted-foreground size-3" />
          </TooltipTrigger>
          <TooltipContent>
            <p>This is a tooltip</p>
          </TooltipContent>
        </Tooltip>
      </Label>
      <Textarea placeholder="Type your message here." id="message" />
    </div>
  );
}
