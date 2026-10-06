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
    <div className="flex items-center justify-center">
      <Select defaultValue="1">
        <SelectTrigger id={id}>
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
