"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ToastComponent() {
  const handleEmailSent = () => {
    toast.success("Email sent successfully", {
      description: "Your message has been delivered to the recipient.",
      duration: 3000
    });
  };

  return (
    <Button variant="outline" onClick={handleEmailSent}>
      Send Email
    </Button>
  );
}
