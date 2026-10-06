import { Separator } from "@/components/ui/separator";
import { ComponentIcon } from "lucide-react";

export default function Example() {
  return (
    <div className="h-42">
      <div className="flex h-full flex-col items-center gap-2">
        <Separator orientation="vertical" className="flex-1 self-center!" />
        <span className="text-muted-foreground shrink-0 text-sm">
          <ComponentIcon className="size-4" />
        </span>
        <Separator orientation="vertical" className="flex-1 self-center!" />
      </div>
    </div>
  );
}
