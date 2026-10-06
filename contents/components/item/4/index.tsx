import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Plus } from "lucide-react";

export default function ItemComponent() {
  return (
    <Item variant="outline" className="w-full max-w-sm">
      <ItemMedia>
        <Avatar className="size-10">
          <AvatarImage src="https://i.pravatar.cc/150?u=evilrabbit" />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Evil Rabbit</ItemTitle>
        <ItemDescription>Last seen 5 months ago</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          size="icon-sm"
          variant="outline"
          className="rounded-full"
          aria-label="Invite"
        >
          <Plus />
        </Button>
      </ItemActions>
    </Item>
  );
}
