import { Avatar, AvatarGroup, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const users = [
  {
    id: "1",
    name: "Jane Cooper",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "Devon Lane",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "3",
    name: "Courtney Henry",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: "4",
    name: "Leslie Alexander",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
];

export default function AvatarComponent() {
  return (
    <AvatarGroup>
      {users.map((user) => (
        <Tooltip key={user.id}>
          <TooltipTrigger asChild>
            <Avatar>
              <AvatarImage alt={user.name} src={user.avatar} />
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>{user.name}</TooltipContent>
        </Tooltip>
      ))}
    </AvatarGroup>
  );
}
