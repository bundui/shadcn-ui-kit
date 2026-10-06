import { ChevronLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

export default function Component() {
  return (
    <ButtonGroup aria-label="Pagination">
      <Button aria-label="Previous" variant="outline" size="icon">
        <ChevronLeftIcon />
      </Button>
      <Button aria-label="Previous" variant="outline">
        Previous
      </Button>
    </ButtonGroup>
  );
}
