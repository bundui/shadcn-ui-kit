"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ToastComponent() {
  const handlePasswordChange = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 2000);
      }),
      {
        style: {
          '--normal-bg': 'light-dark(var(--color-sky-600), var(--color-sky-400))',
          '--normal-text': 'var(--color-white)',
          '--normal-border': 'light-dark(var(--color-sky-600), var(--color-sky-400))'
        } as React.CSSProperties,
        loading: "Changing password...",
        success: "Password changed successfully",
        error: "Failed to change password. Please try again."
      }
    );
  };

  return (
    <Button variant="outline" onClick={handlePasswordChange}>
      Custom Color
    </Button>
  );
}
