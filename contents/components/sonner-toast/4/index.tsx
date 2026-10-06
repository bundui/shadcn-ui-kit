"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ToastComponent() {
  const promise = () =>
    new Promise((resolve) => setTimeout(() => resolve({ name: "Sonner" }), 2000));

  const handleFileUpload = () => {
    toast.promise(promise, {
      loading: "Uploading file...",
      success: "File uploaded successfully",
      error: "Failed to upload file"
    });
  };

  return (
    <Button variant="outline" onClick={handleFileUpload}>
      Upload File
    </Button>
  );
}
