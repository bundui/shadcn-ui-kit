import { addDays } from "date-fns";

import { Calendar } from "@/components/ui/calendar";

export default function Component() {
  const today = new Date();

  return (
    <div>
      <Calendar
        className="rounded-md border p-2"
        disabled={[
          { before: new Date() },
          new Date(),
          { dayOfWeek: [0, 6] },
          {
            from: addDays(today, 14),
            to: addDays(today, 16)
          },
          {
            from: addDays(today, 23),
            to: addDays(today, 24)
          }
        ]}
        excludeDisabled
        mode="range"
      />
    </div>
  );
}
