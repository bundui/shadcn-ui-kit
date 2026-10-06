import { useId } from "react";

import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

export default function NativeSelectComponent() {
  const id = useId();
  return (
    <div className="border-input bg-background focus-within:border-ring focus-within:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 relative w-full max-w-xs rounded-md border shadow-xs transition-[color,box-shadow] outline-none focus-within:ring-[3px] has-[select:disabled]:cursor-not-allowed has-[select:disabled]:opacity-50 has-[select:is(:disabled)_*]:pointer-events-none *:data-[slot=native-select-wrapper]:w-full">
      <label className="text-foreground block px-3 pt-2 text-xs font-medium" htmlFor={id}>
        Framework
      </label>
      <NativeSelect
        className="border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        defaultValue=""
        id={id}>
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
