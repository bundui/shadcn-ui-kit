"use client";

import { Progress } from "@/components/ui/progress";

export default function ProgressComponent() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>CPU Usage</span>
          <span className="text-muted-foreground">45%</span>
        </div>
        <Progress value={45} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Memory Usage</span>
          <span className="text-muted-foreground">62%</span>
        </div>
        <Progress value={62} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Disk Usage</span>
          <span className="text-muted-foreground">38%</span>
        </div>
        <Progress value={38} />
      </div>
    </div>
  );
}

