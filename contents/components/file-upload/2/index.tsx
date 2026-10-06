"use client";

import { ImageIcon, UploadIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFileUpload } from "@/hooks/use-file-upload";
import { cn } from "@/lib/utils";

export default function Component() {
  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024;

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/svg+xml,image/png,image/jpeg,image/gif",
    maxSize,
  });

  const previewUrl = files[0]?.preview || null;

  return (
    <div className="w-full max-w-lg space-y-2">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        className={cn(
          "border-input data-[dragging=true]:bg-accent/40 relative flex min-h-56 w-full flex-col items-center justify-center rounded-xl border border-dashed p-6 transition-colors",
        )}
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload image file"
        />

        {previewUrl ? (
          <img
            src={previewUrl}
            alt={files[0]?.file?.name || "Uploaded image"}
            className="mx-auto max-h-32 rounded-lg object-contain"
          />
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="border-input text-muted-foreground flex size-14 items-center justify-center rounded-full border">
              <ImageIcon className="size-4" />
            </div>
            <div className="space-y-1 text-sm">
              <p className="font-medium">Drop your image here</p>
              <p className="text-muted-foreground">
                SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
              </p>
            </div>
            <Button type="button" variant="outline" onClick={openFileDialog}>
              <UploadIcon />
              Select image
            </Button>
          </div>
        )}

        {previewUrl && (
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="absolute end-3 top-3 size-7 rounded-full"
            onClick={() => removeFile(files[0]?.id)}
            aria-label="Remove image"
          >
            <XIcon className="size-4" />
          </Button>
        )}
      </div>

      {errors.length > 0 && (
        <p className="text-destructive text-sm" role="alert">
          {errors[0]}
        </p>
      )}
    </div>
  );
}
