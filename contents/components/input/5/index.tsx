"use client";

import { CheckCircle2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const title = "Success State";

const Example = () => (
  <div className="w-full max-w-sm space-y-2">
    <Label htmlFor="username-success">Username</Label>
    <Input
      className="bg-background border-green-600 focus-visible:border-green-600 focus-visible:ring-green-600/50"
      defaultValue="haydenbleasel"
      id="username-success"
      placeholder="johndoe"
    />
    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
      <CheckCircle2 className="h-4 w-4" />
      <span>Username is available</span>
    </div>
  </div>
);

export default Example;
