import { SearchIcon } from "lucide-react";

import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function EmptyComponent() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchIcon />
        </EmptyMedia>
        <EmptyTitle>No items found</EmptyTitle>
      </EmptyHeader>
    </Empty>
  );
}
