import { ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

export default function Component() {
  return (
    <ButtonGroup aria-label="Pagination">
      <Button aria-label="Next" variant="outline">
        Next
      </Button>
      <Button aria-label="Next" variant="outline" size="icon">
        <ChevronRightIcon />
      </Button>
    </ButtonGroup>
  );
}
