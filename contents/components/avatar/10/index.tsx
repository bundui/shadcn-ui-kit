import { UserRoundIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AvatarComponent() {
  return (
    <Avatar>
      <AvatarFallback className="bg-indigo-500">
        <UserRoundIcon aria-hidden="true" className="text-white" size={16} />
      </AvatarFallback>
    </Avatar>
  );
}
