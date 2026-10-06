import { CheckIcon, RefreshCcwIcon } from "lucide-react";
import { useId } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Component() {
  const id = useId();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Change plan</Button>
      </DialogTrigger>
      <DialogContent className="lg:max-w-md">
        <div className="mb-2 flex flex-col gap-2">
          <DialogHeader>
            <DialogTitle className="text-left font-normal">
              Change your plan
            </DialogTitle>
            <DialogDescription className="text-left">
              Pick one of the following plans.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5">
          <RadioGroup className="gap-2" defaultValue="2">
            <div className="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-accent relative flex w-full items-center gap-2 rounded-md border px-4 py-3 shadow-xs outline-none">
              <RadioGroupItem
                aria-describedby={`${id}-1-description`}
                className="order-1 after:absolute after:inset-0"
                id={`${id}-1`}
                value="1"
              />
              <div className="grid grow gap-1">
                <Label htmlFor={`${id}-1`}>Essential</Label>
                <p
                  className="text-muted-foreground text-xs"
                  id={`${id}-1-description`}
                >
                  $4 per member/month
                </p>
              </div>
            </div>
            <div className="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-accent relative flex w-full items-center gap-2 rounded-md border px-4 py-3 shadow-xs outline-none">
              <RadioGroupItem
                aria-describedby={`${id}-2-description`}
                className="order-1 after:absolute after:inset-0"
                id={`${id}-2`}
                value="2"
              />
              <div className="grid grow gap-1">
                <Label htmlFor={`${id}-2`}>Standard</Label>
                <p
                  className="text-muted-foreground text-xs"
                  id={`${id}-2-description`}
                >
                  $19 per member/month
                </p>
              </div>
            </div>
            <div className="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-accent relative flex w-full items-center gap-2 rounded-md border px-4 py-3 shadow-xs outline-none">
              <RadioGroupItem
                aria-describedby={`${id}-3-description`}
                className="order-1 after:absolute after:inset-0"
                id={`${id}-3`}
                value="3"
              />
              <div className="grid grow gap-1">
                <Label htmlFor={`${id}-3`}>Enterprise</Label>
                <p
                  className="text-muted-foreground text-xs"
                  id={`${id}-3-description`}
                >
                  $32 per member/month
                </p>
              </div>
            </div>
          </RadioGroup>

          <div className="space-y-3">
            <p>
              <strong className="text-sm font-medium">Features include:</strong>
            </p>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li className="flex gap-2">
                <CheckIcon
                  aria-hidden="true"
                  className="text-primary mt-0.5 shrink-0"
                  size={16}
                />
                Create unlimited projects.
              </li>
              <li className="flex gap-2">
                <CheckIcon
                  aria-hidden="true"
                  className="text-primary mt-0.5 shrink-0"
                  size={16}
                />
                Remove watermarks.
              </li>
              <li className="flex gap-2">
                <CheckIcon
                  aria-hidden="true"
                  className="text-primary mt-0.5 shrink-0"
                  size={16}
                />
                Add unlimited users and free viewers.
              </li>
              <li className="flex gap-2">
                <CheckIcon
                  aria-hidden="true"
                  className="text-primary mt-0.5 shrink-0"
                  size={16}
                />
                Upload unlimited files.
              </li>
              <li className="flex gap-2">
                <CheckIcon
                  aria-hidden="true"
                  className="text-primary mt-0.5 shrink-0"
                  size={16}
                />
                7-day money back guarantee.
              </li>
              <li className="flex gap-2">
                <CheckIcon
                  aria-hidden="true"
                  className="text-primary mt-0.5 shrink-0"
                  size={16}
                />
                Advanced permissions.
              </li>
            </ul>
          </div>

          <div className="grid gap-2">
            <Button className="w-full" type="button">
              Change plan
            </Button>
            <DialogClose asChild>
              <Button className="w-full" type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
