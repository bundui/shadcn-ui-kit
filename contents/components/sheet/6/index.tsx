"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";

export default function SheetComponent() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Bottom Sheet</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Quick Actions</SheetTitle>
          <SheetDescription>Choose an action to perform.</SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-3 p-4">
          <Button variant="outline" className="h-20 flex-col">
            <span className="mb-1 text-2xl">📷</span>
            <span>Take Photo</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <span className="mb-1 text-2xl">📁</span>
            <span>Choose File</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <span className="mb-1 text-2xl">📍</span>
            <span>Location</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <span className="mb-1 text-2xl">✏️</span>
            <span>Edit</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
