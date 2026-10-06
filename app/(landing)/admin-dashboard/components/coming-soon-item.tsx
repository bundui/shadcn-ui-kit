import { Badge } from "@/components/ui/badge";

export default function ComingSoonItem({ name }: { name: string }) {
  return (
    <div
      aria-disabled="true"
      className="block cursor-not-allowed overflow-hidden rounded-lg border select-none"
    >
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-sm">{name}</span>
        <Badge variant="secondary">Coming Soon</Badge>
      </div>
      <figure className="rounded-xl border-t">
        <div className="bg-muted aspect-3/2 w-full rounded-tl-md rounded-tr-lg" />
      </figure>
    </div>
  );
}
