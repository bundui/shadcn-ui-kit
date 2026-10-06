import { Italic } from "lucide-react";

import { Toggle } from "@/components/ui/toggle";

export default function ToggleComponent() {
  return (
    <Toggle aria-label="Toggle italic">
      <Italic />
      Italic
    </Toggle>
  );
}
