import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Loader2 } from "lucide-react";

export default function ButtonGroupComponent() {
  return (
    <ButtonGroup className="max-w-xs">
      <InputGroup>
        <InputGroupInput placeholder="Search articles..." />
      </InputGroup>
      <Button disabled>
        <Loader2 className="size-4 animate-spin" />
      </Button>
    </ButtonGroup>
  );
}
