import { InfoIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText
} from "@/components/ui/input-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function Component() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupInput placeholder="example.com" className="pl-1!" />
      <InputGroupAddon>
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <Tooltip>
          <TooltipTrigger asChild>
            <InputGroupButton className="rounded-full" size="icon-xs">
              <InfoIcon />
            </InputGroupButton>
          </TooltipTrigger>
          <TooltipContent>This is content in a tooltip.</TooltipContent>
        </Tooltip>
      </InputGroupAddon>
    </InputGroup>
  );
}
