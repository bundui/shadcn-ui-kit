import { ArrowUpRight, Feather } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ProfileCardDemo = () => {
  return (
    <Card className="w-full max-w-sm gap-0 overflow-hidden py-0 shadow-none">
      <CardContent className="relative h-36 overflow-hidden bg-foreground px-0">
        <ArrowUpRight
          className="absolute -top-6 -right-6 size-32 text-orange-600"
          strokeWidth={2.5}
        />
      </CardContent>
      <CardContent className="relative flex flex-col gap-4 pt-4 pb-6">
        <div className="absolute -top-8 left-6 flex size-16 items-center justify-center rounded-full bg-green-700 ring-4 ring-background">
          <Feather className="size-7 text-white" />
        </div>
        <div className="flex justify-end">
          <Button className="rounded-full">Follow</Button>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold leading-snug">
            Notabli AI - Meeting Notetaker
          </h3>
          <p className="text-muted-foreground text-sm">@notabli.ai</p>
        </div>
        <p className="text-sm leading-snug">
          Focus on the Conversation, We&apos;ll Take the Notes.
        </p>
        <div className="flex items-center gap-4 text-sm">
          <p>
            <span className="font-semibold">184</span>{" "}
            <span className="text-muted-foreground">Following</span>
          </p>
          <p>
            <span className="font-semibold">98,215</span>{" "}
            <span className="text-muted-foreground">Followers</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCardDemo;
