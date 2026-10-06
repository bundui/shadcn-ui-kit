import { Separator } from "@/components/ui/separator";

export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <div className="relative flex items-center gap-2">
        <Separator className="flex-1 bg-blue-600" />
        <span className=" text-blue-600 shrink-0 text-[10px] tracking-widest uppercase">
          more
        </span>
        <Separator className="flex-1 bg-blue-600" />
      </div>
    </div>
  );
}
