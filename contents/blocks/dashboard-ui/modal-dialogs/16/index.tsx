"use client";

import * as React from "react";
import { ReceiptTextIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ReceiptUploadedDialog() {
  const [open, setOpen] = React.useState(true);

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-8">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Send my receipt</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md" showCloseButton={false}>
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-muted">
                <ReceiptTextIcon className="size-6 text-green-600" />
              </span>

              <DialogHeader className="items-center gap-2">
                <DialogTitle className="text-lg">
                  Transfer Slip Uploaded
                </DialogTitle>
                <DialogDescription className="max-w-xs">
                  We have received your transfer slip! Course access will
                  unlock once our team confirms the payment!
                </DialogDescription>
              </DialogHeader>

              <Button
                className="mt-2 rounded-full px-8"
                onClick={() => setOpen(false)}
              >
                Great, Thanks!
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
