"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Example() {
  return (
    <RadioGroup defaultValue="monthly">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="monthly" id="r1" />
        <Label htmlFor="r1">Monthly</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="quarterly" id="r2" />
        <Label htmlFor="r2">Quarterly</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="yearly" id="r3" />
        <Label htmlFor="r3">Yearly</Label>
      </div>
    </RadioGroup>
  );
}

