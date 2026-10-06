import { BellIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export default function BadgeComponent() {
  return (
    <Badge
      className="bg-background h-9 gap-2.5 rounded-full p-1 pe-4"
      variant="outline"
    >
      <span className="bg-muted flex size-7 shrink-0 items-center justify-center rounded-full">
        <BellIcon aria-hidden="true" className="size-4" />
      </span>
      12+ New Updates
    </Badge>
  );
}
