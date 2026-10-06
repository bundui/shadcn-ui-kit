import { ClockIcon } from "lucide-react";

import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

export default function NativeSelectComponent() {
  return (
    <div className="group relative w-full max-w-xs *:data-[slot=native-select-wrapper]:w-full">
      <NativeSelect className="ps-9">
        <NativeSelectOption value="1">00:00 AM - 11:59 PM</NativeSelectOption>
        <NativeSelectOption value="2">01:00 AM - 12:59 PM</NativeSelectOption>
        <NativeSelectOption value="3">02:00 AM - 01:59 PM</NativeSelectOption>
        <NativeSelectOption value="4">03:00 AM - 02:59 PM</NativeSelectOption>
      </NativeSelect>
      <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 group-has-[select[disabled]]:opacity-50">
        <ClockIcon aria-hidden="true" size={16} />
      </div>
    </div>
  );
}
