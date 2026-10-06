import { useId } from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Component() {
  const id = useId();
  return (
    <RadioGroup className="gap-6" defaultValue="credit-card">
      <div className="flex items-start gap-2">
        <RadioGroupItem
          aria-describedby={`${id}-credit-card-description`}
          id={`${id}-credit-card`}
          value="credit-card"
        />
        <div className="grid grow gap-2">
          <Label htmlFor={`${id}-credit-card`}>
            Credit or Debit Card{" "}
            <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
              (Visa, Mastercard, Amex)
            </span>
          </Label>
          <p className="text-muted-foreground text-xs" id={`${id}-credit-card-description`}>
            Processed securely with 256-bit SSL encryption.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <RadioGroupItem
          aria-describedby={`${id}-paypal-description`}
          id={`${id}-paypal`}
          value="paypal"
        />
        <div className="grid grow gap-2">
          <Label htmlFor={`${id}-paypal`}>
            PayPal{" "}
            <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
              (Digital Wallet)
            </span>
          </Label>
          <p className="text-muted-foreground text-xs" id={`${id}-paypal-description`}>
            Check out faster using your saved PayPal balance or card.
          </p>
        </div>
      </div>
    </RadioGroup>
  );
}
