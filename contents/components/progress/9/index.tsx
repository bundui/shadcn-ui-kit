"use client";

import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ProgressComponent() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const startProgress = () => {
    setIsLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>File Upload</span>
          <span className="text-muted-foreground">{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>
      <Button onClick={startProgress} disabled={isLoading} className="w-full">
        {isLoading ? "Uploading..." : "Start Upload"}
      </Button>
    </div>
  );
}
