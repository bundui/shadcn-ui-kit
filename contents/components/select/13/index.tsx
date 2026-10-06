import { useId } from "react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export default function Component() {
  const id = useId();
  return (
    <div className="w-full max-w-xs">
      <Select defaultValue="1">
        <SelectTrigger
          className="h-auto w-full ps-2 text-left [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0"
          id={id}>
          <SelectValue placeholder="Choose a plan" />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
          <SelectItem value="1">
            <span className="flex items-center gap-2">
              <img
                alt="Jenny Hamilton"
                className="size-6 rounded-full"
                src="https://i.pravatar.cc/40?u=jennycodes"
              />
              <span>
                <span className="block font-medium">Jenny Hamilton</span>
                <span className="text-muted-foreground block text-xs">@jennycodes</span>
              </span>
            </span>
          </SelectItem>
          <SelectItem value="2">
            <span className="flex items-center gap-2">
              <img
                alt="Paul Smith"
                className="size-6 rounded-full"
                src="https://i.pravatar.cc/40?u=paulsmith"
              />
              <span>
                <span className="block font-medium">Paul Smith</span>
                <span className="text-muted-foreground block text-xs">@paulsmith</span>
              </span>
            </span>
          </SelectItem>
          <SelectItem value="3">
            <span className="flex items-center gap-2">
              <img
                alt="Luna Wyen"
                className="size-6 rounded-full"
                src="https://i.pravatar.cc/40?u=wyen.luna"
              />
              <span>
                <span className="block font-medium">Luna Wyen</span>
                <span className="text-muted-foreground block text-xs">@wyen.luna</span>
              </span>
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
