import { useId } from "react";

import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

export default function NativeSelectComponent() {
  const id = useId();
  return (
    <div className="w-full max-w-xs *:not-first:mt-2 *:data-[slot=native-select-wrapper]:w-full">
      <Label htmlFor={id}>
        Framework <span className="text-destructive">*</span>
      </Label>
      <NativeSelect id={id}>
        <NativeSelectOption value="1">React</NativeSelectOption>
        <NativeSelectOption value="2">Next.js</NativeSelectOption>
        <NativeSelectOption value="3">Astro</NativeSelectOption>
        <NativeSelectOption value="4">Gatsby</NativeSelectOption>
      </NativeSelect>
    </div>
  );
}
