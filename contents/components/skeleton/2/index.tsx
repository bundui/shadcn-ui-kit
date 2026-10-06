import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonCard() {
  return (
    <Card className="max-w-sm w-full shadow-none">
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="size-12 rounded-full" />
          <div className="grow space-y-2">
            <Skeleton className="h-4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
