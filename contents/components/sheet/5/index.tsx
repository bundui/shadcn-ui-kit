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
        <Button variant="outline">Open Top Sheet</Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>You have 3 new notifications.</SheetDescription>
        </SheetHeader>
        <div className="space-y-3 p-4 pt-0">
          <div className="rounded-lg border p-3">
            <p className="font-medium">New message received</p>
            <p className="text-muted-foreground text-sm">You have a new message from John Doe</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="font-medium">Task completed</p>
            <p className="text-muted-foreground text-sm">Your task has been marked as completed</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="font-medium">System update</p>
            <p className="text-muted-foreground text-sm">A new system update is available</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
