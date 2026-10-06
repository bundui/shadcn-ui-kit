import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Component() {
  return (
    <Button aria-label="Add new item" className="rounded-full" size="icon" variant="outline">
      <PlusIcon aria-hidden="true" size={16} />
    </Button>
  );
}
