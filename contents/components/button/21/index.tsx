import { StarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Component() {
  return (
    <Button>
      <StarIcon aria-hidden="true" className="-ms-1 opacity-60" size={16} />
      <span className="flex items-baseline gap-2">
        Star
        <span className="text-primary-foreground/60 text-xs">729</span>
      </span>
    </Button>
  );
}
