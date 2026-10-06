"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ToastComponent() {
  const handleOrderPlaced = () => {
    toast.success("Order confirmed", {
      description: "Your order #12345 has been placed and will be processed shortly.",
      duration: 4000,
      action: {
        label: "View Order",
        onClick: () => {
          toast.info("Redirecting to order details...");
        }
      }
    });
  };

  return (
    <Button variant="outline" onClick={handleOrderPlaced}>
      Place Order
    </Button>
  );
}

