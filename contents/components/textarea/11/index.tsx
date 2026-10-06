import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

export default function TextareaComponent() {
  return (
    <div className="flex w-full items-start max-w-sm gap-2">
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/150?u=1" />
        <AvatarFallback>PJ</AvatarFallback>
      </Avatar>
      <Textarea id="withavatar" placeholder="Enter your name" />
    </div>
  );
}
