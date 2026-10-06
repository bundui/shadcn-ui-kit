"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Example() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  );
}

