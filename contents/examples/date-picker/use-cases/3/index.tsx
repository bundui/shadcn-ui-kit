"use client";

import * as React from "react";
import {
  subDays,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfDay,
  endOfDay,
  startOfYear,
  startOfWeek
} from "date-fns";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function AdvancedDatePicker() {
  const today = new Date();
  const twentyEightDaysAgo = startOfDay(subDays(today, 27));

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: twentyEightDaysAgo,
    to: endOfDay(today)
  });
  const [open, setOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());

  const handleQuickSelect = (from: Date, to: Date) => {
    setDate({ from, to });
    setCurrentMonth(from);
  };

  const handleToday = () => {
    handleQuickSelect(startOfDay(today), endOfDay(today));
  };

  const handleYesterday = () => {
    const yesterday = subDays(new Date(), 1);
    handleQuickSelect(startOfDay(yesterday), endOfDay(yesterday));
  };

  const handleThisWeek = () => {
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today);
    handleQuickSelect(startOfDay(startOfCurrentWeek), endOfDay(today));
  };

  const handleLast7Days = () => {
    const today = new Date();
    const sevenDaysAgo = subDays(today, 6);
    handleQuickSelect(startOfDay(sevenDaysAgo), endOfDay(today));
  };

  const handleLast28Days = () => {
    const today = new Date();
    const twentyEightDaysAgo = subDays(today, 27);
    handleQuickSelect(startOfDay(twentyEightDaysAgo), endOfDay(today));
  };

  const handleThisMonth = () => {
    const today = new Date();
    handleQuickSelect(startOfMonth(today), endOfDay(today));
  };

  const handleLastMonth = () => {
    const today = new Date();
    const lastMonth = subMonths(today, 1);
    handleQuickSelect(startOfMonth(lastMonth), endOfMonth(lastMonth));
  };

  const handleThisYear = () => {
    const today = new Date();
    const startOfCurrentYear = startOfYear(today);
    handleQuickSelect(startOfDay(startOfCurrentYear), endOfDay(today));
  };

  return (
    <div className="flex border rounded-md p-2">
      <div className="me-2">
        <ToggleGroup type="single" defaultValue="last28Days" className="w-28 flex-col">
          <ToggleGroupItem
            className="text-muted-foreground w-full"
            value="today"
            onClick={handleToday}
            asChild>
            <Button className="justify-start rounded-md">Today</Button>
          </ToggleGroupItem>
          <ToggleGroupItem
            className="text-muted-foreground w-full"
            value="yesterday"
            onClick={handleYesterday}
            asChild>
            <Button className="justify-start rounded-md text-start">Yesterday</Button>
          </ToggleGroupItem>
          <ToggleGroupItem
            className="text-muted-foreground w-full"
            value="last7Days"
            onClick={handleLast7Days}
            asChild>
            <Button className="justify-start rounded-md">Last 7 days</Button>
          </ToggleGroupItem>
          <ToggleGroupItem
            className="text-muted-foreground w-full"
            value="thisWeek"
            onClick={handleThisWeek}
            asChild>
            <Button className="justify-start rounded-md">This week</Button>
          </ToggleGroupItem>
          <ToggleGroupItem
            className="text-muted-foreground w-full"
            value="last28Days"
            onClick={handleLast28Days}
            asChild>
            <Button className="justify-start rounded-md">Last 28 days</Button>
          </ToggleGroupItem>
          <ToggleGroupItem
            className="text-muted-foreground w-full"
            value="thisMonth"
            onClick={handleThisMonth}
            asChild>
            <Button className="justify-start rounded-md text-start">This month</Button>
          </ToggleGroupItem>
          <ToggleGroupItem
            className="text-muted-foreground w-full"
            value="lastMonth"
            onClick={handleLastMonth}
            asChild>
            <Button className="justify-start rounded-md">Last month</Button>
          </ToggleGroupItem>
          <ToggleGroupItem
            className="text-muted-foreground w-full"
            value="thisYear"
            onClick={handleThisYear}
            asChild>
            <Button className="justify-start rounded-md">This year</Button>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <Calendar
        className="border-s py-0! pe-0!"
        mode="range"
        month={currentMonth}
        selected={date}
        onSelect={(newDate) => {
          setDate(newDate);
          if (newDate?.from) {
            setCurrentMonth(newDate.from);
          }
          if (newDate?.from && newDate?.to) {
            setOpen(false);
          }
        }}
        onMonthChange={setCurrentMonth}
      />
    </div>
  );
}
