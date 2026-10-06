import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { LoaderCircleIcon } from "lucide-react";

export default function AvatarComponent() {
  return (
    <Avatar className="relative size-12">
      <AvatarImage alt="Tobias Whetton" src="https://i.pravatar.cc/150?img=1" />
      <div className="bg-background/30 absolute inset-0 flex cursor-pointer items-center justify-center rounded-full p-1">
        <LoaderCircleIcon className="size-6 animate-spin text-white" />
      </div>
    </Avatar>
  );
}
