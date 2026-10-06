import { Progress } from "@/components/ui/progress";

export default function ProgressComponent() {
  return (
    <div className="w-full max-w-sm space-y-2">
      <Progress value={50} className="h-3" />
    </div>
  );
}
