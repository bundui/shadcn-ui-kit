import { useId } from "react";

import { Label } from "@/components/ui/label";
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
    <div className="w-full max-w-xs">
      <Select defaultValue="1">
        <SelectTrigger className="w-full" aria-invalid>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">React</SelectItem>
          <SelectItem value="2">Next.js</SelectItem>
          <SelectItem value="3">Astro</SelectItem>
          <SelectItem value="4">Gatsby</SelectItem>
        </SelectContent>
      </Select>
      <p aria-live="polite" className="text-destructive mt-2 text-xs" role="alert">
        Selected option is invalid
      </p>
    </div>
  );
}
