import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function DrawerComponent() {
  return (
    <Drawer direction="top">
      <DrawerTrigger asChild>
        <Button variant="outline">Top</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="font-normal">Please login again.</DrawerTitle>
          </DrawerHeader>
          <p className="text-muted-foreground p-4">
            Your session has expired. Please login again to continue using the
            application.
          </p>
          <DrawerFooter>
            <Button type="submit">Login</Button>
            <DrawerClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
