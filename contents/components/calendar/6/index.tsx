"use client";

import { useState } from "react";
import type { DropdownNavProps, DropdownProps } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export default function Component() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleCalendarChange = (
    _value: string | number,
    _e: React.ChangeEventHandler<HTMLSelectElement>
  ) => {
    const _event = {
      target: {
        value: String(_value)
      }
    } as React.ChangeEvent<HTMLSelectElement>;
    _e(_event);
  };

  return (
    <div>
      <Calendar
        captionLayout="dropdown"
        className="rounded-md border p-2"
        classNames={{
          month_caption: "mx-0"
        }}
        components={{
          Dropdown: (props: DropdownProps) => {
            return (
              <Select
                onValueChange={(value) => {
                  if (props.onChange) {
                    handleCalendarChange(value, props.onChange);
                  }
                }}
                value={String(props.value)}>
                <SelectTrigger className="h-8 w-fit font-medium first:grow">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[min(26rem,var(--radix-select-content-available-height))]">
                  {props.options?.map((option) => (
                    <SelectItem
                      disabled={option.disabled}
                      key={option.value}
                      value={String(option.value)}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          },
          DropdownNav: (props: DropdownNavProps) => {
            return <div className="flex w-full items-center gap-2">{props.children}</div>;
          }
        }}
        defaultMonth={new Date()}
        hideNavigation
        mode="single"
        onSelect={setDate}
        selected={date}
        startMonth={new Date(1980, 6)}
      />
    </div>
  );
}
