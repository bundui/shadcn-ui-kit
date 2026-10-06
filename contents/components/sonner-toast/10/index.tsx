"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ToastComponent() {
  const handleNotification = () => {
    toast.custom((t) => (
      <div className="bg-background flex items-start rounded-lg shadow-sm border gap-4 p-4">
        <Avatar className="mt-0.5">
          <AvatarImage src="https://i.pravatar.cc/150?img=2" alt="Sarah" />
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>
        <div>
          <div className="text-sm font-medium">New message from Sarah</div>
          <p className="text-muted-foreground text-sm">Hey! Are you available for a quick call?</p>
          <Button className="mt-2" variant="outline" size="sm" onClick={() => toast.dismiss(t)}>
            Reply
          </Button>
        </div>
      </div>
    ));
  };

  return (
    <Button variant="outline" onClick={handleNotification}>
      Custom Toast
    </Button>
  );
}
