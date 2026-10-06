import { useId } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SwitchComponent() {
  const id = useId();
  return (
    <div className="inline-flex items-center gap-2">
      <Switch
        className="[&_span]:border-input h-3! w-9! border-none [&_span]:size-4! [&_span]:border [&_span]:shadow-sm [&_span]:data-[state=checked]:translate-x-5"
        id={id}
      />
      <Label className="sr-only" htmlFor={id}>
        M2-style switch
      </Label>
    </div>
  );
}
