import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

export default function NativeSelectComponent() {
  return (
    <div className="w-full max-w-xs *:data-[slot=native-select-wrapper]:w-full">
      <NativeSelect>
        <NativeSelectOption value="todo">Todo</NativeSelectOption>
        <NativeSelectOption value="in-progress">In Progress</NativeSelectOption>
        <NativeSelectOption value="done">Done</NativeSelectOption>
        <NativeSelectOption value="cancelled">Cancelled</NativeSelectOption>
      </NativeSelect>
    </div>
  );
}
