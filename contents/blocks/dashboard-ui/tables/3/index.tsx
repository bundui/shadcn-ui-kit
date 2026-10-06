"use client";

import * as React from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDown,
  Circle,
  CircleCheck,
  CircleDashed,
  CircleX,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Status = "todo" | "active" | "blocked" | "done";

type Task = {
  id: string;
  title: string;
  owner: { name: string; initials: string };
  due: string;
  status: Status;
};

const initialTasks: Task[] = [
  {
    id: "t1",
    title: "Finalize pricing page copy",
    owner: { name: "Maya Ortiz", initials: "MO" },
    due: "2026-10-06",
    status: "done",
  },
  {
    id: "t2",
    title: "Record product walkthrough video",
    owner: { name: "Jonah Reyes", initials: "JR" },
    due: "2026-10-08",
    status: "active",
  },
  {
    id: "t3",
    title: "Set up status page alerts",
    owner: { name: "Priya Shah", initials: "PS" },
    due: "2026-10-09",
    status: "blocked",
  },
  {
    id: "t4",
    title: "Migrate billing webhooks",
    owner: { name: "Elena Novak", initials: "EN" },
    due: "2026-10-10",
    status: "active",
  },
  {
    id: "t5",
    title: "Draft launch email sequence",
    owner: { name: "Maya Ortiz", initials: "MO" },
    due: "2026-10-12",
    status: "todo",
  },
  {
    id: "t6",
    title: "Run load test on public API",
    owner: { name: "Theo Park", initials: "TP" },
    due: "2026-10-13",
    status: "todo",
  },
];

const statusMeta: Record<
  Status,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    className: string;
  }
> = {
  todo: { label: "To do", icon: Circle, className: "text-muted-foreground" },
  active: {
    label: "In progress",
    icon: CircleDashed,
    className: "text-foreground",
  },
  blocked: {
    label: "Blocked",
    icon: CircleX,
    className: "text-rose-600 dark:text-rose-400",
  },
  done: {
    label: "Done",
    icon: CircleCheck,
    className: "text-green-600 dark:text-green-400",
  },
};

const statusOrder: Status[] = ["todo", "active", "blocked", "done"];

type Filter = "all" | "open" | "done";

const formatDue = (value: string) =>
  new Date(`${value}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

export default function LaunchChecklistTable() {
  const [tasks, setTasks] = React.useState(initialTasks);
  const [filter, setFilter] = React.useState<Filter>("all");

  const setStatus = React.useCallback((id: string, status: Status) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status } : task)),
    );
  }, []);

  const columns = React.useMemo<ColumnDef<Task>[]>(
    () => [
      {
        id: "complete",
        meta: { className: "w-10" },
        cell: ({ row }) => (
          <Checkbox
            checked={row.original.status === "done"}
            onCheckedChange={(checked) =>
              setStatus(row.original.id, checked ? "done" : "todo")
            }
            aria-label={`Mark "${row.original.title}" as done`}
          />
        ),
      },
      {
        accessorKey: "title",
        header: "Task",
        meta: { className: "w-full min-w-40 whitespace-normal" },
        cell: ({ row }) => {
          const done = row.original.status === "done";
          return (
            <div className="flex min-w-0 flex-col">
              <span
                className={cn(
                  "font-medium transition-colors",
                  done && "text-muted-foreground line-through",
                )}
              >
                {row.original.title}
              </span>
              <span className="text-muted-foreground text-xs sm:hidden">
                {row.original.owner.name} · Due {formatDue(row.original.due)}
              </span>
            </div>
          );
        },
      },
      {
        id: "owner",
        header: "Owner",
        meta: { className: "hidden sm:table-cell" },
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar className="size-6">
              <AvatarFallback className="text-[10px]">
                {row.original.owner.initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground">
              {row.original.owner.name}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "due",
        header: "Due",
        meta: { className: "hidden md:table-cell" },
        cell: ({ row }) => (
          <span className="text-muted-foreground tabular-nums">
            {formatDue(row.original.due)}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: () => <span className="block text-right">Status</span>,
        meta: { className: "text-right" },
        filterFn: (row, _columnId, value: Filter) => {
          if (value === "done") return row.original.status === "done";
          if (value === "open") return row.original.status !== "done";
          return true;
        },
        cell: ({ row }) => {
          const meta = statusMeta[row.original.status];
          const Icon = meta.icon;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="xs"
                  aria-label={`Change status, currently ${meta.label}`}
                  className={cn("h-7 gap-1.5 px-2.5", meta.className)}
                >
                  <Icon />
                  {meta.label}
                  <ChevronDown className="text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>Set status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={row.original.status}
                  onValueChange={(value) =>
                    setStatus(row.original.id, value as Status)
                  }
                >
                  {statusOrder.map((status) => {
                    const option = statusMeta[status];
                    const OptionIcon = option.icon;
                    return (
                      <DropdownMenuRadioItem key={status} value={status}>
                        <OptionIcon className={option.className} />
                        {option.label}
                      </DropdownMenuRadioItem>
                    );
                  })}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [setStatus],
  );

  const columnFilters = React.useMemo(
    () => [{ id: "status", value: filter }],
    [filter],
  );

  const table = useReactTable({
    data: tasks,
    columns,
    state: { columnFilters },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const rows = table.getRowModel().rows;
  const doneCount = tasks.filter((task) => task.status === "done").length;
  const blockedCount = tasks.filter((task) => task.status === "blocked").length;
  const percent = Math.round((doneCount / tasks.length) * 100);

  const counts: Record<Filter, number> = {
    all: tasks.length,
    open: tasks.length - doneCount,
    done: doneCount,
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border">
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="font-heading text-lg font-medium">
              Launch checklist
            </h3>
            <p className="text-muted-foreground text-sm">
              {doneCount} of {tasks.length} tasks complete
              {blockedCount > 0 && (
                <span className="text-rose-600 dark:text-rose-400">
                  , {blockedCount} blocked
                </span>
              )}
            </p>
          </div>
          <Tabs
            value={filter}
            onValueChange={(value) => setFilter(value as Filter)}
          >
            <TabsList>
              {(["all", "open", "done"] as Filter[]).map((value) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="gap-1.5 capitalize"
                >
                  {value}
                  <span className="text-muted-foreground text-xs tabular-nums">
                    {counts[value]}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center gap-3">
          <Progress
            value={percent}
            className="flex-1"
            aria-label="Checklist progress"
          />
          <span className="text-muted-foreground w-10 text-right text-xs font-medium tabular-nums">
            {percent}%
          </span>
        </div>
      </div>
      <Table>
        <TableHeader className="bg-muted/50 border-t">
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id} className="hover:bg-transparent">
              {group.headers.map((header, index) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    "text-muted-foreground h-10",
                    index === 0 && "pl-4 sm:pl-5",
                    index === group.headers.length - 1 && "pr-4 sm:pr-5",
                    (
                      header.column.columnDef.meta as
                        { className?: string } | undefined
                    )?.className,
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.length ? (
            rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell, index, cells) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      index === 0 && "pl-4 sm:pl-5",
                      index === cells.length - 1 && "pr-4 sm:pr-5",
                      (
                        cell.column.columnDef.meta as
                          { className?: string } | undefined
                      )?.className,
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={columns.length}
                className="text-muted-foreground h-24 text-center"
              >
                {filter === "done"
                  ? "Nothing finished yet."
                  : "Everything is done. Time to ship."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
