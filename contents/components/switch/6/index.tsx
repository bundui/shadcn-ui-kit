"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useId, useState } from "react";

import { Switch } from "@/components/ui/switch";

export default function SwitchComponent() {
  const id = useId();
  const [checked, setChecked] = useState(false);

  const toggleSwitch = () => setChecked((prev) => !prev);

  return (
    <div
      className="group inline-flex items-center gap-2"
      data-state={checked ? "checked" : "unchecked"}>
      <span
        aria-controls={id}
        className="group-data-[state=checked]:text-muted-foreground/70 flex-1 cursor-pointer text-right text-sm font-medium"
        id={`${id}-off`}
        onClick={() => setChecked(false)}>
        <MoonIcon aria-hidden="true" size={16} />
      </span>
      <Switch
        aria-label="Toggle between dark and light mode"
        aria-labelledby={`${id}-off ${id}-on`}
        checked={checked}
        id={id}
        onCheckedChange={toggleSwitch}
      />
      <span
        aria-controls={id}
        className="group-data-[state=unchecked]:text-muted-foreground/70 flex-1 cursor-pointer text-left text-sm font-medium"
        id={`${id}-on`}
        onClick={() => setChecked(true)}>
        <SunIcon aria-hidden="true" size={16} />
      </span>
    </div>
  );
}
