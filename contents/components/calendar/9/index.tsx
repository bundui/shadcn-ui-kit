"use client";

import {
  eachMonthOfInterval,
  eachYearOfInterval,
  endOfYear,
  format,
  isAfter,
  isBefore,
  startOfYear
} from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CaptionLabelProps, MonthGridProps } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Component() {
  const today = new Date();
  const [month, setMonth] = useState(today);
  const [date, setDate] = useState<Date | undefined>(today);
  const [isYearView, setIsYearView] = useState(false);
  const startDate = new Date(1980, 6);
  const endDate = new Date(2030, 6);

  const years = eachYearOfInterval({
    end: endOfYear(endDate),
    start: startOfYear(startDate)
  });

  return (
    <Calendar
      className="overflow-hidden rounded-md border p-2"
      classNames={{
        month_caption: "flex items-center h-8 justify-start",
        nav: "flex justify-end absolute w-full items-center"
      }}
      components={{
        CaptionLabel: (props: CaptionLabelProps) => (
          <CaptionLabel isYearView={isYearView} setIsYearView={setIsYearView} {...props} />
        ),
        MonthGrid: (props: MonthGridProps) => {
          return (
            <MonthGrid
              className={props.className}
              currentMonth={month.getMonth()}
              currentYear={month.getFullYear()}
              endDate={endDate}
              isYearView={isYearView}
              onMonthSelect={(selectedMonth: Date) => {
                setMonth(selectedMonth);
                setIsYearView(false);
              }}
              setIsYearView={setIsYearView}
              startDate={startDate}
              years={years}>
              {props.children}
            </MonthGrid>
          );
        }
      }}
      defaultMonth={new Date()}
      endMonth={endDate}
      mode="single"
      month={month}
      onMonthChange={setMonth}
      onSelect={setDate}
      selected={date}
      startMonth={startDate}
    />
  );
}

function MonthGrid({
  className,
  children,
  isYearView,
  startDate,
  endDate,
  years,
  currentYear,
  currentMonth,
  onMonthSelect
}: {
  className?: string;
  children: React.ReactNode;
  isYearView: boolean;
  setIsYearView: React.Dispatch<React.SetStateAction<boolean>>;
  startDate: Date;
  endDate: Date;
  years: Date[];
  currentYear: number;
  currentMonth: number;
  onMonthSelect: (date: Date) => void;
}) {
  const currentYearRef = useRef<HTMLDivElement>(null);
  const currentMonthButtonRef = useRef<HTMLButtonElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isYearView && currentYearRef.current && scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      ) as HTMLElement;
      if (viewport) {
        const yearTop = currentYearRef.current.offsetTop;
        viewport.scrollTop = yearTop;
      }
      setTimeout(() => {
        currentMonthButtonRef.current?.focus();
      }, 100);
    }
  }, [isYearView]);

  return (
    <div className="relative">
      <table className={className}>{children}</table>
      {isYearView && (
        <div className="bg-background absolute inset-0 z-20 -mx-2 -mb-2">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            {years.map((year) => {
              const months = eachMonthOfInterval({
                end: endOfYear(year),
                start: startOfYear(year)
              });
              const isCurrentYear = year.getFullYear() === currentYear;

              return (
                <div key={year.getFullYear()} ref={isCurrentYear ? currentYearRef : undefined}>
                  <CollapsibleYear open={isCurrentYear} title={year.getFullYear().toString()}>
                    <div className="grid grid-cols-3 gap-2">
                      {months.map((month) => {
                        const isDisabled = isBefore(month, startDate) || isAfter(month, endDate);
                        const isCurrentMonth =
                          month.getMonth() === currentMonth && year.getFullYear() === currentYear;

                        return (
                          <Button
                            className="h-7"
                            disabled={isDisabled}
                            key={month.getTime()}
                            onClick={() => onMonthSelect(month)}
                            ref={isCurrentMonth ? currentMonthButtonRef : undefined}
                            size="sm"
                            variant={isCurrentMonth ? "default" : "outline"}>
                            {format(month, "MMM")}
                          </Button>
                        );
                      })}
                    </div>
                  </CollapsibleYear>
                </div>
              );
            })}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

function CaptionLabel({
  children,
  isYearView,
  setIsYearView
}: {
  isYearView: boolean;
  setIsYearView: React.Dispatch<React.SetStateAction<boolean>>;
} & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <Button
      className="data-[state=open]:text-muted-foreground/80 -ms-2 flex items-center gap-2 text-sm font-medium hover:bg-transparent [&[data-state=open]>svg]:rotate-180"
      data-state={isYearView ? "open" : "closed"}
      onClick={() => setIsYearView((prev) => !prev)}
      size="sm"
      variant="ghost">
      {children}
      <ChevronDownIcon
        aria-hidden="true"
        className="text-muted-foreground/80 shrink-0 transition-transform duration-200"
        size={16}
      />
    </Button>
  );
}

function CollapsibleYear({
  title,
  children,
  open
}: {
  title: string;
  children: React.ReactNode;
  open?: boolean;
}) {
  return (
    <Collapsible className="border-t px-2 py-1.5" defaultOpen={open}>
      <CollapsibleTrigger asChild>
        <Button
          className="flex w-full justify-start gap-2 text-sm font-medium hover:bg-transparent [&[data-state=open]>svg]:rotate-180"
          size="sm"
          variant="ghost">
          <ChevronDownIcon
            aria-hidden="true"
            className="text-muted-foreground/80 shrink-0 transition-transform duration-200"
            size={16}
          />
          {title}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden px-3 py-1 text-sm transition-all">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
