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

export default function SelectComponent() {
  const id = useId();
  return (
    <div className="w-full max-w-xs">
      <Select defaultValue="1">
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select framework" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Frontend</SelectLabel>
            <SelectItem value="1">React</SelectItem>
            <SelectItem value="2">Vue</SelectItem>
            <SelectItem value="3">Angular</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Backend</SelectLabel>
            <SelectItem value="4">Node.js</SelectItem>
            <SelectItem value="5">Python</SelectItem>
            <SelectItem value="6">Java</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
