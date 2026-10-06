"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Example() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast("Event has been created", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
          position: "top-center",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo")
          }
        })
      }>
      Toast at Top Center
    </Button>
  );
}
