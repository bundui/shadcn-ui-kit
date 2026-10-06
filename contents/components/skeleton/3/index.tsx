import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonCard() {
  return (
    <Card className="w-full max-w-sm pt-0 shadow-none">
      <Skeleton className="aspect-video w-full" />
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="size-12 rounded-full" />
          <div className="space-y-3 grow">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
