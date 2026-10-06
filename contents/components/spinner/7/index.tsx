import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

export default function Component() {
  return (
    <div className="flex items-center">
      <Badge>
        <Spinner data-icon="inline-start" />
        Syncing
      </Badge>
    </div>
  );
}
