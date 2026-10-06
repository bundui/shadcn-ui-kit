import { ArrowRightIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export default function BadgeComponent() {
  return (
    <Badge
      className="bg-background h-9 gap-0 rounded-full p-0"
      variant="outline"
    >
      <span className="flex h-full items-center border-e px-4 font-medium">
        AI Assistant
      </span>
      <a
        className="text-muted-foreground hover:text-foreground flex h-full items-center gap-1.5 px-4 transition-colors"
        href="#"
      >
        Discover More
        <ArrowRightIcon aria-hidden="true" className="size-4" />
      </a>
    </Badge>
  );
}
