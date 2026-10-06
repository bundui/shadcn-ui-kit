import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AvatarComponent() {
  return (
    <div className="relative w-fit">
      <Avatar className="ring-offset-background size-12 ring-2 ring-green-500 ring-offset-2">
        <AvatarImage alt="@tobybelhome" src="https://i.pravatar.cc/150?img=1" />
        <AvatarFallback>TB</AvatarFallback>
      </Avatar>
    </div>
  );
}
