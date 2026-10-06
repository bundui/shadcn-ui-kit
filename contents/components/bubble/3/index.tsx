import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble";

export default function BubbleDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <BubbleGroup>
        <Bubble variant="muted">
          <BubbleContent>Did you see the release notes?</BubbleContent>
        </Bubble>
        <Bubble variant="muted">
          <BubbleContent>
            The new table blocks look great and the dark mode contrast is much
            better now.
          </BubbleContent>
        </Bubble>
        <Bubble variant="muted">
          <BubbleContent>We should upgrade this week.</BubbleContent>
        </Bubble>
      </BubbleGroup>
      <BubbleGroup>
        <Bubble align="end">
          <BubbleContent>Agreed, I already tried the beta.</BubbleContent>
        </Bubble>
        <Bubble align="end">
          <BubbleContent>
            I will open a migration branch tomorrow morning.
          </BubbleContent>
        </Bubble>
      </BubbleGroup>
    </div>
  );
}
