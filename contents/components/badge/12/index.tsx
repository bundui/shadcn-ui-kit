import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowDownIcon, ArrowUp } from "lucide-react";

export default function BadgeComponent() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
        <ArrowUp />
        9.3%
      </Badge>

      <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
        <ArrowDownIcon className="stroke-3" />
        1.9%
      </Badge>

      <Badge className="bg-green-600 text-white dark:bg-green-700 dark:text-green-200">
        <ArrowUp />
        12.4%
      </Badge>

      <Badge variant="destructive">
        <ArrowDown />
        -2.3%
      </Badge>
    </div>
  );
}
