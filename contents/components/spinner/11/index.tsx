import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";

export default function SpinnerComponent() {
  return (
    <Avatar className="relative size-10">
      <AvatarImage alt="Tobias Whetton" src="https://i.pravatar.cc/150?img=3" />
      <div className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/20 p-1">
        <Spinner className="size-6 animate-spin text-white" />
      </div>
    </Avatar>
  );
}
