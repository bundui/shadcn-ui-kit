import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export default function ButtonGroupComponent() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="icon" disabled>
        <ChevronLeftIcon />
      </Button>
      <Button variant="outline">1</Button>
      <Button variant="outline">2</Button>
      <Button>3</Button>
      <Button variant="outline">4</Button>
      <Button variant="outline">...</Button>
      <Button variant="outline">20</Button>
      <Button variant="outline" size="icon">
        <ChevronRightIcon />
      </Button>
    </ButtonGroup>
  );
}
