"use client";

import * as React from "react";
import { startOfDay, subDays, endOfDay } from "date-fns";
import { DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";

export default function DatePickerWithRange() {
  const today = new Date();
  const sevenDaysAgo = subDays(today, 6);

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startOfDay(sevenDaysAgo),
    to: endOfDay(today)
  });

  return (
    <div className="border rounded-lg">
      <Calendar
        mode="range"
        defaultMonth={date?.from}
        selected={date}
        onSelect={setDate}
        numberOfMonths={2}
      />
    </div>
  );
}
