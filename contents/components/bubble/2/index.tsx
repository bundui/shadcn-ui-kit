import { Bubble, BubbleContent } from "@/components/ui/bubble";

export default function BubbleDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Bubble variant="default">
        <BubbleContent>Default, strong bubble for the current user.</BubbleContent>
      </Bubble>
      <Bubble variant="secondary">
        <BubbleContent>Secondary, neutral conversation bubble.</BubbleContent>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>Muted, lower emphasis supporting message.</BubbleContent>
      </Bubble>
      <Bubble variant="tinted">
        <BubbleContent>Tinted, subtle primary tinted appearance.</BubbleContent>
      </Bubble>
      <Bubble variant="outline">
        <BubbleContent>Outline, bordered bubble for rich content.</BubbleContent>
      </Bubble>
      <Bubble variant="ghost">
        <BubbleContent>Ghost, unframed text for assistant replies.</BubbleContent>
      </Bubble>
      <Bubble variant="destructive">
        <BubbleContent>Destructive, this message failed to send.</BubbleContent>
      </Bubble>
    </div>
  );
}
