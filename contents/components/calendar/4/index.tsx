"use client";

import { addDays, subDays } from "date-fns";
import { useState } from "react";

import { Calendar } from "@/components/ui/calendar";

export default function Component() {
  const today = new Date();
  const [date, setDate] = useState<Date[] | undefined>([
    subDays(today, 17),
    addDays(today, 2),
    addDays(today, 6),
    addDays(today, 8)
  ]);

  return (
    <Calendar
      className="rounded-md border p-2"
      mode="multiple"
      onSelect={setDate}
      selected={date}
    />
  );
}
