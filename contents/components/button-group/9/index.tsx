import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BellIcon,
  ChevronDownIcon,
  EyeIcon,
  FlagIcon,
  GitForkIcon,
  ListPlusIcon,
  Share2Icon,
  StarIcon,
} from "lucide-react";

export default function ButtonGroupComponent() {
  return (
    <ButtonGroup>
      <Button variant="outline">
        <StarIcon aria-hidden="true" />
        <span>Star</span>
        <Badge variant="outline">2.4k</Badge>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <ChevronDownIcon aria-hidden="true" />
            <span className="sr-only">Toggle dropdown</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          <DropdownMenuItem>
            <EyeIcon aria-hidden="true" />
            Watch
          </DropdownMenuItem>
          <DropdownMenuItem>
            <GitForkIcon aria-hidden="true" />
            Fork
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ListPlusIcon aria-hidden="true" />
            Add to list
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Share2Icon aria-hidden="true" />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BellIcon aria-hidden="true" />
            Notifications
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <FlagIcon aria-hidden="true" />
            Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
