"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";

export default function BasicDatePicker() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="border rounded-lg">
      <Calendar mode="single" selected={date} onSelect={setDate} />
    </div>
  );
}
