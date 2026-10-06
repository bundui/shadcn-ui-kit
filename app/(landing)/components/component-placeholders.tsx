"use client";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  HomeIcon,
  MousePointerClickIcon,
  SearchIcon,
  UserCircleIcon,
  XIcon,
  AlertTriangleIcon,
  ComponentIcon,
  LoaderCircleIcon,
  BoldIcon,
  ItalicIcon,
  ImageUpIcon,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Area, AreaChart } from "recharts";

export const componentPlaceholders = [
  {
    name: "button",
    placeholder: (
      <div className="bg-background flex h-9 w-24 items-center justify-center rounded-md px-4 shadow/5">
        <span className="bg-muted block h-2 w-full rounded-full" />
      </div>
    ),
  },
  {
    name: "button-group",
    placeholder: (
      <div className="bg-background flex w-20 divide-x rounded-md shadow/5">
        <div className="flex h-9 items-center justify-center px-3 grow">
          <BoldIcon className="text-muted-foreground size-3" />
        </div>
        <div className="flex h-9 items-center justify-center px-3 grow">
          <ItalicIcon className="text-muted-foreground size-3" />
        </div>
      </div>
    ),
  },
  {
    name: "avatar",
    placeholder: (
      <div className="bg-background flex size-12 items-center justify-center rounded-full shadow/5">
        <UserCircleIcon className="text-muted-foreground size-5" />
      </div>
    ),
  },
  {
    name: "badge",
    placeholder: (
      <div className="bg-background flex h-6 w-24 items-center justify-center gap-2 rounded-full shadow/5">
        <CheckIcon className="text-muted-foreground size-3" />{" "}
        <span className="bg-muted block h-2 w-1/2 rounded-full" />
      </div>
    ),
  },
  {
    name: "checkbox",
    placeholder: (
      <div className="flex flex-col gap-2">
        <div className="flex h-6 w-48 items-center justify-start gap-1">
          <Checkbox
            className="pointer-events-none scale-70"
            defaultChecked={true}
          />
          <span className="block h-2 w-2/2 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
        <div className="flex h-6 w-48 items-center justify-start gap-1">
          <Checkbox
            className="pointer-events-none scale-70"
            defaultChecked={true}
          />
          <span className="block h-2 w-2/4 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
        <div className="flex h-6 w-48 items-center justify-start gap-1">
          <Checkbox
            className="pointer-events-none scale-70"
            defaultChecked={true}
          />
          <span className="block h-2 w-3/4 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
      </div>
    ),
  },
  {
    name: "alert",
    placeholder: (
      <div className="bg-background w-48 items-center rounded-md shadow/5">
        <div className="flex items-center gap-3 p-3">
          <AlertTriangleIcon className="text-muted-foreground size-3" />
          <div className="block h-2 w-7/12 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
      </div>
    ),
  },
  {
    name: "cards",
    placeholder: (
      <div className="bg-background w-48 items-center space-y-3 rounded-md p-3 shadow/5">
        <span className="block h-2 w-5/12 rounded-full bg-black/10 dark:bg-white/10" />
        <span className="bg-muted block h-2 rounded-full" />
        <span className="bg-muted block h-2 w-10/12 rounded-full" />
        <div className="mt-4 flex h-7 w-14 items-center justify-center rounded-md bg-black/10 px-4 dark:bg-white/10">
          <span className="bg-muted block h-2 w-full rounded-full" />
        </div>
      </div>
    ),
  },
  {
    name: "accordion",
    placeholder: (
      <div className="bg-background w-48 items-center rounded-md shadow/5">
        <div className="flex items-center gap-2 p-3">
          <ChevronDownIcon className="text-muted-foreground size-3" />
          <div className="block h-2 w-7/12 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
        <Separator />
        <div className="flex items-center gap-2 p-3">
          <ChevronDownIcon className="text-muted-foreground size-3" />
          <div className="block h-2 w-10/12 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
        <Separator />
        <div className="flex items-center gap-2 p-3">
          <ChevronDownIcon className="text-muted-foreground size-3" />
          <div className="block h-2 w-6/12 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
      </div>
    ),
  },
  {
    name: "carousel",
    placeholder: (
      <div className="flex items-center gap-2">
        <div className="bg-background flex size-5 items-center justify-center rounded-full shadow/5">
          <ChevronLeftIcon className="text-muted-foreground size-3 rounded-full" />
        </div>
        <div className="bg-background h-28 w-36 items-center rounded-md shadow/5" />
        <div className="bg-background flex size-5 items-center justify-center rounded-full shadow/5">
          <ChevronRightIcon className="text-muted-foreground size-3 rounded-full" />
        </div>
      </div>
    ),
  },
  {
    name: "card",
    placeholder: (
      <div className="bg-background h-28 w-36 items-center rounded-md shadow/5" />
    ),
  },
  {
    name: "alert-dialog",
    placeholder: (
      <div className="bg-background w-48 items-center space-y-3 rounded-md p-3 shadow/5">
        <div className="flex justify-between">
          <span className="block h-2 w-5/12 rounded-full bg-black/10 dark:bg-white/10" />
          <XIcon className="text-muted-foreground size-3" />
        </div>
        <span className="bg-muted block h-2 rounded-full" />
        <span className="bg-muted block h-2 w-10/12 rounded-full" />
        <div className="mt-4 flex justify-end gap-2">
          <div className="bg-muted flex h-7 w-14 items-center justify-center rounded-md px-4 dark:bg-white/10">
            <span className="block h-2 w-full rounded-full bg-black/10" />
          </div>
          <div className="flex h-7 w-14 items-center justify-center rounded-md bg-black/10 px-4 dark:bg-white/10">
            <span className="bg-muted block h-2 w-full rounded-full" />
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "breadcrumb",
    placeholder: (
      <div className="bg-background flex w-48 items-center justify-between gap-2 rounded-md p-2 shadow/5">
        <HomeIcon className="text-muted-foreground size-3 shrink-0" />
        <span className="block h-2 w-5/12 rounded-full bg-black/10 dark:bg-white/10" />
        <ChevronRightIcon className="text-muted-foreground size-3 shrink-0 rounded-full" />
        <span className="block h-2 w-2/12 rounded-full bg-black/10 dark:bg-white/10" />
        <ChevronRightIcon className="text-muted-foreground size-3 shrink-0 rounded-full" />
        <span className="block h-2 w-4/12 rounded-full bg-black/10 dark:bg-white/10" />
      </div>
    ),
  },
  {
    name: "separator",
    placeholder: (
      <div className="flex w-48 items-center justify-between gap-2">
        <span className="block h-1 w-full rounded-full bg-black/10 dark:bg-white/10" />
        <ComponentIcon className="text-muted-foreground size-3 shrink-0 rounded-full" />
        <span className="block h-1 w-full rounded-full bg-black/10 dark:bg-white/10" />
      </div>
    ),
  },
  {
    name: "calendar",
    placeholder: (
      <div className="bg-background w-40 items-center space-y-3 rounded-md p-3 shadow/5">
        <div className="flex items-center justify-between">
          <ChevronLeftIcon className="text-muted-foreground size-3 rounded-full" />
          <span className="block h-2 w-3/12 rounded-full bg-black/10 dark:bg-white/10" />
          <ChevronRightIcon className="text-muted-foreground size-3 shrink-0 rounded-full" />
        </div>
        <div className="mt-4 grid grid-cols-4 gap-4">
          <span className="bg-muted block h-2 rounded-full opacity-0" />
          <span className="bg-muted block h-2 rounded-full" />
          <span className="bg-muted block h-2 rounded-full" />
          <span className="bg-muted block h-2 rounded-full" />
          <span className="bg-muted block h-2 rounded-full" />
          <span className="bg-muted block h-2 rounded-full" />
          <span className="bg-muted block h-2 rounded-full" />
          <span className="block h-2 rounded-full bg-black/10 dark:bg-white/10" />
          <span className="bg-muted block h-2 rounded-full opacity-0" />
          <span className="bg-muted block h-2 rounded-full opacity-0" />
          <span className="bg-muted block h-2 rounded-full" />
          <span className="bg-muted block h-2 rounded-full" />
        </div>
      </div>
    ),
  },
  {
    name: "table",
    placeholder: (
      <div className="bg-background w-40 items-center space-y-3 rounded-md p-3 shadow/5">
        <div className="flex items-center justify-between gap-2">
          <span className="block h-2 w-full rounded-full bg-black/10 dark:bg-white/10" />
        </div>
        <div className="mt-4 grid grid-cols-4 gap-4">
          <span className="bg-muted block h-2 rounded-full" />
          <span className="bg-muted block h-2 rounded-full" />
          <span className="bg-muted block h-2 rounded-full" />
          <span className="bg-muted block h-2 rounded-full" />
          <span className="bg-muted block h-2 rounded-full" />
          <span className="bg-muted block h-2 rounded-full" />
          <span className="bg-muted block h-2 rounded-full" />
          <span className="bg-muted block h-2 rounded-full" />
          <span className="bg-muted block h-2 rounded-full" />
          <span className="bg-muted block h-2 rounded-full" />
          <span className="bg-muted block h-2 rounded-full" />
          <span className="bg-muted block h-2 rounded-full" />
        </div>
      </div>
    ),
  },
  {
    name: "charts",
    placeholder: (
      <div className="bg-background flex h-28 w-48 justify-center space-y-3 overflow-hidden rounded-md shadow/5">
        <ChartContainer
          config={
            {
              value: {
                label: "Desktop",
                color: "var(--chart-2)",
              },
            } satisfies ChartConfig
          }
          className="mt-auto h-24 w-full"
        >
          <AreaChart
            data={[
              { month: "January", value: 130 },
              { month: "February", value: 180 },
              { month: "March", value: 120 },
              { month: "April", value: 200 },
              { month: "May", value: 130 },
              { month: "June", value: 150 },
            ]}
            margin={{
              left: 0,
              right: 0,
            }}
          >
            <Area
              dataKey="value"
              type="natural"
              fill="var(--color-value)"
              fillOpacity={0.2}
              strokeOpacity={0}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </div>
    ),
  },
  {
    name: "field",
    placeholder: (
      <div className="w-48 items-center space-y-2">
        <div>
          <div className="flex items-center justify-between py-2">
            <div className="block h-2 w-5/12 rounded-full bg-black/10 dark:bg-white/10" />
          </div>
          <div className="bg-background h-7 items-center rounded-md shadow/5" />
        </div>
        <div>
          <div className="flex items-center justify-between py-2">
            <div className="block h-2 w-3/12 rounded-full bg-black/10 dark:bg-white/10" />
          </div>
          <div className="bg-background h-7 items-center rounded-md shadow/5" />
        </div>
      </div>
    ),
  },
  {
    name: "file-upload",
    placeholder: (
      <div className="border-input flex w-48 flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-5">
        <ImageUpIcon className="text-muted-foreground size-4" />
        <div className="block h-2 w-7/12 rounded-full bg-black/10 dark:bg-white/10" />
        <div className="block h-2 w-4/12 rounded-full bg-black/10 dark:bg-white/10" />
      </div>
    ),
  },
  {
    name: "spinner",
    placeholder: (
      <LoaderCircleIcon className="text-muted-foreground mx-auto size-6" />
    ),
  },
  {
    name: "empty",
    placeholder: (
      <div className="w-40 space-y-4">
        <div className="flex flex-col items-center justify-center gap-3">
          <SearchIcon className="text-muted-foreground size-4" />
          <div className="block h-2 w-8/12 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-background h-7 items-center rounded-md shadow/5" />
          <div className="bg-background h-7 items-center rounded-md shadow/5" />
        </div>
      </div>
    ),
  },
  {
    name: "collapsible",
    placeholder: (
      <div className="w-48 items-center">
        <div className="flex items-center justify-between gap-2 py-3">
          <div className="block h-2 w-5/12 rounded-full bg-black/10 dark:bg-white/10" />
          <ChevronDownIcon className="text-muted-foreground size-3" />
        </div>
        <div className="bg-background items-center rounded-md shadow/5">
          <div className="flex flex-col gap-2 p-3">
            <div className="bg-muted block h-2 w-full rounded-full" />
            <div className="bg-muted block h-2 w-7/12 rounded-full" />
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "combobox",
    placeholder: (
      <div className="w-32 items-center space-y-2">
        <div className="bg-background flex items-center justify-between gap-2 rounded-md p-2 shadow/5">
          <div className="block h-2 w-5/12 rounded-full bg-black/10 dark:bg-white/10" />
          <ChevronDownIcon className="text-muted-foreground size-3" />
        </div>
        <div className="bg-background items-center rounded-md shadow/5">
          <div className="flex flex-col gap-3 p-3">
            <div className="bg-muted block h-2 w-10/12 rounded-full" />
            <div className="bg-muted block h-2 w-7/12 rounded-full" />
            <div className="bg-muted block h-2 w-10/12 rounded-full" />
            <div className="bg-muted block h-2 w-7/12 rounded-full" />
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "autocomplete",
    placeholder: (
      <div className="w-40 items-center space-y-1">
        <div className="bg-background flex items-center gap-2 rounded-md p-2 shadow/5">
          <SearchIcon className="text-muted-foreground size-3" />
          <span className="text-muted-foreground text-xs">Butt</span>
          <span className="bg-primary -m-2 h-3.5 w-0.5 opacity-50" />
        </div>
        <Separator />
        <div className="bg-background items-center rounded-md shadow/5">
          <div className="flex flex-col gap-3 p-3">
            <div className="bg-muted block h-2 w-10/12 rounded-full" />
            <div className="bg-muted block h-2 w-7/12 rounded-full" />
            <div className="bg-muted block h-2 w-10/12 rounded-full" />
            <div className="bg-muted block h-2 w-7/12 rounded-full" />
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "command",
    placeholder: (
      <div className="bg-background w-48 items-center rounded-md shadow/5">
        <div className="flex items-center gap-2 p-3">
          <SearchIcon className="text-muted-foreground size-3" />
          <div className="block h-2 w-5/12 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
        <Separator />
        <div className="bg-background items-center rounded-md shadow/5">
          <div className="flex flex-col gap-3 p-3">
            <div className="bg-muted block h-2 w-10/12 rounded-full" />
            <div className="bg-muted block h-2 w-7/12 rounded-full" />
            <div className="bg-muted block h-2 w-10/12 rounded-full" />
            <div className="bg-muted block h-2 w-7/12 rounded-full" />
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "context-menu",
    placeholder: (
      <div className="bg-background relative w-28 items-center rounded-md shadow/5">
        <MousePointerClickIcon className="text-muted-foreground absolute -top-3 -left-3 size-5" />
        <div className="bg-background items-center rounded-md shadow/5">
          <div className="flex flex-col gap-3 p-3">
            <div className="bg-muted block h-2 w-10/12 rounded-full" />
            <div className="bg-muted block h-2 w-7/12 rounded-full" />
            <div className="bg-muted block h-2 w-10/12 rounded-full" />
            <div className="bg-muted block h-2 w-7/12 rounded-full" />
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "data-table",
    placeholder: (
      <div className="bg-background w-48 items-center space-y-3 rounded-md p-3 shadow/5">
        <div className="grid grid-cols-4 gap-4">
          <span className="block h-2 rounded-full bg-black/10 dark:bg-white/10" />
          <span className="block h-2 rounded-full bg-black/10 dark:bg-white/10" />
          <span className="block h-2 rounded-full bg-black/10 dark:bg-white/10" />
          <span className="block h-2 rounded-full bg-black/10 dark:bg-white/10" />
          <span className="block h-2 rounded-full bg-black/10 dark:bg-white/10" />
          <span className="bg-muted block h-2 rounded-full" />
          <span className="bg-muted block h-2 rounded-full" />
          <span className="bg-muted block h-2 rounded-full" />
          <span className="block h-2 rounded-full bg-black/10 dark:bg-white/10" />
          <span className="bg-muted block h-2 rounded-full" />
          <span className="bg-muted block h-2 rounded-full" />
          <span className="bg-muted block h-2 rounded-full" />
          <span className="block h-2 rounded-full bg-black/10 dark:bg-white/10" />
          <span className="bg-muted block h-2 rounded-full" />
          <span className="bg-muted block h-2 rounded-full" />
          <span className="bg-muted block h-2 rounded-full" />
        </div>
        <div className="flex items-center justify-between">
          <ChevronLeftIcon className="text-muted-foreground size-3 rounded-full" />
          <ChevronRightIcon className="text-muted-foreground size-3 shrink-0 rounded-full" />
        </div>
      </div>
    ),
  },
  {
    name: "date-picker",
    placeholder: (
      <div className="w-32 items-center space-y-2">
        <div className="bg-background flex items-center gap-2 rounded-md p-2 shadow/5">
          <CalendarIcon className="text-muted-foreground size-3" />
          <div className="block h-2 w-5/12 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
        <div className="bg-background items-center space-y-3 rounded-md p-3 shadow/5">
          <div className="flex items-center justify-between">
            <ChevronLeftIcon className="text-muted-foreground size-3 rounded-full" />
            <span className="block h-2 w-3/12 rounded-full bg-black/10 dark:bg-white/10" />
            <ChevronRightIcon className="text-muted-foreground size-3 shrink-0 rounded-full" />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-4">
            <span className="bg-muted block h-2 rounded-full opacity-0" />
            <span className="bg-muted block h-2 rounded-full" />
            <span className="bg-muted block h-2 rounded-full" />
            <span className="bg-muted block h-2 rounded-full" />
            <span className="bg-muted block h-2 rounded-full" />
            <span className="bg-muted block h-2 rounded-full" />
            <span className="bg-muted block h-2 rounded-full" />
            <span className="block h-2 rounded-full bg-black/10 dark:bg-white/10" />
            <span className="bg-muted block h-2 rounded-full opacity-0" />
            <span className="bg-muted block h-2 rounded-full opacity-0" />
            <span className="bg-muted block h-2 rounded-full" />
            <span className="bg-muted block h-2 rounded-full" />
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "dialog",
    placeholder: (
      <div className="bg-background w-48 items-center space-y-3 rounded-md p-3 shadow/5">
        <div className="flex justify-between">
          <span className="block h-2 w-5/12 rounded-full bg-black/10 dark:bg-white/10" />
          <XIcon className="text-muted-foreground size-3" />
        </div>
        <Input className="pointer-events-none h-6 rounded-sm" />
        <div className="flex h-7 w-14 items-center justify-center rounded-md bg-black/10 px-4 dark:bg-white/10">
          <span className="bg-muted block h-2 w-full rounded-full" />
        </div>
      </div>
    ),
  },
  {
    name: "scroll-area",
    placeholder: (
      <div className="bg-background p- ms-auto flex h-full w-30 gap-4 space-y-3 self-end rounded-md p-3 shadow/5">
        <div className="grow space-y-3">
          <div className="flex items-center justify-between">
            <span className="block h-2 w-5/12 rounded-full bg-black/10 dark:bg-white/10" />
          </div>
          <div className="bg-muted h-2 w-10/12 rounded-full" />
          <div className="bg-muted h-2 w-5/12 rounded-full" />
          <div className="bg-muted h-2 w-10/12 rounded-full" />
          <div className="bg-muted mt-auto h-2 w-full rounded-full" />
        </div>
        <div>
          <div className="bg-muted h-12 w-2 rounded-full" />
        </div>
      </div>
    ),
  },
  {
    name: "dropdown-menu",
    placeholder: (
      <div className="w-32 items-center space-y-2">
        <div className="bg-background inline-flex items-center justify-between gap-2 rounded-md p-2 shadow/5">
          <div className="block h-2 w-8 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
        <div className="bg-background items-center rounded-md shadow/5">
          <div className="flex flex-col gap-3 p-3">
            <div className="bg-muted block h-2 w-10/12 rounded-full" />
            <div className="bg-muted block h-2 w-7/12 rounded-full" />
            <div className="bg-muted block h-2 w-10/12 rounded-full" />
            <div className="bg-muted block h-2 w-7/12 rounded-full" />
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "menubar",
    placeholder: (
      <div className="w-28 items-center space-y-2">
        <div className="flex items-center gap-1">
          <div className="bg-background inline-flex items-center justify-between gap-2 rounded-md p-2 shadow/5">
            <div className="block h-2 w-6 rounded-full bg-black/10 dark:bg-white/10" />
          </div>
          <div className="bg-background inline-flex items-center justify-between gap-2 rounded-md p-2 shadow/5">
            <div className="block h-2 w-6 rounded-full bg-black/10 dark:bg-white/10" />
          </div>
        </div>
        <div className="bg-background items-center rounded-md shadow/5">
          <div className="flex flex-col gap-3 p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="bg-muted block h-2 w-7/12 rounded-full" />
              <ChevronRightIcon className="text-muted-foreground size-3 opacity-70" />
            </div>
            <div className="bg-muted block h-2 w-7/12 rounded-full" />
            <div className="flex items-center justify-between gap-2">
              <div className="bg-muted block h-2 w-10/12 rounded-full" />
              <ChevronRightIcon className="text-muted-foreground size-3 opacity-70" />
            </div>
            <div className="bg-muted block h-2 w-7/12 rounded-full" />
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "item",
    placeholder: (
      <div className="w-56 items-center space-y-2">
        <div className="bg-background flex items-center gap-3 rounded-md p-3 shadow/5">
          <div className="flex size-7 items-center justify-center rounded-full bg-black/10 shadow/5 dark:bg-white/10" />
          <div className="grow space-y-2">
            <div className="block h-2 w-10/12 rounded-full bg-black/10 dark:bg-white/10" />
            <div className="bg-muted block h-2 w-7/12 rounded-full" />
          </div>
          <div className="inline-flex items-center justify-between gap-2 rounded-md bg-black/10 p-2 shadow/5">
            <div className="block h-2 w-8 rounded-full bg-black/10 dark:bg-white/10" />
          </div>
        </div>
        <div className="bg-background flex items-center gap-3 rounded-md p-3 shadow/5">
          <div className="flex size-7 items-center justify-center rounded-full bg-black/10 shadow/5 dark:bg-white/10" />
          <div className="grow space-y-2">
            <div className="block h-2 w-10/12 rounded-full bg-black/10 dark:bg-white/10" />
            <div className="bg-muted block h-2 w-7/12 rounded-full" />
          </div>
          <div className="inline-flex items-center justify-between gap-2 rounded-md bg-black/10 p-2 shadow/5">
            <div className="block h-2 w-8 rounded-full bg-black/10 dark:bg-white/10" />
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "hover-card",
    placeholder: (
      <div className="w-40 items-center space-y-2">
        <div className="mx-auto block h-2 w-8 rounded-full bg-black/10 dark:bg-white/10" />
        <div className="bg-background flex items-center gap-3 rounded-md p-3 shadow/5">
          <div className="flex size-8 items-center justify-center rounded-full bg-black/10 shadow/5 dark:bg-white/10" />
          <div className="grow space-y-2">
            <div className="block h-2 w-10/12 rounded-full bg-black/10 dark:bg-white/10" />
            <div className="bg-muted block h-2 w-7/12 rounded-full" />
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "input",
    placeholder: (
      <div className="w-48 items-center space-y-2">
        <div className="bg-background flex items-center justify-between gap-3 rounded-md p-3 shadow/5">
          <div className="h-2 w-5/12 rounded-full bg-black/10 dark:bg-white/10" />
          <XIcon className="text-muted-foreground size-3" />
        </div>
      </div>
    ),
  },
  {
    name: "textarea",
    placeholder: (
      <div className="w-48 items-center space-y-2">
        <div className="bg-background flex h-16 items-start justify-between gap-3 rounded-md p-3 shadow/5">
          <div className="h-2 w-5/12 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
      </div>
    ),
  },
  {
    name: "sonner-toast",
    placeholder: (
      <div className="bg-background absolute end-4 bottom-0 w-30 items-center rounded-md shadow/5">
        <div className="flex items-center gap-3 p-3">
          <AlertTriangleIcon className="text-muted-foreground size-3" />
          <div className="block h-2 w-7/12 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
      </div>
    ),
  },
  {
    name: "input-otp",
    placeholder: (
      <div className="flex w-48 items-center justify-center gap-3">
        <div className="bg-background flex size-9 items-center justify-center rounded-md shadow/5">
          <div className="size-2 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
        <div className="bg-background flex size-9 items-center justify-center rounded-md shadow/5">
          <div className="size-2 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
        <div className="bg-background flex size-9 items-center justify-center rounded-md border shadow/10">
          <div className="h-4 w-0.5 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
        <div className="bg-background flex size-9 items-center justify-center rounded-md shadow/5">
          <div className="size-2 rounded-full bg-black/10 opacity-0 dark:bg-white/10" />
        </div>
      </div>
    ),
  },
  {
    name: "navigation-menu",
    placeholder: (
      <div className="w-48 items-center space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex grow items-center gap-1">
            <div className="block h-2 w-full rounded-full bg-black/10 dark:bg-white/10" />
            <ChevronDownIcon className="text-muted-foreground size-3" />
          </div>
          <div className="flex grow items-center gap-1">
            <div className="block h-2 w-full rounded-full bg-black/10 dark:bg-white/10" />
            <ChevronUpIcon className="text-muted-foreground size-3" />
          </div>
          <div className="flex grow items-center gap-1">
            <div className="block h-2 w-full rounded-full bg-black/10 dark:bg-white/10" />
            <ChevronUpIcon className="text-muted-foreground size-3" />
          </div>
        </div>
        <div className="bg-background w-28 items-center rounded-md shadow/5">
          <div className="flex flex-col gap-3 p-3">
            <div className="block h-2 w-7/12 rounded-full bg-black/10 dark:bg-white/10" />
            <div className="bg-muted block h-2 w-10/12 rounded-full" />
            <div className="block h-2 w-7/12 rounded-full bg-black/10 dark:bg-white/10" />
            <div className="bg-muted block h-2 w-10/12 rounded-full" />
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "pagination",
    placeholder: (
      <div className="flex w-48 items-center justify-center gap-2">
        <div className="bg-background flex size-9 items-center justify-center rounded-md shadow/5">
          <ChevronLeftIcon className="text-muted-foreground size-4" />
        </div>
        <div className="bg-background flex size-9 items-center justify-center rounded-md shadow/5">
          <div className="size-2 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
        <div className="bg-background flex size-9 items-center justify-center rounded-md shadow/5">
          <div className="size-2 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
        <div className="bg-background flex size-9 items-center justify-center rounded-md shadow/5">
          <ChevronRightIcon className="text-muted-foreground size-4" />
        </div>
      </div>
    ),
  },
  {
    name: "toggle",
    placeholder: (
      <div className="flex w-48 items-center justify-center gap-2">
        <div className="bg-background flex size-9 items-center justify-center rounded-md shadow/5">
          B
        </div>
        <div className="bg-primary/10 flex size-9 items-center justify-center rounded-md italic shadow/5">
          I
        </div>
        <div className="bg-background flex size-9 items-center justify-center rounded-md underline shadow/5">
          U
        </div>
      </div>
    ),
  },
  {
    name: "popover",
    placeholder: (
      <div className="w-32 items-center space-y-2 text-center">
        <div className="bg-background inline-flex items-center justify-center gap-2 rounded-md p-2 shadow/5">
          <div className="block h-2 w-8 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
        <div className="bg-background items-center rounded-md shadow/5">
          <div className="flex flex-col gap-3 p-3">
            <div className="block h-2 w-5/12 rounded-full bg-black/10 dark:bg-white/10" />
            <div className="bg-muted block h-2 w-10/12 rounded-full" />
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "progress",
    placeholder: (
      <div className="w-48 items-center space-y-2 text-center">
        <Progress value={40} />
      </div>
    ),
  },
  {
    name: "radio-group",
    placeholder: (
      <div className="flex flex-col gap-2">
        <RadioGroup defaultValue="comfortable" className="pointer-events-none">
          <div className="flex items-center gap-3">
            <RadioGroupItem value="default" id="r1" />
            <div className="block h-2 w-30 rounded-full bg-black/10 dark:bg-white/10" />
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="comfortable" id="r2" />
            <div className="block h-2 w-24 rounded-full bg-black/10 dark:bg-white/10" />
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="compact" id="r3" />
            <div className="block h-2 w-30 rounded-full bg-black/10 dark:bg-white/10" />
          </div>
        </RadioGroup>
      </div>
    ),
  },
  {
    name: "select",
    placeholder: (
      <div className="w-32 items-center space-y-2">
        <div className="bg-background flex items-center justify-between gap-2 rounded-md p-2 shadow/5">
          <div className="block h-2 w-5/12 rounded-full bg-black/10 dark:bg-white/10" />
          <ChevronUpIcon className="text-muted-foreground size-3" />
        </div>
        <div className="bg-background items-center rounded-md shadow/5">
          <div className="flex flex-col gap-3 p-3">
            <div className="bg-muted block h-2 w-10/12 rounded-full" />
            <div className="flex items-center justify-between gap-1">
              <div className="bg-muted h-2 w-7/12 rounded-full" />
              <CheckIcon className="size-2" />
            </div>
            <div className="flex items-center justify-between gap-1">
              <div className="bg-muted h-2 w-10/12 rounded-full" />
              <CheckIcon className="size-2" />
            </div>
            <div className="bg-muted block h-2 w-7/12 rounded-full" />
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "native-select",
    placeholder: (
      <div className="w-28 items-center space-y-2">
        <div className="bg-background flex items-center justify-between gap-2 rounded-md p-2 shadow/5">
          <div className="block h-2 w-5/12 rounded-full bg-black/10 dark:bg-white/10" />
          <ChevronUpIcon className="text-muted-foreground size-3" />
        </div>
        <div className="bg-background items-center rounded-md shadow/5">
          <div className="flex flex-col gap-3 p-3">
            <div className="bg-muted block h-2 w-10/12 rounded-full" />
            <div className="flex items-center justify-between gap-1">
              <div className="bg-muted h-2 w-7/12 rounded-full" />
            </div>
            <div className="flex items-center justify-between gap-1">
              <div className="bg-muted h-2 w-10/12 rounded-full" />
            </div>
            <div className="bg-muted block h-2 w-7/12 rounded-full" />
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "sheet",
    placeholder: (
      <div className="bg-background absolute end-4 top-0 bottom-0 ms-auto flex h-full w-30 flex-col space-y-3 self-end rounded-md p-3 shadow/5">
        <div className="flex items-center justify-between">
          <span className="block h-2 w-5/12 rounded-full bg-black/10 dark:bg-white/10" />
          <XIcon className="text-muted-foreground size-3" />
        </div>
        <div className="bg-muted h-2 w-10/12 rounded-full" />
        <div className="bg-muted h-2 w-5/12 rounded-full" />
        <div className="bg-muted h-2 w-10/12 rounded-full" />
        <div className="bg-muted mt-auto h-2 w-full rounded-full" />
      </div>
    ),
  },
  {
    name: "sidebar",
    placeholder: (
      <div className="bg-background me-auto flex h-full w-30 flex-col space-y-3 self-start p-3 shadow/5">
        <div className="flex items-center justify-between">
          <span className="block h-2 w-4 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-1">
            <div className="bg-muted h-2 w-4/12 rounded-full" />
            <ChevronDownIcon className="size-3" />
          </div>
          <div className="flex items-center justify-between gap-1">
            <div className="bg-muted h-2 w-7/12 rounded-full" />
          </div>
          <div className="flex items-center justify-between gap-1">
            <div className="bg-muted h-2 w-5/12 rounded-full" />
          </div>
          <div className="flex items-center justify-between gap-1">
            <div className="bg-muted h-2 w-6/12 rounded-full" />
            <ChevronDownIcon className="size-3" />
          </div>
        </div>
        <div className="mt-auto h-2 w-4 rounded-full bg-black/10 dark:bg-white/10" />
      </div>
    ),
  },
  {
    name: "slider",
    placeholder: (
      <div className="w-48 items-center space-y-2 text-center">
        <Slider
          defaultValue={[45]}
          className="pointer-events-none **:data-[slot=slider-track]:bg-black/10 dark:**:data-[slot=slider-track]:bg-white/10"
        />
      </div>
    ),
  },
  {
    name: "skeleton",
    placeholder: (
      <div className="w-40 items-center space-y-2">
        <div className="bg-background flex items-center gap-3 rounded-md p-3 shadow/5">
          <div className="flex size-8 items-center justify-center rounded-full bg-linear-to-r from-black/10 to-black/0 shadow/5" />
          <div className="grow space-y-2">
            <div className="block h-2 w-10/12 rounded-full bg-linear-to-r from-black/10 to-black/0" />
            <div className="block h-2 w-7/12 rounded-full bg-linear-to-r from-black/10 to-black/0" />
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "switch",
    placeholder: (
      <div className="w-40 text-center">
        <Switch className="pointer-events-none scale-120" />
      </div>
    ),
  },
  {
    name: "tabs",
    placeholder: (
      <div className="w-48 items-center space-y-2 text-center">
        <div className="flex gap-2">
          <div className="inline-flex items-center justify-center gap-2 rounded-md bg-black/10 p-2 shadow/5 dark:bg-white/10">
            <div className="block h-2 w-8 rounded-full bg-black/10 dark:bg-white/10" />
          </div>
          <div className="bg-background inline-flex items-center justify-center gap-2 rounded-md p-2 shadow/5">
            <div className="block h-2 w-8 rounded-full bg-black/10 dark:bg-white/10" />
          </div>
        </div>
        <div className="bg-background items-center rounded-md shadow/5">
          <div className="flex flex-col gap-3 p-3">
            <div className="block h-2 w-5/12 rounded-full bg-black/10 dark:bg-white/10" />
            <div className="bg-muted block h-2 w-10/12 rounded-full" />
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "toggle-group",
    placeholder: (
      <div className="flex w-48 items-center justify-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-md bg-black/10 dark:bg-white/10">
          <div className="h-2 w-5 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
        <div className="bg-background flex size-9 items-center justify-center rounded-md shadow/5">
          <div className="h-2 w-5 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
        <div className="bg-background flex size-9 items-center justify-center rounded-md shadow/5">
          <div className="h-2 w-5 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
      </div>
    ),
  },
  {
    name: "form",
    placeholder: (
      <div className="flex w-48 gap-4">
        <div className="bg-background grow space-y-4 rounded-md p-4 shadow/5">
          <Input className="pointer-events-none h-6 rounded-sm" />
          <Input className="pointer-events-none h-6 rounded-sm" />
          <div className="bg-primary inline-flex items-center justify-center gap-2 rounded-md p-2 shadow/5">
            <div className="block h-2 w-8 rounded-full bg-white/30 dark:bg-white/10" />
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "bubble",
    placeholder: (
      <div className="flex w-48 flex-col gap-2">
        <div className="ml-auto max-w-[70%] rounded-2xl rounded-br-sm bg-black/10 px-3 py-2 dark:bg-white/10">
          <div className="h-2 w-16 rounded-full bg-black/20 dark:bg-white/20" />
        </div>
        <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-black/5 px-3 py-2 dark:bg-white/5">
          <div className="space-y-1">
            <div className="h-2 w-24 rounded-full bg-black/10 dark:bg-white/10" />
            <div className="h-2 w-16 rounded-full bg-black/10 dark:bg-white/10" />
          </div>
        </div>
        <div className="ml-auto max-w-[70%] rounded-2xl rounded-br-sm bg-black/10 px-3 py-2 dark:bg-white/10">
          <div className="h-2 w-20 rounded-full bg-black/20 dark:bg-white/20" />
        </div>
      </div>
    ),
  },
  {
    name: "attachment",
    placeholder: (
      <div className="flex w-48 flex-col gap-2">
        <div className="bg-background flex items-center gap-2 rounded-md p-2 shadow/5">
          <div className="bg-muted size-8 shrink-0 rounded" />
          <div className="flex-1 space-y-1.5">
            <div className="bg-muted h-2 w-3/4 rounded-full" />
            <div className="bg-muted h-1.5 w-1/2 rounded-full opacity-60" />
          </div>
        </div>
        <div className="bg-background flex items-center gap-2 rounded-md p-2 shadow/5">
          <div className="bg-muted size-8 shrink-0 rounded" />
          <div className="flex-1 space-y-1.5">
            <div className="bg-muted h-2 w-4/5 rounded-full" />
            <div className="bg-muted h-1.5 w-2/5 rounded-full opacity-60" />
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "tooltip",
    placeholder: (
      <div className="w-48 items-center space-y-2 text-center">
        <Tooltip open={true}>
          <TooltipTrigger asChild>
            <div className="bg-background inline-flex items-center justify-center gap-2 rounded-md p-3 shadow/5">
              <div className="block h-2 w-10 rounded-full bg-black/10 dark:bg-white/10" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="z-40 my-1 h-2 w-20 rounded-full bg-white/50" />
          </TooltipContent>
        </Tooltip>
      </div>
    ),
  },
];
