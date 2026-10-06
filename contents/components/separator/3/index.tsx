import { Separator } from "@/components/ui/separator";

export default function Example() {
  return (
    <div className="flex flex-col w-full max-w-sm space-y-3 text-sm">
      <div>Blog</div>
      <Separator />
      <div>Docs</div>
      <Separator />
      <div>Source</div>
    </div>
  );
}
