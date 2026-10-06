"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ToastComponent() {
  const handlePaymentError = () => {
    toast.error("Payment failed", {
      description: "Your card was declined. Please check your payment details and try again.",
      duration: 5000
    });
  };

  return (
    <Button variant="destructive" onClick={handlePaymentError}>
      Process Payment
    </Button>
  );
}

