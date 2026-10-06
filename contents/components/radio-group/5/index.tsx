"use client";

import { useEffect, useId, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Component() {
  const radioId = useId();
  const inputId = useId();
  const [selectedValue, setSelectedValue] = useState("without-expansion");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedValue === "with-expansion" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedValue]);

  return (
    <RadioGroup className="gap-6" onValueChange={setSelectedValue} value={selectedValue}>
      <div>
        <div className="flex items-start gap-2">
          <RadioGroupItem
            aria-controls={inputId}
            aria-describedby={`${radioId}-1-description`}
            id={`${radioId}-1`}
            value="with-expansion"
          />
          <div className="grow">
            <div className="grid grow gap-2">
              <Label htmlFor={`${radioId}-1`}>Home delivery</Label>
              <p className="text-muted-foreground text-xs" id={`${radioId}-1-description`}>
                Delivered to your doorstep within 2-3 business days.
              </p>
            </div>
            <div
              aria-labelledby={`${radioId}-1`}
              className="grid transition-all ease-in-out data-[state=collapsed]:grid-rows-[0fr] data-[state=collapsed]:opacity-0 data-[state=expanded]:grid-rows-[1fr] data-[state=expanded]:opacity-100"
              data-state={selectedValue === "with-expansion" ? "expanded" : "collapsed"}
              id={inputId}
              role="region">
              <div className="pointer-events-none -m-2 overflow-hidden p-2">
                <div className="pointer-events-auto mt-3">
                  <Input
                    aria-label="Delivery address"
                    disabled={selectedValue !== "with-expansion"}
                    id="radio-05-additional-info"
                    placeholder="Enter your address"
                    ref={inputRef}
                    type="text"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <RadioGroupItem
          aria-describedby={`${radioId}-2-description`}
          id={`${radioId}-2`}
          value="without-expansion"
        />
        <div className="grid grow gap-2">
          <Label htmlFor={`${radioId}-2`}>Pick up at store</Label>
          <p className="text-muted-foreground text-xs" id={`${radioId}-2-description`}>
            Collect your order from our nearest store location.
          </p>
        </div>
      </div>
    </RadioGroup>
  );
}
