import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { InfoIcon } from "lucide-react";

export default function DrawerComponent() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 text-sm">
          <InfoIcon className="size-4" /> More Info
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="font-normal">Additional Information</DrawerTitle>
            <DrawerDescription>
              Learn more about this feature below.
            </DrawerDescription>
          </DrawerHeader>
          <div className="text-muted-foreground p-4 text-sm">
            This drawer provides extra context and details that may help you
            make better decisions when using our product.
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button size="sm" variant="outline">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
