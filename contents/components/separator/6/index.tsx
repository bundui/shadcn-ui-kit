import { Separator } from "@/components/ui/separator";

export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <div className="relative flex items-center gap-2">
        <Separator className="flex-1" />
        <span className="text-muted-foreground shrink-0 text-sm">Continue with</span>
      </div>
    </div>
  );
}
