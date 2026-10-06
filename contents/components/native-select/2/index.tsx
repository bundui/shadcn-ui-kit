import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

export default function NativeSelectComponent() {
  return (
    <div className="w-full max-w-xs *:data-[slot=native-select-wrapper]:w-full">
      <NativeSelect defaultValue="">
        <NativeSelectOption disabled value="">
          Please select a value
        </NativeSelectOption>
        <NativeSelectOption value="1">1 to 5</NativeSelectOption>
        <NativeSelectOption value="2">5 to 10</NativeSelectOption>
        <NativeSelectOption value="3">More than 10</NativeSelectOption>
      </NativeSelect>
    </div>
  );
}
