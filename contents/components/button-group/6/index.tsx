import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { DownloadCloud } from "lucide-react";

export default function ButtonGroupComponent() {
  return (
    <ButtonGroup>
      <Button variant="outline">
        <DownloadCloud />
        Download for Free
      </Button>
      <Button variant="outline">31K</Button>
    </ButtonGroup>
  );
}
