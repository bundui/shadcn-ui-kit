import { ArrowUpRightIcon, BellIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export default function BadgeComponent() {
  return (
    <Badge
      asChild
      className="bg-background h-9 gap-2.5 rounded-full p-1 ps-4"
      variant="outline"
    >
      <a href="#">
        <span className="flex shrink-0 items-center">
          <BellIcon aria-hidden="true" className="size-4" />
        </span>
        12+ New Updates
        <span className="bg-muted flex size-7 shrink-0 items-center justify-center rounded-full">
          <ArrowUpRightIcon aria-hidden="true" className="size-4" />
        </span>
      </a>
    </Badge>
  );
}
