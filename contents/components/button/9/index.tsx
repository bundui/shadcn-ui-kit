import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Component() {
  return (
    <Button className="aspect-square max-sm:p-0" variant="outline">
      <PlusIcon aria-hidden="true" className="opacity-60 sm:-ms-1" size={16} />
      <span className="max-sm:sr-only">Add new</span>
    </Button>
  );
}
