"use client";

import { FileIcon, PaperclipIcon, SendIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatBytes, useFileUpload, type FileMetadata } from "@/hooks/use-file-upload";

const initialFiles: FileMetadata[] = [
  {
    id: "attachment-1",
    name: "dashboard-preview.jpeg",
    size: 265523,
    type: "image/jpeg",
    url: "/images/products/05.jpeg"
  }
];

export default function Component() {
  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024;

  const [{ files, errors }, { openFileDialog, removeFile, getInputProps }] = useFileUpload({
    initialFiles,
    maxSize
  });

  const file = files[0];
  const isImage = file?.file.type.startsWith("image/");

  return (
    <div className="w-full max-w-lg space-y-4">
      <input {...getInputProps()} className="sr-only" aria-label="Attach file" />

      {file && (
        <div className="bg-background flex items-center gap-3 rounded-xl border p-3">
          <div className="bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border">
            {isImage && file.preview ? (
              <img
                src={file.preview}
                alt={file.file.name}
                className="size-full object-cover"
              />
            ) : (
              <FileIcon className="size-5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.file.name}</p>
            <p className="text-muted-foreground text-sm">{formatBytes(file.file.size, 1)}</p>
          </div>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground size-8"
            onClick={() => removeFile(file.id)}
            aria-label="Remove attachment">
            <XIcon className="size-4" />
          </Button>
        </div>
      )}

      <div className="bg-background flex items-center gap-3 rounded-xl border p-3">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="text-foreground size-10 shrink-0"
          onClick={openFileDialog}
          aria-label="Attach file">
          <PaperclipIcon className="size-5" />
        </Button>
        <Input placeholder="Type a message..." className="h-10 flex-1" />
        <Button type="button" size="icon" className="size-10 shrink-0" aria-label="Send message">
          <SendIcon className="size-4" />
        </Button>
      </div>

      {errors.length > 0 && (
        <p className="text-destructive text-sm" role="alert">
          {errors[0]}
        </p>
      )}
    </div>
  );
}
