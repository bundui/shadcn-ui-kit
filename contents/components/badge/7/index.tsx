import { Badge } from "@/components/ui/badge";

export default function Component() {
  return (
    <Badge className="gap-1.5" variant="outline">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-amber-500" />
      Pending
    </Badge>
  );
}
