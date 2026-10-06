import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SendIcon } from "lucide-react";

export default function PopoverComponent() {
  return (
    <Popover>
      <PopoverTrigger className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src="https://i.pravatar.cc/150?u=1" />
          <AvatarFallback>PJ</AvatarFallback>
        </Avatar>
        <div className="text-start">
          <div className="text-sm font-medium">Praveen Juge</div>
          <div className="text-muted-foreground text-xs">@praveenjuge</div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="grid w-80 gap-4 p-4 text-sm">
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarImage src="https://i.pravatar.cc/150?u=1" />
            <AvatarFallback>PJ</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">Praveen Juge</div>
            <div className="text-muted-foreground">hi@praveenjuge.com</div>
          </div>
        </div>
        <div className="text-muted-foreground">
          Praveen is designer that specialize in UI design, accessibility, CSS
          and design systems with a knack for pixel-perfect outcomes.
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            View Profile
          </Button>
          <Button className="flex-1">
            <SendIcon />
            Message
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
