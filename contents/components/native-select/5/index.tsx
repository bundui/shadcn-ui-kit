import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

export default function NativeSelectComponent() {
  return (
    <div className="w-full max-w-xs *:data-[slot=native-select-wrapper]:w-full">
      <NativeSelect aria-invalid>
        <NativeSelectOption value="1">React</NativeSelectOption>
        <NativeSelectOption value="2">Next.js</NativeSelectOption>
        <NativeSelectOption value="3">Astro</NativeSelectOption>
        <NativeSelectOption value="4">Gatsby</NativeSelectOption>
      </NativeSelect>
      <p aria-live="polite" className="text-destructive mt-2 text-xs" role="alert">
        Selected option is invalid
      </p>
    </div>
  );
}
