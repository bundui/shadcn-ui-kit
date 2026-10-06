import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";

export default function Component() {
  return (
    <ButtonGroup>
      <Button variant="secondary">Left</Button>
      <ButtonGroupSeparator />
      <Button variant="secondary">Middle</Button>
      <ButtonGroupSeparator />
      <Button variant="secondary">Right</Button>
    </ButtonGroup>
  );
}
