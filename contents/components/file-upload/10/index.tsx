"use client";

import { FileIcon, ImageIcon, SendIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFileUpload, type FileMetadata } from "@/hooks/use-file-upload";

const initialFiles: FileMetadata[] = [
  {
    id: "attachment-1",
    name: "hoodie-front.jpeg",
    size: 265523,
    type: "image/jpeg",
    url: "/images/products/01.jpeg"
  },
  {
    id: "attachment-2",
    name: "graphic-tee.jpeg",
    size: 312480,
    type: "image/jpeg",
    url: "/images/products/02.jpeg"
  },
  {
    id: "attachment-3",
    name: "jogger-pants.jpeg",
    size: 284190,
    type: "image/jpeg",
    url: "/images/products/03.jpeg"
  }
];

export default function Component() {
  const maxFiles = 6;
  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024;

  const [{ files, isDragging, errors }, actions] = useFileUpload({
    accept: "image/*",
    initialFiles,
    maxFiles,
    maxSize,
    multiple: true
  });

  return (
    <div
      className="w-full max-w-lg space-y-4"
      onDragEnter={actions.handleDragEnter}
      onDragLeave={actions.handleDragLeave}
      onDragOver={actions.handleDragOver}
      onDrop={actions.handleDrop}
      data-dragging={isDragging || undefined}>
      <input {...actions.getInputProps()} className="sr-only" aria-label="Attach files" />

      {files.length > 0 && (
        <ul className="flex flex-wrap gap-3 p-1.5">
          {files.map((file) => (
            <li key={file.id} className="relative">
              <div className="bg-muted text-muted-foreground flex size-20 items-center justify-center overflow-hidden rounded-lg">
                {file.file.type.startsWith("image/") && file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <FileIcon className="size-5" />
                )}
              </div>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="bg-background absolute -end-1.5 -top-1.5 size-6 rounded-full shadow-md"
                onClick={() => actions.removeFile(file.id)}
                aria-label={`Remove ${file.file.name}`}>
                <XIcon className="size-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <div className="bg-background flex items-center gap-2 rounded-xl border p-2">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="text-foreground size-9 shrink-0 rounded-full"
          onClick={actions.openFileDialog}
          disabled={files.length >= maxFiles}
          aria-label="Attach images">
          <ImageIcon className="size-4" />
        </Button>
        <Input
          placeholder="Type a message..."
          className="bg-muted flex-1 rounded-full border-transparent px-4 shadow-none"
        />
        <Button
          type="button"
          size="icon"
          className="size-9 shrink-0 rounded-full"
          aria-label="Send message">
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
