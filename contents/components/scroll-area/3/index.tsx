"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: 2,
    name: "Sarah Miller",
    email: "sarah.miller@example.com",
    avatar: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    avatar: "https://i.pravatar.cc/150?img=3"
  },
  {
    id: 4,
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    avatar: "https://i.pravatar.cc/150?img=4"
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@example.com",
    avatar: "https://i.pravatar.cc/150?img=5"
  },
  {
    id: 6,
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    avatar: "https://i.pravatar.cc/150?img=6"
  },
  {
    id: 7,
    name: "Chris Taylor",
    email: "chris.taylor@example.com",
    avatar: "https://i.pravatar.cc/150?img=7"
  },
  {
    id: 8,
    name: "Amy Martinez",
    email: "amy.martinez@example.com",
    avatar: "https://i.pravatar.cc/150?img=8"
  },
  {
    id: 9,
    name: "Ryan Garcia",
    email: "ryan.garcia@example.com",
    avatar: "https://i.pravatar.cc/150?img=9"
  },
  {
    id: 10,
    name: "Jessica Lee",
    email: "jessica.lee@example.com",
    avatar: "https://i.pravatar.cc/150?img=10"
  }
];

export default function Example() {
  return (
    <ScrollArea className="h-96 max-w-xs w-full rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Users</h4>
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-0.5">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-muted-foreground text-xs">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}

