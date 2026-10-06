"use client";

import { ClockIcon } from "lucide-react";
import { useId, useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Component() {
  const id = useId();
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
      <div className="rounded-md border">
        <Calendar className="p-2" mode="single" onSelect={setDate} selected={date} />
        <div className="border-t p-3">
          <div className="flex items-center gap-3">
            <Label className="text-xs" htmlFor={id}>
              Enter time
            </Label>
            <div className="relative grow">
              <Input
                className="peer appearance-none ps-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                defaultValue="12:00:00"
                id={id}
                step="1"
                type="time"
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                <ClockIcon aria-hidden="true" size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
