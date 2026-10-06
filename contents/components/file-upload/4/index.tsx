"use client";

import { Button } from "@/components/ui/button";
import { useFileUpload, type FileMetadata } from "@/hooks/use-file-upload";

const initialFiles: FileMetadata[] = [
  {
    id: "file-1",
    name: "team-workspace.jpg",
    size: 384512,
    type: "image/jpeg",
    url: "/images/extra/image1.jpg"
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
    <div className="w-fit max-w-sm space-y-3">
      <input {...getInputProps()} className="sr-only" aria-label="Upload image file" />

      <div className="flex items-center gap-3">
        {file?.preview && (
          <div className="size-12 shrink-0 overflow-hidden rounded-lg border">
            <img
              src={file.preview}
              alt={file.file.name}
              className="size-full object-cover"
            />
          </div>
        )}
        <Button type="button" onClick={openFileDialog}>
          Upload image
        </Button>
      </div>

      {file && (
        <div className="flex items-center gap-3">
          <p className="text-muted-foreground truncate text-sm">{file.file.name}</p>
          <Button
            type="button"
            variant="link"
            className="text-destructive h-auto p-0"
            onClick={() => removeFile(file.id)}>
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}
