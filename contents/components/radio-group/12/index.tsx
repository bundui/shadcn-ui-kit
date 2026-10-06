import { useId } from "react";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Component() {
  const id = useId();

  const items = [
    { label: "Basic", price: "$9/mo", value: "1" },
    { label: "Pro", price: "$29/mo", value: "2" },
    { label: "Business", price: "$79/mo", value: "3" },
    { label: "Enterprise", price: "Custom", value: "4" }
  ];

  return (
    <fieldset className="space-y-4">
      <legend className="text-foreground text-sm leading-none font-medium">Select subscription plan</legend>
      <RadioGroup className="gap-0 -space-y-px rounded-md shadow-xs" defaultValue="2">
        {items.map((item) => (
          <div
            className="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-accent relative flex flex-col gap-4 border p-4 outline-none first:rounded-t-md last:rounded-b-md has-data-[state=checked]:z-10"
            key={`${id}-${item.value}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  aria-describedby={`${`${id}-${item.value}`}-price`}
                  className="after:absolute after:inset-0"
                  id={`${id}-${item.value}`}
                  value={item.value}
                />
                <Label className="inline-flex items-start" htmlFor={`${id}-${item.value}`}>
                  {item.label}
                  {item.value === "2" && <Badge className="ms-2 -mt-1">Popular</Badge>}
                </Label>
              </div>
              <div
                className="text-muted-foreground text-xs leading-[inherit]"
                id={`${`${id}-${item.value}`}-price`}>
                {item.price}
              </div>
            </div>
          </div>
        ))}
      </RadioGroup>
    </fieldset>
  );
}
