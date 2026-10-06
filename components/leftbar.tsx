"use client";

import { useState } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavMenu } from "./nav-menu";
import { Menu } from "lucide-react";
import { FooterButtons } from "./footer-buttons";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export function SheetLeftBar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="flex xl:hidden"
          aria-label="Open menu"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        onClick={() => setOpen(false)}
        className="flex flex-col gap-4 px-0"
        side="right"
      >
        <SheetHeader>
          <SheetClose asChild>
            <Logo />
          </SheetClose>
        </SheetHeader>
        <ScrollArea className="flex flex-col gap-4">
          <div className="flex flex-1 flex-col gap-2 px-5">
            <NavMenu isSheet />
          </div>
          <div className="flex gap-2 p-4 pb-4">
            <FooterButtons />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
