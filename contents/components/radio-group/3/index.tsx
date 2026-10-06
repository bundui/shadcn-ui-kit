import { useId } from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Component() {
  const id = useId();
  return (
    <RadioGroup
      className="[--primary:var(--color-indigo-500)] [--ring:var(--color-indigo-300)] in-[.dark]:[--primary:var(--color-indigo-500)] in-[.dark]:[--ring:var(--color-indigo-900)]"
      defaultValue="credit-card">
      <div className="flex items-center gap-2">
        <RadioGroupItem id={`${id}-credit-card`} value="credit-card" />
        <Label htmlFor={`${id}-credit-card`}>Credit Card</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id={`${id}-paypal`} value="paypal" />
        <Label htmlFor={`${id}-paypal`}>PayPal</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id={`${id}-apple-pay`} value="apple-pay" />
        <Label htmlFor={`${id}-apple-pay`}>Apple Pay</Label>
      </div>
    </RadioGroup>
  );
}
