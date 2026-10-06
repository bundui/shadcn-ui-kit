"use client";

import { addDays } from "date-fns";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

export default function Component() {
  const today = new Date();
  const selectedDay = addDays(today, -28);
  const [month, setMonth] = useState(selectedDay);
  const [date, setDate] = useState<Date | undefined>(selectedDay);

  return (
    <div className="rounded-md border p-2">
      <Calendar
        mode="single"
        month={month}
        onMonthChange={setMonth}
        onSelect={setDate}
        selected={date}
      />
      <Button
        className="mt-2 mb-1"
        onClick={() => {
          setDate(today);
          setMonth(today);
        }}
        size="sm"
        variant="outline">
        Today
      </Button>
    </div>
  );
}
