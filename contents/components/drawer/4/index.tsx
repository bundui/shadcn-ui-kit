import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function DrawerComponent() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Cookie Settings</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="font-normal">Cookie Settings</DrawerTitle>
            <DrawerDescription>
              Manage your cookie preferences.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <p className="text-muted-foreground text-sm text-center">
              We use cookies to improve your experience. By clicking "Accept all",
              you agree to the storing of cookies on your device to enhance site
              navigation, analyze site usage, and assist in our marketing efforts.
            </p>
          </div>
          <DrawerFooter>
            <Button>Accept all</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
