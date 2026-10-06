import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonCard() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-3 w-2/5" />
      <div className="space-y-4">
        <div className="flex items-center space-x-4 *:size-10 *:rounded-full">
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
        <div className="flex items-center space-x-4 *:size-10 *:rounded-full">
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      </div>
    </div>
  );
}
