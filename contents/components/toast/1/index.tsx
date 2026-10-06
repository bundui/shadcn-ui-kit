"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Example() {
  return (
    <Button
      variant="outline"
      onClick={() => {
        toast("Scheduled: Catch up", {
          description: "Friday, February 10, 2023 at 5:57 PM",
        });
      }}
    >
      Show Toast
    </Button>
  );
}

