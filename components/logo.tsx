import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <img
        src="/logo-full.svg"
        className="w-36 dark:invert"
        alt="shadcn ui kit svg logo"
      />
      <Badge variant="outline">Free</Badge>
    </Link>
  );
}
