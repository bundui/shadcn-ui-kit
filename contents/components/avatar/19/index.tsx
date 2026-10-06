import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AvatarComponent() {
  return (
    <div className="flex items-center gap-1.5">
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/150?img=1" alt="Toby Belhome" />
        <AvatarFallback>TB</AvatarFallback>
      </Avatar>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold">Toby Belhome</span>
        </div>
        <span className="text-muted-foreground text-xs">Developer</span>
      </div>
    </div>
  );
}
