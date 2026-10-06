import { Separator } from "@/components/ui/separator";
import { ComponentIcon } from "lucide-react";

export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <div className="relative flex items-center gap-2">
        <Separator className="flex-1" />
        <span className="text-muted-foreground shrink-0 text-sm">
          <ComponentIcon className="size-4" />
        </span>
        <Separator className="flex-1" />
      </div>
    </div>
  );
}
