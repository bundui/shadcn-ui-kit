"use client";

import {
  FileArchiveIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  Trash2Icon,
  UploadIcon,
  VideoIcon,
  XIcon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatBytes, useFileUpload, type FileMetadata } from "@/hooks/use-file-upload";
import { cn } from "@/lib/utils";

const initialFiles: FileMetadata[] = [
  {
    id: "file-1",
    name: "brand-assets.zip",
    size: 252873,
    type: "application/zip",
    url: "#"
  },
  {
    id: "file-2",
    name: "cover-photo.jpg",
    size: 1530820,
    type: "image/jpeg",
    url: "#"
  },
  {
    id: "file-3",
    name: "intro-theme.mp3",
    size: 1530820,
    type: "audio/mpeg",
    url: "#"
  }
];

function getFileIcon(type: string, name: string) {
  if (type.startsWith("image/")) return ImageIcon;
  if (type.startsWith("audio/")) return HeadphonesIcon;
  if (type.startsWith("video/")) return VideoIcon;
  if (type.includes("pdf") || type.startsWith("text/")) return FileTextIcon;
  if (type.includes("sheet") || type.includes("csv")) return FileSpreadsheetIcon;
  if (/\.(zip|rar|7z|tar|gz)$/i.test(name)) return FileArchiveIcon;
  return FileIcon;
}

export default function Component() {
  const maxFiles = 6;
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
      clearFiles,
      getInputProps
    }
  ] = useFileUpload({
    initialFiles,
    maxFiles,
    maxSize,
    multiple: true
  });

  return (
    <div className="w-full max-w-lg space-y-2">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        className={cn(
          "border-input data-[dragging=true]:bg-accent/40 flex min-h-56 w-full flex-col rounded-xl border border-dashed p-4 transition-colors",
          files.length === 0 && "items-center justify-center p-6"
        )}>
        <input {...getInputProps()} className="sr-only" aria-label="Upload files" />

        {files.length === 0 ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="border-input text-muted-foreground flex size-14 items-center justify-center rounded-full border">
              <ImageIcon className="size-5" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-medium">Drop your files here</p>
              <p className="text-muted-foreground text-sm">
                Max {maxFiles} files &middot; Up to {maxSizeMB}MB
              </p>
            </div>
            <Button type="button" variant="outline" onClick={openFileDialog}>
              <UploadIcon />
              Select files
            </Button>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-medium">Files ({files.length})</h3>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={openFileDialog}
                  disabled={files.length >= maxFiles}>
                  <UploadIcon />
                  Add files
                </Button>
                <Button type="button" variant="outline" onClick={clearFiles}>
                  <Trash2Icon />
                  Remove all
                </Button>
              </div>
            </div>

            <ul className="flex flex-col gap-3">
              {files.map((file) => {
                const Icon = getFileIcon(file.file.type, file.file.name);

                return (
                  <li
                    key={file.id}
                    className="bg-background flex items-center gap-3 rounded-lg border p-3">
                    <div className="text-foreground flex size-10 shrink-0 items-center justify-center rounded-md border">
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{file.file.name}</p>
                      <p className="text-muted-foreground text-sm">
                        {formatBytes(file.file.size)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground hover:text-foreground size-8"
                      onClick={() => removeFile(file.id)}
                      aria-label={`Remove ${file.file.name}`}>
                      <XIcon className="size-4" />
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>
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
