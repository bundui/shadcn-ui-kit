"use client";

import { Progress } from "@/components/ui/progress";
import { CheckIcon } from "lucide-react";

const steps = [
  { label: "Account", completed: true },
  { label: "Profile", completed: true },
  { label: "Settings", completed: false },
  { label: "Review", completed: false }
];

export default function ProgressComponent() {
  const completedSteps = steps.filter((step) => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Setup Progress</span>
          <span className="text-muted-foreground">{completedSteps}/{steps.length}</span>
        </div>
        <Progress value={progress} />
      </div>
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            {step.completed ? (
              <CheckIcon className="text-primary h-4 w-4" />
            ) : (
              <div className="bg-muted h-4 w-4 rounded-full" />
            )}
            <span className={step.completed ? "" : "text-muted-foreground"}>{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

