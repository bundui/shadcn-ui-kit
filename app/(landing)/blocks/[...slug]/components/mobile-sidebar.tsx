"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ListTree } from "lucide-react";
import ComponentsSidebar from "./sidebar";
import { Button } from "@/components/ui/button";

export default function ComponentsMobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="flex xl:hidden">
        <Button variant="outline">
          <ListTree />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="px-4! lg:px-0">
        <ComponentsSidebar />
      </SheetContent>
    </Sheet>
  );
}
