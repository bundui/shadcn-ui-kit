"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ToastComponent() {
  const promise = () =>
    new Promise((_, reject) => setTimeout(() => reject({ name: "Sonner" }), 2000));

  const handleSyncError = () => {
    toast.promise(promise, {
      loading: "Syncing data...",
      success: "Data synced successfully",
      error: "Failed to sync data"
    });
  };

  return (
    <Button variant="outline" onClick={handleSyncError}>
      Sync Error
    </Button>
  );
}
