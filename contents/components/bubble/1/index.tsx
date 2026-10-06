import { Bubble, BubbleContent } from "@/components/ui/bubble";

export default function BubbleDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Bubble variant="muted">
        <BubbleContent>Hey! How is the new landing page going?</BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>
          Almost done. I am polishing the hero section right now.
        </BubbleContent>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>Nice, send a preview when you are ready.</BubbleContent>
      </Bubble>
    </div>
  );
}
