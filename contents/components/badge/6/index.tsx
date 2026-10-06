import { CheckIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export default function Component() {
  return (
    <Badge variant="outline">
      <CheckIcon
        aria-hidden="true"
        className="text-emerald-600"
        data-icon="inline-start"
      />
      Completed
    </Badge>
  );
}
