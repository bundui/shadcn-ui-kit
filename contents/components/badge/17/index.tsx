import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function BadgeComponent() {
  return (
    <Badge
      className="bg-background h-10 gap-3 rounded-full p-1 ps-4"
      variant="outline"
    >
      <span aria-hidden="true" className="bg-foreground size-2 shrink-0 rounded-full" />
      50+ Blocks Added
      <Button className="rounded-full" size="sm" variant="secondary">
        View Changes
      </Button>
    </Badge>
  );
}
