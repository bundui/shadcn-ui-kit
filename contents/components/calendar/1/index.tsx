"use client";

import { useState } from "react";

import { Calendar } from "@/components/ui/calendar";

export default function Component() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div>
      <Calendar
        className="rounded-md border p-2"
        mode="single"
        onSelect={setDate}
        selected={date}
      />
    </div>
  );
}
