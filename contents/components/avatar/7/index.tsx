import { Avatar, AvatarGroup, AvatarImage } from "@/components/ui/avatar";

export default function AvatarComponent() {
  return (
    <AvatarGroup>
      <Avatar>
        <AvatarImage alt="Avatar 01" src="https://i.pravatar.cc/150?img=1" />
      </Avatar>
      <Avatar>
        <AvatarImage alt="Avatar 02" src="https://i.pravatar.cc/150?img=2" />
      </Avatar>
      <Avatar>
        <AvatarImage alt="Avatar 03" src="https://i.pravatar.cc/150?img=3" />
      </Avatar>
      <Avatar>
        <AvatarImage alt="Avatar 04" src="https://i.pravatar.cc/150?img=4" />
      </Avatar>
    </AvatarGroup>
  );
}
