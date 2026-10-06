import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonCard() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex grow justify-between gap-2 space-x-2">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-3 w-8" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex grow justify-between gap-2 space-x-2">
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-8" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex grow justify-between gap-2 space-x-2">
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-8" />
        </div>
      </div>
    </div>
  );
}
