"use client";

import { ImageUpIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFileUpload, type FileMetadata } from "@/hooks/use-file-upload";

const initialFiles: FileMetadata[] = [
  {
    id: "file-1",
    name: "analytics-overview.jpeg",
    size: 612430,
    type: "image/jpeg",
    url: "/images/extra/image2.jpg"
  }
];

export default function Component() {
  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024;

  const [{ files }, { openFileDialog, removeFile, getInputProps }] = useFileUpload({
    accept: "image/*",
    initialFiles,
    maxSize
  });

  const file = files[0];

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-3">
      <input {...getInputProps()} className="sr-only" aria-label="Upload image file" />

      <div className="relative">
        {file?.preview ? (
          <>
            <div className="bg-background size-24 rounded-xl border p-1">
              <img
                src={file.preview}
                alt={file.file.name}
                className="size-full rounded-lg object-cover"
              />
            </div>
            <Button
              type="button"
              size="icon"
              className="border-background absolute -end-2.5 -top-2.5 size-8 rounded-full border-2"
              onClick={() => removeFile(file.id)}
              aria-label="Remove image">
              <XIcon className="size-4" />
            </Button>
          </>
        ) : (
          <button
            type="button"
            onClick={openFileDialog}
            className="border-input text-muted-foreground hover:bg-accent/40 focus-visible:border-ring focus-visible:ring-ring/50 flex size-24 items-center justify-center rounded-xl border border-dashed transition-colors outline-none focus-visible:ring-[3px]"
            aria-label="Upload image">
            <ImageUpIcon className="size-5" />
          </button>
        )}
      </div>

      {file && <p className="max-w-full truncate text-sm">{file.file.name}</p>}
    </div>
  );
}
