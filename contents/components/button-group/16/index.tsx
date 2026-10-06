"use client";

import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon, Settings2Icon } from "lucide-react";

const users = [
  {
    id: "1",
    name: "Nathaniel H.",
    email: "nathaniel@example.com",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    initials: "NH",
  },
  {
    id: "2",
    name: "Elizabeth M.",
    email: "elizabeth@example.com",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    initials: "EM",
  },
  {
    id: "3",
    name: "Michael R.",
    email: "michael@example.com",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d",
    initials: "MR",
  },
  {
    id: "4",
    name: "Emily W.",
    email: "emily@example.com",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    initials: "EW",
  },
];

export default function ButtonGroupComponent() {
  const [selectedUserId, setSelectedUserId] = useState<string>("3");

  return (
    <ButtonGroup>
      <Select value={selectedUserId} onValueChange={setSelectedUserId}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Select user" />
        </SelectTrigger>
        <SelectContent position="popper" className="min-w-[200px]">
          <SelectGroup>
            <SelectLabel>Team Members</SelectLabel>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                <span className="flex items-center gap-2">
                  <Avatar className="size-5">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-[10px]">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{user.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button> Send</Button>
    </ButtonGroup>
  );
}
