"use client";

import { addDays } from "date-fns";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";

export default function Component() {
  const today = new Date();
  const [date, setDate] = useState<DateRange | undefined>({
    from: today,
    to: addDays(today, 25)
  });

  return (
    <Calendar
      className="rounded-md border p-2"
      mode="range"
      numberOfMonths={2}
      onSelect={setDate}
      pagedNavigation
      selected={date}
      showOutsideDays={false}
    />
  );
}
