import { RiGatsbyLine, RiNextjsLine, RiReactjsLine } from "@remixicon/react";
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
      <Select defaultValue="2">
        <SelectTrigger
          className="w-full [&>span_svg]:text-muted-foreground/80 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0"
          id={id}>
          <SelectValue placeholder="Select framework" />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
          <SelectItem value="1">
            <RiReactjsLine aria-hidden="true" size={16} />
            <span className="truncate">React</span>
          </SelectItem>
          <SelectItem value="2">
            <RiNextjsLine aria-hidden="true" size={16} />
            <span className="truncate">Next.js</span>
          </SelectItem>
          <SelectItem value="3">
            <RiGatsbyLine aria-hidden="true" size={16} />
            <span className="truncate">Gatsby</span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
