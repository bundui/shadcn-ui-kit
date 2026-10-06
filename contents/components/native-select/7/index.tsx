import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption
} from "@/components/ui/native-select";

export default function NativeSelectComponent() {
  return (
    <div className="w-full max-w-xs *:not-first:mt-2 *:data-[slot=native-select-wrapper]:w-full">
      <NativeSelect>
        <NativeSelectOptGroup label="Frontend">
          <NativeSelectOption value="1">React</NativeSelectOption>
          <NativeSelectOption value="2">Vue</NativeSelectOption>
          <NativeSelectOption value="3">Angular</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="Backend">
          <NativeSelectOption value="4">Node.js</NativeSelectOption>
          <NativeSelectOption value="5">Python</NativeSelectOption>
          <NativeSelectOption value="6">Java</NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>
    </div>
  );
}
