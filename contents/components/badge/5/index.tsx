import { Badge } from "@/components/ui/badge";

export default function Component() {
  return (
    <Badge className="items-baseline gap-1.5">
      Chat
      <span className="font-medium text-[0.625rem] text-primary-foreground/60">
        73
      </span>
    </Badge>
  );
}
