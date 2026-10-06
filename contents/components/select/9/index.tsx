import { useId } from "react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

function StatusDot({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      height="8"
      viewBox="0 0 8 8"
      width="8"
      xmlns="http://www.w3.org/2000/svg">
      <circle cx="4" cy="4" r="4" />
    </svg>
  );
}

export default function SelectComponent() {
  const id = useId();
  return (
    <div className="w-full max-w-xs">
      <Select defaultValue="1">
        <SelectTrigger
          className="w-full [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0"
          id={id}>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
          <SelectItem value="1">
            <span className="flex items-center gap-2">
              <StatusDot className="text-emerald-600 size-2.5" />
              <span className="truncate">Completed</span>
            </span>
          </SelectItem>
          <SelectItem value="2">
            <span className="flex items-center gap-2">
              <StatusDot className="text-blue-500 size-2.5" />
              <span className="truncate">In Progress</span>
            </span>
          </SelectItem>
          <SelectItem value="3">
            <span className="flex items-center gap-2">
              <StatusDot className="text-amber-500 size-2.5" />
              <span className="truncate">Pending</span>
            </span>
          </SelectItem>
          <SelectItem value="4">
            <span className="flex items-center gap-2">
              <StatusDot className="text-gray-500 size-2.5" />
              <span className="truncate">Cancelled</span>
            </span>
          </SelectItem>
          <SelectItem value="5">
            <span className="flex items-center gap-2">
              <StatusDot className="text-red-500 size-2.5" />
              <span className="truncate">Failed</span>
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
