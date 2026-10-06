import { UserRoundIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AvatarComponent() {
  return (
    <Avatar>
      <AvatarFallback>
        <UserRoundIcon aria-hidden="true" className="opacity-60" size={16} />
      </AvatarFallback>
    </Avatar>
  );
}
