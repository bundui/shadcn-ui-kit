"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const users = [
  {
    id: "1",
    name: "Jane Cooper",
    initials: "JC",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: "2",
    name: "Devon Lane",
    initials: "DL",
    avatar: "https://i.pravatar.cc/150?img=6",
  },
  {
    id: "3",
    name: "Courtney Henry",
    initials: "CH",
    avatar: "https://i.pravatar.cc/150?img=7",
  },
  {
    id: "4",
    name: "Leslie Alexander",
    initials: "LA",
    avatar: "https://i.pravatar.cc/150?img=8",
  },
];

export default function AvatarComponent() {
  return (
    <AvatarGroup>
      <Avatar>
        <AvatarImage alt="Avatar 01" src="https://i.pravatar.cc/150?img=1" />
      </Avatar>
      <Avatar>
        <AvatarImage alt="Avatar 02" src="https://i.pravatar.cc/150?img=2" />
      </Avatar>
      <Avatar>
        <AvatarImage alt="Avatar 03" src="https://i.pravatar.cc/150?img=3" />
      </Avatar>
      <Avatar>
        <AvatarImage alt="Avatar 04" src="https://i.pravatar.cc/150?img=4" />
      </Avatar>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="ring-background bg-muted text-muted-foreground focus-visible:ring-ring z-1 flex size-8 items-center justify-center rounded-full text-sm ring-2 focus-visible:ring-2 focus-visible:outline-none"
          >
            +4
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          {users.map((user) => (
            <DropdownMenuItem key={user.id}>
              <Avatar size="sm">
                <AvatarImage alt={user.name} src={user.avatar} />
                <AvatarFallback>{user.initials}</AvatarFallback>
              </Avatar>
              <span className="truncate text-sm">{user.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </AvatarGroup>
  );
}
