import {
  Bubble,
  BubbleContent,
  BubbleReactions,
} from "@/components/ui/bubble";

export default function BubbleDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8 py-4">
      <Bubble variant="muted">
        <BubbleContent>
          We just crossed 10k downloads on the starter kit!
        </BubbleContent>
        <BubbleReactions aria-label="Reactions: fire and party" role="img">
          <span>🔥</span>
          <span>🎉</span>
        </BubbleReactions>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>
          Huge milestone. Drinks are on me on Friday.
        </BubbleContent>
        <BubbleReactions
          align="start"
          aria-label="Reactions: thumbs up and 3 more"
          role="img"
        >
          <span>👍</span>
          <span>+3</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>
          Counting on that. I will bring the launch checklist so we can plan
          the next release too.
        </BubbleContent>
        <BubbleReactions
          aria-label="Reaction: eyes"
          role="img"
          side="top"
        >
          <span>👀</span>
        </BubbleReactions>
      </Bubble>
    </div>
  );
}
