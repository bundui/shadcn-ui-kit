import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

export default function NativeSelectComponent() {
  return (
    <div className="w-full max-w-xs *:data-[slot=native-select-wrapper]:w-full">
      <NativeSelect>
        <NativeSelectOption value="1">React</NativeSelectOption>
        <NativeSelectOption value="2">Next.js</NativeSelectOption>
        <NativeSelectOption value="3">Astro</NativeSelectOption>
        <NativeSelectOption value="4">Gatsby</NativeSelectOption>
      </NativeSelect>
      <p aria-live="polite" className="text-muted-foreground mt-2 text-xs" role="region">
        Tell us what&lsquo;s your favorite Select framework
      </p>
    </div>
  );
}
