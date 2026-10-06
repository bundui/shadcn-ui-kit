import { useId } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export default function SelectComponent() {
  const id = useId();
  return (
    <div className="group relative w-full max-w-xs">
      <label
        className="bg-background text-foreground absolute start-1 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium group-has-disabled:opacity-50"
        htmlFor={id}>
        Frameworks
      </label>
      <Select>
        <SelectTrigger className="w-full" id={id}>
          <SelectValue placeholder="Select framework" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">React</SelectItem>
          <SelectItem value="2">Next.js</SelectItem>
          <SelectItem value="3">Astro</SelectItem>
          <SelectItem value="4">Gatsby</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
