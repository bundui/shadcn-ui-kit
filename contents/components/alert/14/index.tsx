import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckIcon, XIcon } from "lucide-react";

export default function AlertComponent() {
  return (
    <Alert className="grid-cols-[auto_1fr_auto]! items-center">
      <AlertDescription>A friend request has been sent.</AlertDescription>
      <div className="ms-auto flex gap-2">
        <Button variant="outline" size="icon-sm" className="rounded-full">
          <CheckIcon />
        </Button>
        <Button variant="destructive" size="icon-sm" className="rounded-full">
          <XIcon />
        </Button>
      </div>
    </Alert>
  );
}
