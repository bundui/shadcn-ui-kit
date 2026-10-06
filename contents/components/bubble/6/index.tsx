import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble";

export default function BubbleDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="flex items-end gap-2">
        <Avatar size="sm">
          <AvatarImage alt="Mia Park" src="https://i.pravatar.cc/150?img=47" />
          <AvatarFallback>MP</AvatarFallback>
        </Avatar>
        <BubbleGroup>
          <Bubble variant="muted">
            <BubbleContent>
              Morning! Did you get a chance to review the draft?
            </BubbleContent>
          </Bubble>
          <Bubble variant="muted">
            <BubbleContent>No rush, just checking in.</BubbleContent>
          </Bubble>
        </BubbleGroup>
      </div>
      <div className="flex flex-col items-end gap-1">
        <Bubble align="end">
          <BubbleContent>Just finished it. Leaving comments now.</BubbleContent>
        </Bubble>
        <span className="text-muted-foreground text-xs">Read 09:41</span>
      </div>
    </div>
  );
}
