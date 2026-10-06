import { Separator } from "@/components/ui/separator";

export default function Example() {
  return (
    <div className="flex h-5 items-center space-x-4 text-sm">
      <div>Blog</div>
      <Separator orientation="vertical" />
      <div>Docs</div>
      <Separator orientation="vertical" />
      <div>Source</div>
    </div>
  );
}
