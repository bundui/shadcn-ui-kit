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

export default function ItemComponent() {
  return (
    <Item variant="outline" className="w-full max-w-xl">
      <ItemMedia>
        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
          <Avatar className="hidden sm:flex">
            <AvatarImage src="https://i.pravatar.cc/150?u=shadcn" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar className="hidden sm:flex">
            <AvatarImage
              src="https://i.pravatar.cc/150?u=maxleiter"
              alt="@maxleiter"
            />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src="https://i.pravatar.cc/150?u=evilrabbit"
              alt="@evilrabbit"
            />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
        </div>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>No Team Members</ItemTitle>
        <ItemDescription>
          Invite your team to collaborate on this project.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="sm" variant="outline">
          Invite
        </Button>
      </ItemActions>
    </Item>
  );
}
