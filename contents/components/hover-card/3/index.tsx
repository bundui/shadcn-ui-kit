import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus, MessageCircle, User } from "lucide-react";

export default function HoverCardComponent() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="outline">
          <User /> View Profile
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-84">
        <div className="space-y-4">
          <div className="flex items-start justify-between space-x-4">
            <Avatar>
              <AvatarImage src="https://i.pravatar.cc/100?img=20" />
              <AvatarFallback>VC</AvatarFallback>
            </Avatar>
            <Button size="sm">Follow</Button>
          </div>
          <div className="space-y-1">
            <h4>Jane Barlow</h4>
            <p className="text-muted-foreground text-sm">
              The platform for frontend developers. Deploy your projects with the best developer
              experience.
            </p>
          </div>
          <div className="bg-muted flex items-center gap-4 rounded-md px-3 py-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold">1.2k</span>
              <span className="text-muted-foreground text-xs">Followers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold">342</span>
              <span className="text-muted-foreground text-xs">Following</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold">89</span>
              <span className="text-muted-foreground text-xs">Projects</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <UserPlus />
              Follow
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <MessageCircle />
              Message
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
