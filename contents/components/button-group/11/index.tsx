import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";

export default function ButtonGroupComponent() {
  return (
    <ButtonGroup>
      <ButtonGroup>
        <InputGroup>
          <InputGroupInput placeholder="Email address" />
        </InputGroup>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Add</Button>
      </ButtonGroup>
    </ButtonGroup>
  );
}
