"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function ProgressComponent() {
  const getStatusColor = (value: number) => {
    if (value >= 80) return "bg-red-500";
    if (value >= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusText = (value: number) => {
    if (value >= 80) return "High";
    if (value >= 50) return "Medium";
    return "Low";
  };

  const usage = 75;

  return (
    <div className="w-full max-w-sm space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Storage Usage</span>
        <Badge variant={usage >= 80 ? "destructive" : usage >= 50 ? "secondary" : "default"}>
          {getStatusText(usage)}
        </Badge>
      </div>
      <Progress value={usage} className={getStatusColor(usage)} />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>7.5 GB of 10 GB used</span>
        <span>{usage}%</span>
      </div>
    </div>
  );
}

