import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { ChevronDownIcon } from "lucide-react";

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Select <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuGroup>
          {people.map((person) => (
            <DropdownMenuItem key={person.username}>
              <Item size="xs" className="w-full flex-nowrap">
                <ItemMedia>
                  <Avatar>
                    <AvatarImage src={person.avatar} />
                    <AvatarFallback>{person.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                </ItemMedia>
                <ItemContent className="min-w-0 gap-0">
                  <ItemTitle>{person.username}</ItemTitle>
                  <ItemDescription className="line-clamp-1 leading-none">
                    {person.email}
                  </ItemDescription>
                </ItemContent>
              </Item>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
