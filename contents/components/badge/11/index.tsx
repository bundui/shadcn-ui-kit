import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { XIcon } from "lucide-react";

interface User {
  id: number;
  name: string;
  image: string;
}

const users: User[] = [
  {
    id: 1,
    name: "Alessandro",
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Jane Smith",
    image: "https://i.pravatar.cc/150?img=2",
  },
];

export default function BadgeComponent() {
  return (
    <div className="flex flex-wrap gap-2">
      {users.map((user) => (
        <Badge key={user.id} variant="outline" className="pr-1.5 pl-0.5">
          <Avatar className="size-4">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span>{user.name}</span>
          <button type="button">
            <XIcon className="size-3 cursor-pointer opacity-60 hover:opacity-100" />
          </button>
        </Badge>
      ))}
    </div>
  );
}
