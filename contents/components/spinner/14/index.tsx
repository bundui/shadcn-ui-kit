import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";

export default function SpinnerComponent() {
  return (
    <Item variant="muted" className="w-full max-w-sm">
      <ItemMedia>
        <Spinner />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="line-clamp-1">Processing payment...</ItemTitle>
      </ItemContent>
      <ItemContent className="flex-none justify-end">
        <span className="text-sm tabular-nums">$100.00</span>
      </ItemContent>
    </Item>
  );
}
