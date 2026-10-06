"use client";

import { BellIcon } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Component() {
  const [count, setCount] = useState(3);

  const handleClick = () => {
    setCount(0);
  };

  return (
    <Button
      aria-label="Notifications"
      className="relative"
      onClick={handleClick}
      size="icon"
      variant="outline">
      <BellIcon aria-hidden="true" size={16} />
      {count > 0 && (
        <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1">
          {count > 99 ? "99+" : count}
        </Badge>
      )}
    </Button>
  );
}
