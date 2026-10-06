import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CameraIcon } from "lucide-react";

export default function AvatarComponent() {
  return (
    <Avatar className="relative size-12">
      <AvatarImage alt="Tobias Whetton" src="https://i.pravatar.cc/150?img=1" />
      <button className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 p-1 opacity-0 transition-opacity hover:opacity-100">
        <CameraIcon className="size-5 text-white" />
      </button>
    </Avatar>
  );
}
