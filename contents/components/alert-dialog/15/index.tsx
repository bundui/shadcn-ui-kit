"use client";

import { ArrowRightIcon } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Component() {
  const [step, setStep] = useState(1);

  const stepContent = [
    {
      description:
        "Discover a powerful collection of components designed to enhance your development workflow.",
      title: "Welcome to shadcnuikit.com",
    },
    {
      description:
        "Each component is fully customizable and built with modern web standards in mind.",
      title: "Customizable Components",
    },
    {
      description:
        "Begin building amazing interfaces with our comprehensive component library.",
      title: "Ready to Start?",
    },
    {
      description:
        "Access our extensive documentation and community resources to make the most of shadcnuikit.com.",
      title: "Get Support",
    },
  ];

  const totalSteps = stepContent.length;

  const handleContinue = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) setStep(1);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Onboarding</Button>
      </DialogTrigger>
      <DialogContent className="gap-0 [&>button:last-child]:text-white">
        <DialogHeader>
          <DialogTitle className="font-normal">
            {stepContent[step - 1].title}
          </DialogTitle>
          <DialogDescription>
            {stepContent[step - 1].description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex justify-center space-x-1.5 max-sm:order-1">
            {[...Array(totalSteps)].map((_, index) => (
              <div
                className={cn(
                  "bg-primary size-1.5 rounded-full",
                  index + 1 === step ? "bg-primary" : "opacity-20",
                )}
                key={String(index)}
              />
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Skip
              </Button>
            </DialogClose>
            {step < totalSteps ? (
              <Button onClick={handleContinue} type="button">
                Next
                <ArrowRightIcon
                  aria-hidden="true"
                  className="transition-transform"
                />
              </Button>
            ) : (
              <DialogClose asChild>
                <Button type="button">Okay</Button>
              </DialogClose>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
