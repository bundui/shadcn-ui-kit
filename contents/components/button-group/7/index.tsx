import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";

export default function ButtonGroupComponent() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="icon">
        <BoldIcon />
      </Button>
      <Button variant="outline" size="icon">
        <ItalicIcon />
      </Button>
      <Button variant="outline" size="icon">
        <UnderlineIcon />
      </Button>
    </ButtonGroup>
  );
}
