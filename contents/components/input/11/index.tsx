"use client";

import { Check, Copy } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from "@/components/ui/input-group";

export default function Component() {
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  return (
    <div className="w-full max-w-sm">
      <InputGroup>
        <InputGroupInput placeholder="https://x.com/shadcn" readOnly />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label="Copy"
            title="Copy"
            size="icon-xs"
            onClick={() => {
              copyToClipboard("https://x.com/shadcn");
            }}>
            {isCopied ? <Check /> : <Copy />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
