import { RiAppleLine, RiBankCardLine, RiPaypalLine } from "@remixicon/react";
import { useId } from "react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Component() {
  const id = useId();
  return (
    <RadioGroup className="grid-cols-3" defaultValue="1">
      <div className="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]">
        <RadioGroupItem className="sr-only" id={`${id}-1`} value="1" />
        <RiBankCardLine aria-hidden="true" className="opacity-60" size={20} />
        <label
          className="text-foreground cursor-pointer text-xs leading-none font-medium after:absolute after:inset-0"
          htmlFor={`${id}-1`}>
          Card
        </label>
      </div>
      <div className="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]">
        <RadioGroupItem className="sr-only" id={`${id}-2`} value="2" />
        <RiPaypalLine aria-hidden="true" className="opacity-60" size={20} />
        <label
          className="text-foreground cursor-pointer text-xs leading-none font-medium after:absolute after:inset-0"
          htmlFor={`${id}-2`}>
          PayPal
        </label>
      </div>
      <div className="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-md border px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]">
        <RadioGroupItem className="sr-only" id={`${id}-3`} value="3" />
        <RiAppleLine aria-hidden="true" className="opacity-60" size={20} />
        <label
          className="text-foreground cursor-pointer text-xs leading-none font-medium after:absolute after:inset-0"
          htmlFor={`${id}-3`}>
          Apple Pay
        </label>
      </div>
    </RadioGroup>
  );
}
