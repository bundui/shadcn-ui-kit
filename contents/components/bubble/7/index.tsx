import { Bubble, BubbleContent } from "@/components/ui/bubble";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function BubbleDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Bubble variant="muted">
        <BubbleContent>Can you summarize the retro notes?</BubbleContent>
      </Bubble>
      <Bubble variant="outline">
        <BubbleContent>
          <Collapsible>
            <p>
              Sure. The short version: releases were smoother this sprint and
              review times dropped by a third.
            </p>
            <CollapsibleContent className="mt-2 space-y-2">
              <p>
                The longer version: automated previews removed most of the
                back and forth on visual changes, and the new checklist caught
                two regressions before they shipped.
              </p>
              <p>
                Action items are assigned in the board, nothing is blocking
                the next release.
              </p>
            </CollapsibleContent>
            <CollapsibleTrigger className="text-muted-foreground hover:text-foreground mt-2 cursor-pointer text-xs font-medium underline underline-offset-2 data-open:hidden">
              Show more
            </CollapsibleTrigger>
          </Collapsible>
        </BubbleContent>
      </Bubble>
    </div>
  );
}
