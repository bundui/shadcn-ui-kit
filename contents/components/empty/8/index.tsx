import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { IconWifiOff } from "@tabler/icons-react";

export default function EmptyComponent() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconWifiOff />
        </EmptyMedia>
        <EmptyTitle>No Internet Connection</EmptyTitle>
        <EmptyDescription>
          It seems you are offline. Check your internet connection and try again.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button size="sm">Try Again</Button>
      </EmptyContent>
    </Empty>
  );
}
