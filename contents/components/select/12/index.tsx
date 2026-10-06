import { useId } from "react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export default function Component() {
  const id = useId();
  return (
    <div className="w-full max-w-xs">
      <Select defaultValue="1">
        <SelectTrigger
          className="w-full ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0"
          id={id}>
          <SelectValue placeholder="Select framework" />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2">
          <SelectGroup>
            <SelectLabel className="ps-2">Impersonate user</SelectLabel>
            <SelectItem value="1">
              <img
                alt="Jenny Hamilton"
                className="size-5 rounded"
                height={20}
                src="https://i.pravatar.cc/20?u=jennyhamilton"
                width={20}
              />
              <span className="truncate">Jenny Hamilton</span>
            </SelectItem>
            <SelectItem value="2">
              <img
                alt="Paul Smith"
                className="size-5 rounded"
                height={20}
                src="https://i.pravatar.cc/20?u=paulsmith"
                width={20}
              />
              <span className="truncate">Paul Smith</span>
            </SelectItem>
            <SelectItem value="3">
              <img
                alt="Luna Wyen"
                className="size-5 rounded"
                height={20}
                src="https://i.pravatar.cc/20?u=lunawyen"
                width={20}
              />
              <span className="truncate">Luna Wyen</span>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
