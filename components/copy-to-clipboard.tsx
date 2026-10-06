"use client";

import { CopyToClipboard as CopyToClipboardComp } from "react-copy-to-clipboard";
import { Button } from "./ui/button";
import { Check, Clipboard } from "lucide-react";
import { useState } from "react";

export default function CopyToClipboard({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <CopyToClipboardComp text={text} onCopy={() => setTimeout(() => setCopied(false), 1000)}>
      <Button className="bg-transparent!" onClick={() => setCopied(true)}>
        {copied ? (
          <Check className="text-white/50 w-4 h-4" />
        ) : (
          <Clipboard className="text-white/50 w-4 h-4" />
        )}
      </Button>
    </CopyToClipboardComp>
  );
}
