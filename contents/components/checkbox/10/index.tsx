import { useId } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Component() {
  const id = useId();
  return (
    <div className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
      <Checkbox
        aria-describedby={`${id}-description`}
        className="order-1 after:absolute after:inset-0"
        id={id}
      />
      <div className="flex grow items-center gap-3">
        <Avatar>
          <AvatarImage src="https://i.pravatar.cc/150?u=shadcn" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="grid gap-2">
          <Label htmlFor={id}>
            Label{" "}
            <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
              (Sublabel)
            </span>
          </Label>
          <p className="text-muted-foreground text-xs" id={`${id}-description`}>
            A short description goes here.
          </p>
        </div>
      </div>
    </div>
  );
}
