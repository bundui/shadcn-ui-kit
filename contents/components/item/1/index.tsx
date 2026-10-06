import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";

export default function ItemComponent() {
  return (
    <Item variant="outline" className="w-full max-w-sm">
      <ItemContent>
        <ItemTitle>Basic Item</ItemTitle>
        <ItemDescription>
          A simple item with title and description.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="outline" size="sm">
          Action
        </Button>
      </ItemActions>
    </Item>
  );
}
