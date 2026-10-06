import { ZapIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export default function Component() {
  return (
    <Badge>
      <ZapIcon aria-hidden="true" className="opacity-60" data-icon="inline-start" />
      Badge
    </Badge>
  );
}
