import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

export default function ButtonGroupComponent() {
  return (
    <ButtonGroup>
      <Button variant="outline">Days</Button>
      <Button variant="outline">Months</Button>
      <Button variant="outline">Years</Button>
    </ButtonGroup>
  );
}
