import { useId } from "react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Component() {
  const id = useId();

  const items = [
    { label: "2 CPU", value: "1" },
    { label: "4 CPU", value: "2" },
    { label: "6 CPU", value: "3" },
    { label: "8 CPU", value: "4" },
    { label: "12 CPU", value: "5" },
    { disabled: true, label: "16 CPU", value: "6" }
  ];

  return (
    <fieldset className="space-y-4">
      <legend className="text-foreground text-sm leading-none font-medium">Compute resources</legend>
      <RadioGroup className="grid grid-cols-3 gap-2" defaultValue="1">
        {items.map((item) => (
          <label
            className="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50"
            key={`${id}-${item.value}`}>
            <RadioGroupItem
              className="sr-only after:absolute after:inset-0"
              disabled={item.disabled}
              id={`${id}-${item.value}`}
              value={item.value}
            />
            <p className="text-foreground text-sm leading-none font-medium">{item.label}</p>
          </label>
        ))}
      </RadioGroup>
    </fieldset>
  );
}
