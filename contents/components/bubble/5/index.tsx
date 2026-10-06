import { Bubble, BubbleContent } from "@/components/ui/bubble";

export default function BubbleDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Bubble variant="muted">
        <BubbleContent>
          I published the changelog, you can read it here:
        </BubbleContent>
      </Bubble>
      <Bubble variant="outline">
        <BubbleContent asChild>
          <a href="#">Release v2.4 — What&apos;s new in this build</a>
        </BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent asChild>
          <button type="button">Tap to copy the invite link</button>
        </BubbleContent>
      </Bubble>
    </div>
  );
}
