"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useId, useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function Component() {
  const id = useId();
  const [date, setDate] = useState<Date | undefined>();

  return (
    <div className="w-full max-w-xs *:not-first:mt-2">
      <Label htmlFor={id}>Date picker</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className="group border-input bg-background hover:bg-background w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
            id={id}
            variant={"outline"}>
            <span className={cn("truncate", !date && "text-muted-foreground")}>
              {date ? format(date, "PPP") : "Pick a date"}
            </span>
            <CalendarIcon
              aria-hidden="true"
              className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors"
              size={16}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-2">
          <Calendar mode="single" onSelect={setDate} selected={date} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
