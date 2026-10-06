import { Separator } from "@/components/ui/separator";

export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <div className="relative flex items-center gap-2">
        <div className="flex-1 space-y-1">
          <Separator />
          <Separator />
        </div>
        <span className="text-muted-foreground shrink-0 text-[10px] tracking-widest uppercase">
          Blog
        </span>
        <div className="flex-1 space-y-1">
          <Separator />
          <Separator />
        </div>
      </div>
    </div>
  );
}
