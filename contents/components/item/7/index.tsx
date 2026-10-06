import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { PlusIcon } from "lucide-react";

const people = [
  {
    username: "shadcn",
    avatar: "https://i.pravatar.cc/150?u=shadcn",
    email: "shadcn@vercel.com",
  },
  {
    username: "maxleiter",
    avatar: "https://i.pravatar.cc/150?u=maxleiter",
    email: "maxleiter@vercel.com",
  },
  {
    username: "evilrabbit",
    avatar: "https://i.pravatar.cc/150?u=evilrabbit",
    email: "evilrabbit@vercel.com",
  },
];

export default function ItemComponent() {
  return (
    <ItemGroup className="max-w-sm w-full gap-3">
      {people.map((person, index) => (
        <Item key={person.username} variant="outline">
          <ItemMedia>
            <Avatar>
              <AvatarImage src={person.avatar} className="grayscale" />
              <AvatarFallback>{person.username.charAt(0)}</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent className="gap-1">
            <ItemTitle>{person.username}</ItemTitle>
            <ItemDescription>{person.email}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="ghost" size="icon" className="rounded-full">
              <PlusIcon />
            </Button>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  );
}
