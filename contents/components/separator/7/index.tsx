import { Separator } from "@/components/ui/separator";

export default function Example() {
  return (
    <div className="h-42">
      <div className="flex h-full flex-col items-center gap-2">
        <span className="text-muted-foreground shrink-0 text-sm">or</span>
        <Separator orientation="vertical" className="flex-1 self-center!" />
      </div>
    </div>
  );
}
