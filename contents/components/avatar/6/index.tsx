import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function AvatarComponent() {
  return (
    <Avatar>
      <AvatarImage alt="Kelly King" src="https://i.pravatar.cc/150?img=10" />
      <AvatarFallback>KK</AvatarFallback>
      <Badge className="border-background absolute -top-1.5 left-full z-10 min-w-5 -translate-x-3.5 px-1">
        6
      </Badge>
    </Avatar>
  );
}
