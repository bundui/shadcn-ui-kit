import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AvatarComponent() {
  return (
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/150?u=shadcn" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
