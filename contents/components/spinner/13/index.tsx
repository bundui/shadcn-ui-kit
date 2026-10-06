import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";

export default function SpinnerComponent() {
  return (
    <Item variant="outline" className="w-full max-w-sm">
      <ItemMedia variant="icon" className="rounded-full">
        <Spinner />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Downloading (35%)</ItemTitle>
        <ItemDescription className="text-xs">129 MB / 1000 MB</ItemDescription>
      </ItemContent>
      <ItemActions className="hidden sm:flex">
        <Button size="xs" variant="destructive">
          Cancel
        </Button>
      </ItemActions>
    </Item>
  );
}
