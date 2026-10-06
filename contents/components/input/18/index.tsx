"use client";

import { ChevronDownIcon, PhoneIcon } from "lucide-react";
import type React from "react";
import { useId, useState } from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Component() {
  const id = useId();
  const [value, setValue] = useState("");

  return (
    <div className="w-full max-w-sm *:not-first:mt-2" dir="ltr">
      <Label htmlFor={id}>PhoneIcon number input</Label>
      <RPNInput.default
        className="flex rounded-md shadow-xs"
        countrySelectComponent={CountrySelect}
        flagComponent={FlagComponent}
        id={id}
        inputComponent={PhoneInput}
        international
        onChange={(newValue) => setValue(newValue ?? "")}
        placeholder="Enter phone number"
        value={value}
      />
    </div>
  );
}

const PhoneInput = ({ className, ...props }: React.ComponentProps<"input">) => {
  return (
    <Input
      className={cn("-ms-px rounded-s-none shadow-none focus-visible:z-10", className)}
      data-slot="phone-input"
      {...props}
    />
  );
};

PhoneInput.displayName = "PhoneInput";

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: { label: string; value: RPNInput.Country | undefined }[];
};

const CountrySelect = ({ disabled, value, onChange, options }: CountrySelectProps) => {
  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as RPNInput.Country);
  };

  return (
    <div className="border-input bg-background text-muted-foreground focus-within:border-ring focus-within:ring-ring/50 hover:bg-accent hover:text-foreground has-aria-invalid:border-destructive/60 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 relative inline-flex items-center self-stretch rounded-s-md border py-2 ps-3 pe-2 transition-[color,box-shadow] outline-none focus-within:z-10 focus-within:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-50">
      <div aria-hidden="true" className="inline-flex items-center gap-1">
        <FlagComponent aria-hidden="true" country={value} countryName={value} />
        <span className="text-muted-foreground/80">
          <ChevronDownIcon aria-hidden="true" size={16} />
        </span>
      </div>
      <select
        aria-label="Select country"
        className="absolute inset-0 text-sm opacity-0"
        disabled={disabled}
        onChange={handleSelect}
        value={value}>
        <option key="default" value="">
          Select a country
        </option>
        {options
          .filter((x) => x.value)
          .map((option, i) => (
            <option key={option.value ?? `empty-${i}`} value={option.value}>
              {option.label} {option.value && `+${RPNInput.getCountryCallingCode(option.value)}`}
            </option>
          ))}
      </select>
    </div>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="w-5 overflow-hidden rounded-sm">
      {Flag ? <Flag title={countryName} /> : <PhoneIcon aria-hidden="true" size={16} />}
    </span>
  );
};
