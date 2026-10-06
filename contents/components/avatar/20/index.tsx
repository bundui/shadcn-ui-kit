import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";

export default function AvatarComponent() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <AvatarGroup>
        <Avatar>
          <AvatarImage
            src="https://i.pravatar.cc/150?img=1"
            alt="Sarah Belhome"
          />
          <AvatarFallback>SB</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src="https://i.pravatar.cc/150?img=2"
            alt="Max Belhome"
          />
          <AvatarFallback>MB</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src="https://i.pravatar.cc/150?img=3"
            alt="Evil Rabbit"
          />
          <AvatarFallback>BR</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+4</AvatarGroupCount>
      </AvatarGroup>
      <div className="space-y-0.5">
        <h6 className="text-sm font-medium">No active collaborators</h6>
        <p className="text-muted-foreground text-xs">
          Invite teammates to start working together.
        </p>
      </div>
    </div>
  );
}
