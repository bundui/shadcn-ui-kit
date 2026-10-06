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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DrawerComponent() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Login</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="font-normal">Login</DrawerTitle>
            <DrawerDescription>
              Please login again to continue using the application.
            </DrawerDescription>
          </DrawerHeader>
          <form className="grid gap-4 p-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                required
                id="email"
                type="email"
                autoComplete="username"
                placeholder="hello@shadcnuikit.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                required
                id="password"
                type="password"
                placeholder="••••••••••"
                autoComplete="current-password"
              />
            </div>
          </form>
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
