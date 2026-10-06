import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function Component() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Light</Button>
      </TooltipTrigger>
      <TooltipContent className="bg-neutral-200 text-neutral-950 dark:bg-neutral-50 [&_svg]:bg-neutral-200 [&_svg]:fill-neutral-200 dark:[&_svg]:bg-neutral-50 dark:[&_svg]:fill-neutral-50">
        <p>This tooltip will be always light</p>
      </TooltipContent>
    </Tooltip>
  );
}
