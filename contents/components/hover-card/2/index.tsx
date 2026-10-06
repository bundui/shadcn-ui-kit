import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";

export default function HoverCardComponent() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/100?img=12" />
            <AvatarFallback>TB</AvatarFallback>
          </Avatar>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-2.5">
          <Avatar className="size-10">
            <AvatarImage src="https://i.pravatar.cc/100?img=12" />
            <AvatarFallback>TB</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="">John Doe</h4>
            <p className="text-muted-foreground text-sm">
              The React Framework – created and maintained by @vercel.
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <CalendarDays className="text-muted-foreground size-3" />
              <span className="text-muted-foreground text-xs">Joined Dec 2021</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
