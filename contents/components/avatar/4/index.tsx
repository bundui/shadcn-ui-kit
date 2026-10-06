import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export default function AvatarComponent() {
  return (
    <Avatar>
      <AvatarImage alt="Kelly King" src="https://i.pravatar.cc/150?img=80" />
      <AvatarFallback>KK</AvatarFallback>
      <AvatarBadge className="bg-emerald-500">
        <span className="sr-only">Online</span>
      </AvatarBadge>
    </Avatar>
  );
}
