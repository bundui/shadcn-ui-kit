"use client";

import { useEffect, useId, useRef, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Component() {
  const checkboxId = useId();
  const inputId = useId();
  const [checked, setChecked] = useState<boolean | "indeterminate">(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checked === true && inputRef.current) {
      inputRef.current.focus();
    }
  }, [checked]);

  return (
    <div>
      <div className="flex items-start gap-2">
        <Checkbox
          aria-controls={inputId}
          aria-describedby={`${checkboxId}-description`}
          checked={checked}
          id={checkboxId}
          onCheckedChange={setChecked}
        />
        <div className="grow">
          <div className="grid gap-2">
            <Label htmlFor={checkboxId}>Checkbox with expansion</Label>
            <p className="text-muted-foreground text-xs" id={`${checkboxId}-description`}>
              You can use this checkbox with a label and a description.
            </p>
          </div>
          <div
            aria-labelledby={checkboxId}
            className="grid transition-all ease-in-out data-[state=collapsed]:grid-rows-[0fr] data-[state=collapsed]:opacity-0 data-[state=expanded]:grid-rows-[1fr] data-[state=expanded]:opacity-100"
            data-state={checked ? "expanded" : "collapsed"}
            id={inputId}
            role="region">
            <div className="pointer-events-none -m-2 overflow-hidden p-2">
              <div className="pointer-events-auto mt-3">
                <Input
                  aria-label="Additional Information"
                  disabled={!checked}
                  id="checkbox-11-additional-info"
                  placeholder="Enter details"
                  ref={inputRef}
                  type="text"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
