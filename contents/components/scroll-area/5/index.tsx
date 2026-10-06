"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const profiles = [
  {
    id: 1,
    name: "Elon Musk",
    avatar: "https://i.pravatar.cc/150?img=68",
    isActive: true
  },
  {
    id: 2,
    name: "Olivia Carter",
    avatar: "https://i.pravatar.cc/150?img=47",
    isActive: true
  },
  {
    id: 3,
    name: "Azumi Tanaka",
    avatar: "https://i.pravatar.cc/150?img=33",
    isActive: false
  },
  {
    id: 4,
    name: "Xander Ellis",
    avatar: "https://i.pravatar.cc/150?img=25",
    isActive: false
  },
  {
    id: 5,
    name: "Theo Black",
    avatar: "https://i.pravatar.cc/150?img=19",
    isActive: false
  },
  {
    id: 6,
    name: "David Gilmore",
    avatar: "https://i.pravatar.cc/150?img=51",
    isActive: false
  },
  {
    id: 7,
    name: "Gerard White",
    avatar: "https://i.pravatar.cc/150?img=45",
    isActive: false
  },
  {
    id: 8,
    name: "Sophia Martinez",
    avatar: "https://i.pravatar.cc/150?img=12",
    isActive: false
  },
  {
    id: 9,
    name: "James Wilson",
    avatar: "https://i.pravatar.cc/150?img=8",
    isActive: false
  },
  {
    id: 10,
    name: "Emma Brown",
    avatar: "https://i.pravatar.cc/150?img=29",
    isActive: false
  }
];

export default function Example() {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-4 pb-4">
        {profiles.map((profile) => (
          <div key={profile.id} className="flex flex-col items-center gap-2">
            <div
              className={`relative rounded-full p-0.5 ${
                profile.isActive ? "bg-green-500" : "bg-muted"
              }`}>
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback>
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
            <span className="text-xs font-medium">{profile.name}</span>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

