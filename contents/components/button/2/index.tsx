import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ButtonComponent() {
  return (
    <Button className="gap-2" disabled>
      <Loader2 className="size-4 animate-spin" />
      Loading
    </Button>
  );
}
