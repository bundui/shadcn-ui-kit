import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function BadgeComponent() {
  return (
    <Avatar size="lg">
      <AvatarImage alt="Toby Belhome" src="https://i.pravatar.cc/150?img=12" />
      <AvatarFallback>TB</AvatarFallback>
      <Badge className="border-background absolute -top-1 left-full z-10 min-w-5 -translate-x-3.5 px-1">
        3
      </Badge>
    </Avatar>
  );
}
