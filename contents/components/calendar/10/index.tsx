"use client";

import { format } from "date-fns";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Component() {
  const today = new Date();
  const [date, setDate] = useState<Date>(today);
  const [time, setTime] = useState<string | null>(null);

  const timeSlots = [
    { available: false, time: "09:00" },
    { available: false, time: "09:30" },
    { available: true, time: "10:00" },
    { available: true, time: "10:30" },
    { available: true, time: "11:00" },
    { available: true, time: "11:30" },
    { available: false, time: "12:00" },
    { available: true, time: "12:30" },
    { available: true, time: "13:00" },
    { available: true, time: "13:30" },
    { available: true, time: "14:00" },
    { available: false, time: "14:30" },
    { available: false, time: "15:00" },
    { available: true, time: "15:30" },
    { available: true, time: "16:00" },
    { available: true, time: "16:30" },
    { available: true, time: "17:00" },
    { available: true, time: "17:30" }
  ];

  return (
    <div className="rounded-md border">
      <div className="flex max-sm:flex-col">
        <Calendar
          className="p-2 sm:pe-5"
          disabled={[
            { before: today }
          ]}
          mode="single"
          onSelect={(newDate) => {
            if (newDate) {
              setDate(newDate);
              setTime(null);
            }
          }}
          selected={date}
        />
        <div className="relative w-full max-sm:h-48 sm:w-40">
          <div className="absolute inset-0 py-4 max-sm:border-t">
            <ScrollArea className="h-full sm:border-s">
              <div className="space-y-3">
                <div className="flex h-5 shrink-0 items-center px-5">
                  <p className="text-sm font-medium">{format(date, "EEEE, d")}</p>
                </div>
                <div className="grid gap-1.5 px-5 max-sm:grid-cols-2">
                  {timeSlots.map(({ time: timeSlot, available }) => (
                    <Button
                      className="w-full"
                      disabled={!available}
                      key={timeSlot}
                      onClick={() => setTime(timeSlot)}
                      size="sm"
                      variant={time === timeSlot ? "default" : "outline"}>
                      {timeSlot}
                    </Button>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
