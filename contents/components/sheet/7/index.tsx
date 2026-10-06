"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";

export default function SheetComponent() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 px-4">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage src="https://i.pravatar.cc/150?img=12" alt="Profile" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Button variant="link" className="text-primary h-auto p-0">
              Change Picture
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="John Doe" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="sales@andromedia.co.id" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" defaultValue="+6289612311111" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" defaultValue="************" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="retype-password">Retype Password</Label>
              <Input id="retype-password" type="password" defaultValue="************" />
            </div>
          </div>
        </div>

        <SheetFooter className="flex gap-3 px-4">
          <Button>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
