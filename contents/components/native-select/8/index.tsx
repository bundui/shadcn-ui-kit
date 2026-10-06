import { useId } from "react";

import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

export default function NativeSelectComponent() {
  const id = useId();
  return (
    <div className="group relative w-full max-w-xs *:data-[slot=native-select-wrapper]:w-full">
      <label
        className="bg-background text-foreground absolute start-1 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium group-has-[select:disabled]:opacity-50"
        htmlFor={id}>
        Framework
      </label>
      <NativeSelect defaultValue="" id={id}>
        <NativeSelectOption disabled value="">
          Select framework
        </NativeSelectOption>
        <NativeSelectOption value="1">React</NativeSelectOption>
        <NativeSelectOption value="2">Next.js</NativeSelectOption>
        <NativeSelectOption value="3">Astro</NativeSelectOption>
        <NativeSelectOption value="4">Gatsby</NativeSelectOption>
      </NativeSelect>
    </div>
  );
}
