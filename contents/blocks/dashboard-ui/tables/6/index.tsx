"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleCheck,
  CircleDashed,
  CircleDot,
  Columns3,
  Inbox,
  LucideIcon,
  SignalHigh,
  SignalLow,
  SignalMedium,
  TriangleAlert,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const STATUSES = ["Backlog", "Active", "Review", "Shipped"] as const;
type Status = (typeof STATUSES)[number];
type Priority = 1 | 2 | 3 | 4;

type Ticket = {
  id: number;
  title: string;
  label: string;
  owner: { name: string; avatar: string };
  priority: Priority;
  status: Status;
};

const people = {
  noor: { name: "Noor Haddad", avatar: "https://i.pravatar.cc/100?img=45" },
  jonas: { name: "Jonas Weber", avatar: "https://i.pravatar.cc/100?img=15" },
  mei: { name: "Mei Tanaka", avatar: "https://i.pravatar.cc/100?img=44" },
  owen: { name: "Owen Gallagher", avatar: "https://i.pravatar.cc/100?img=59" },
};

const initialTickets: Ticket[] = [
  {
    id: 1287,
    title: "Checkout total ignores regional tax",
    label: "Defect",
    owner: people.noor,
    priority: 4,
    status: "Active",
  },
  {
    id: 1286,
    title: "Export audit log as CSV",
    label: "Request",
    owner: people.jonas,
    priority: 2,
    status: "Backlog",
  },
  {
    id: 1285,
    title: "Session expires during file upload",
    label: "Defect",
    owner: people.mei,
    priority: 3,
    status: "Review",
  },
  {
    id: 1284,
    title: "Move image resizing to a worker queue",
    label: "Chore",
    owner: people.owen,
    priority: 2,
    status: "Active",
  },
  {
    id: 1283,
    title: "Keyboard shortcuts for the editor",
    label: "Request",
    owner: people.jonas,
    priority: 1,
    status: "Shipped",
  },
  {
    id: 1282,
    title: "Webhook retries fire twice",
    label: "Defect",
    owner: people.noor,
    priority: 4,
    status: "Review",
  },
  {
    id: 1281,
    title: "Drop legacy v1 search endpoint",
    label: "Chore",
    owner: people.owen,
    priority: 1,
    status: "Backlog",
  },
  {
    id: 1280,
    title: "Saved filters on the reports page",
    label: "Request",
    owner: people.mei,
    priority: 2,
    status: "Shipped",
  },
  {
    id: 1279,
    title: "Avatar crop shifts on Safari",
    label: "Defect",
    owner: people.jonas,
    priority: 3,
    status: "Active",
  },
  {
    id: 1278,
    title: "Upgrade the PDF rendering library",
    label: "Chore",
    owner: people.noor,
    priority: 1,
    status: "Shipped",
  },
  {
    id: 1277,
    title: "Team mentions in comment threads",
    label: "Request",
    owner: people.owen,
    priority: 3,
    status: "Backlog",
  },
];

const statusMeta: Record<Status, { icon: LucideIcon; className: string }> = {
  Backlog: { icon: CircleDashed, className: "text-muted-foreground" },
  Active: { icon: CircleDot, className: "text-foreground" },
  Review: { icon: Circle, className: "text-foreground" },
  Shipped: {
    icon: CircleCheck,
    className: "text-green-600 dark:text-green-400",
  },
};

const priorityMeta: Record<
  Priority,
  { label: string; icon: LucideIcon; className: string }
> = {
  4: {
    label: "Urgent",
    icon: TriangleAlert,
    className: "text-rose-600 dark:text-rose-400",
  },
  3: { label: "High", icon: SignalHigh, className: "text-foreground" },
  2: { label: "Medium", icon: SignalMedium, className: "text-foreground" },
  1: { label: "Low", icon: SignalLow, className: "text-muted-foreground" },
};

const PAGE_SIZE = 5;
const responsiveColumn: Record<string, string> = {
  owner: "hidden md:table-cell",
  priority: "hidden sm:table-cell",
};
const optionalColumns: Record<string, string> = {
  owner: "Owner",
  priority: "Priority",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

function SortButton({
  label,
  sorted,
  onClick,
}: {
  label: string;
  sorted: false | "asc" | "desc";
  onClick: () => void;
}) {
  const Icon =
    sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown;
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 gap-1.5"
      onClick={onClick}
      aria-label={`Sort by ${label}`}
    >
      {label}
      <Icon className={cn("size-3.5", !sorted && "text-muted-foreground")} />
    </Button>
  );
}

export default function IssueTrackerTable() {
  const [tickets, setTickets] = React.useState<Ticket[]>(initialTickets);
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "priority", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const setStatus = React.useCallback((id: number, status: Status) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }, []);

  const columns = React.useMemo<ColumnDef<Ticket>[]>(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => (
          <SortButton
            label="Key"
            sorted={column.getIsSorted()}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground font-mono text-xs">
            OPS-{row.original.id}
          </span>
        ),
      },
      {
        accessorKey: "title",
        header: "Ticket",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="font-medium">{row.original.title}</span>
            <Badge
              variant="outline"
              className="text-muted-foreground hidden lg:inline-flex"
            >
              {row.original.label}
            </Badge>
          </div>
        ),
      },
      {
        id: "owner",
        accessorFn: (row) => row.owner.name,
        header: "Owner",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <AvatarImage src={row.original.owner.avatar} alt="" />
              <AvatarFallback>
                {initials(row.original.owner.name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{row.original.owner.name}</span>
          </div>
        ),
      },
      {
        accessorKey: "priority",
        sortingFn: (a, b) =>
          a.original.priority - b.original.priority ||
          a.original.id - b.original.id,
        header: ({ column }) => (
          <SortButton
            label="Priority"
            sorted={column.getIsSorted()}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ row }) => {
          const meta = priorityMeta[row.original.priority];
          const Icon = meta.icon;
          return (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 text-sm",
                meta.className,
              )}
            >
              <Icon className="size-4" />
              {meta.label}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        filterFn: (row, columnId, value: string) =>
          row.getValue(columnId) === value,
        cell: ({ row }) => {
          const ticket = row.original;
          const meta = statusMeta[ticket.status];
          const Icon = meta.icon;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1.5 pr-2.5 pl-2 text-xs"
                  aria-label={`Change status of OPS-${ticket.id}, currently ${ticket.status}`}
                >
                  <Icon className={cn("size-3.5", meta.className)} />
                  {ticket.status}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel className="text-muted-foreground text-xs">
                  Move to
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={ticket.status}
                  onValueChange={(value) =>
                    setStatus(ticket.id, value as Status)
                  }
                >
                  {STATUSES.map((status) => {
                    const ItemIcon = statusMeta[status].icon;
                    return (
                      <DropdownMenuRadioItem key={status} value={status}>
                        <ItemIcon className={statusMeta[status].className} />
                        {status}
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

  const table = useReactTable({
    data: tickets,
    columns,
    state: { sorting, columnFilters, columnVisibility, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    getRowId: (row) => String(row.id),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const statusFilter =
    (table.getColumn("status")?.getFilterValue() as string) ?? "all";
  const counts = STATUSES.reduce(
    (acc, status) => ({
      ...acc,
      [status]: tickets.filter((t) => t.status === status).length,
    }),
    {} as Record<Status, number>,
  );
  const openCount = tickets.length - counts.Shipped;
  const urgentOpen = tickets.filter(
    (t) => t.priority === 4 && t.status !== "Shipped",
  ).length;

  const filteredCount = table.getFilteredRowModel().rows.length;
  const pageCount = Math.max(table.getPageCount(), 1);
  const { pageIndex } = table.getState().pagination;

  React.useEffect(() => {
    if (pageIndex > pageCount - 1) table.setPageIndex(pageCount - 1);
  }, [pageIndex, pageCount, table]);

  const firstRow = filteredCount === 0 ? 0 : pageIndex * PAGE_SIZE + 1;
  const lastRow = Math.min((pageIndex + 1) * PAGE_SIZE, filteredCount);
  const rows = table.getRowModel().rows;

  return (
    <Card className="mx-auto w-full max-w-5xl gap-0 py-0 shadow-none">
      <CardHeader className="gap-1 border-b py-5">
        <CardTitle>Platform tickets</CardTitle>
        <CardDescription>
          {openCount} open, {urgentOpen} urgent. Click a status pill to move a
          ticket.
        </CardDescription>
      </CardHeader>

      <div className="flex flex-col gap-3 border-b px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={statusFilter}
          onValueChange={(value) => {
            table
              .getColumn("status")
              ?.setFilterValue(value === "all" ? undefined : value);
            table.setPageIndex(0);
          }}
          className="max-w-full [scrollbar-width:none] overflow-x-auto"
        >
          <TabsList>
            <TabsTrigger value="all" className="px-2 sm:px-3">
              All{" "}
              <span className="text-muted-foreground hidden tabular-nums sm:inline">
                {tickets.length}
              </span>
            </TabsTrigger>
            {STATUSES.map((status) => (
              <TabsTrigger key={status} value={status} className="px-2 sm:px-3">
                {status}
                <span className="text-muted-foreground hidden tabular-nums sm:inline">
                  {counts[status]}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="hidden md:inline-flex"
            >
              <Columns3 />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Show columns
            </DropdownMenuLabel>
            {Object.entries(optionalColumns).map(([id, label]) => (
              <DropdownMenuCheckboxItem
                key={id}
                checked={table.getColumn(id)?.getIsVisible()}
                onCheckedChange={(value) =>
                  table.getColumn(id)?.toggleVisibility(!!value)
                }
                onSelect={(event) => event.preventDefault()}
              >
                {label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    "text-muted-foreground first:pl-6 last:pr-6",
                    header.column.id === "id" && "w-28",
                    responsiveColumn[header.column.id],
                    header.column.id === "status" && "text-right",
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
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      "py-3 first:pl-6 last:pr-6",
                      cell.column.id === "status" && "text-right",
                      cell.column.id === "title" && "whitespace-normal",
                      responsiveColumn[cell.column.id],
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
                colSpan={table.getVisibleLeafColumns().length}
                className="h-[17.5rem] p-0"
              >
                <Empty className="p-4 whitespace-normal">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Inbox />
                    </EmptyMedia>
                    <EmptyTitle className="text-base">
                      Nothing in this lane
                    </EmptyTitle>
                    <EmptyDescription>
                      Move a ticket here from its status pill.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between gap-3 border-t px-6 py-3">
        <p className="text-muted-foreground text-sm tabular-nums">
          {firstRow}-{lastRow} of {filteredCount}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm tabular-nums">
            Page {pageIndex + 1} of {pageCount}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </Card>
  );
}
