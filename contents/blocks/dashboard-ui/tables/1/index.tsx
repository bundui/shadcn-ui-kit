"use client";

import * as React from "react";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Building2,
  Check,
  Copy,
  CreditCard,
  MoreHorizontal,
  Wallet,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Status = "paid" | "due" | "overdue";
type Method = "card" | "wire" | "wallet";

type Invoice = {
  id: string;
  client: string;
  issued: string;
  method: Method;
  status: Status;
  amount: number;
};

const initialInvoices: Invoice[] = [
  {
    id: "BL-1042",
    client: "Harbor & Pine",
    issued: "2026-09-28",
    method: "card",
    status: "paid",
    amount: 1840,
  },
  {
    id: "BL-1041",
    client: "Quillstone Labs",
    issued: "2026-09-24",
    method: "wire",
    status: "due",
    amount: 4625.5,
  },
  {
    id: "BL-1040",
    client: "Mosaic Health",
    issued: "2026-09-19",
    method: "wallet",
    status: "paid",
    amount: 612.75,
  },
  {
    id: "BL-1039",
    client: "Northbeam Co.",
    issued: "2026-09-12",
    method: "wire",
    status: "overdue",
    amount: 3290,
  },
  {
    id: "BL-1038",
    client: "Fernway Studio",
    issued: "2026-09-08",
    method: "card",
    status: "due",
    amount: 975,
  },
  {
    id: "BL-1037",
    client: "Atlas Freight",
    issued: "2026-09-02",
    method: "wire",
    status: "overdue",
    amount: 2150.4,
  },
];

const statusMeta: Record<
  Status,
  { label: string; className: string; dot: string }
> = {
  paid: {
    label: "Paid",
    className: "text-green-600 dark:text-green-400",
    dot: "bg-green-600 dark:bg-green-400",
  },
  due: {
    label: "Due",
    className: "text-muted-foreground",
    dot: "bg-muted-foreground",
  },
  overdue: {
    label: "Overdue",
    className: "text-rose-600 dark:text-rose-400",
    dot: "bg-rose-600 dark:bg-rose-400",
  },
};

const methodMeta: Record<
  Method,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  card: { label: "Card", icon: CreditCard },
  wire: { label: "Wire transfer", icon: Building2 },
  wallet: { label: "Digital wallet", icon: Wallet },
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const formatDate = (value: string) =>
  new Date(`${value}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

type Filter = "all" | Status;

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "paid", label: "Paid" },
  { value: "due", label: "Due" },
  { value: "overdue", label: "Overdue" },
];

export default function RecentInvoicesTable() {
  const [invoices, setInvoices] = React.useState(initialInvoices);
  const [filter, setFilter] = React.useState<Filter>("all");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const markPaid = React.useCallback((id: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "paid" } : inv)),
    );
  }, []);

  const copyId = React.useCallback((id: string) => {
    navigator.clipboard?.writeText(id).catch(() => undefined);
    setCopiedId(id);
    window.setTimeout(
      () => setCopiedId((current) => (current === id ? null : current)),
      1500,
    );
  }, []);

  const columns = React.useMemo<ColumnDef<Invoice>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Invoice",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium">{row.original.id}</span>
            <span className="text-muted-foreground text-xs">
              {row.original.client}
              <span
                className={cn(
                  "sm:hidden",
                  statusMeta[row.original.status].className,
                )}
              >
                {" "}
                · {statusMeta[row.original.status].label}
              </span>
            </span>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        filterFn: "equals",
        meta: { className: "hidden sm:table-cell" },
        cell: ({ row }) => {
          const meta = statusMeta[row.original.status];
          return (
            <Badge variant="outline" className={cn("gap-1.5", meta.className)}>
              <span
                className={cn("size-1.5 rounded-full", meta.dot)}
                aria-hidden
              />
              {meta.label}
            </Badge>
          );
        },
      },
      {
        accessorKey: "method",
        header: "Method",
        meta: { className: "hidden md:table-cell" },
        cell: ({ row }) => {
          const meta = methodMeta[row.original.method];
          const Icon = meta.icon;
          return (
            <span className="text-muted-foreground flex items-center gap-2">
              <Icon className="size-4" />
              {meta.label}
            </span>
          );
        },
      },
      {
        accessorKey: "issued",
        header: "Issued",
        meta: { className: "hidden sm:table-cell" },
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {formatDate(row.original.issued)}
          </span>
        ),
      },
      {
        accessorKey: "amount",
        meta: { className: "text-right" },
        header: ({ column }) => {
          const sorted = column.getIsSorted();
          const Icon =
            sorted === "asc"
              ? ArrowUp
              : sorted === "desc"
                ? ArrowDown
                : ArrowUpDown;
          return (
            <Button
              variant="ghost"
              size="sm"
              className="-mr-3 ml-auto flex"
              onClick={() => column.toggleSorting(sorted === "asc")}
              aria-label="Sort by amount"
            >
              Amount
              <Icon className={cn(!sorted && "text-muted-foreground")} />
            </Button>
          );
        },
        cell: ({ row }) => (
          <span className="font-medium tabular-nums">
            {currency.format(row.original.amount)}
          </span>
        ),
      },
      {
        id: "actions",
        enableSorting: false,
        meta: { className: "w-10 pr-0 pl-1 text-right" },
        cell: ({ row }) => {
          const invoice = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Actions for ${invoice.id}`}
                >
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel>{invoice.id}</DropdownMenuLabel>
                <DropdownMenuItem onSelect={() => copyId(invoice.id)}>
                  <Copy />
                  Copy invoice ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={invoice.status === "paid"}
                  onSelect={() => markPaid(invoice.id)}
                >
                  <Check />
                  Mark as paid
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [copyId, markPaid],
  );

  const columnFilters = React.useMemo(
    () => (filter === "all" ? [] : [{ id: "status", value: filter }]),
    [filter],
  );

  const table = useReactTable({
    data: invoices,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const rows = table.getRowModel().rows;
  const visibleTotal = rows.reduce((sum, row) => sum + row.original.amount, 0);
  const outstanding = invoices
    .filter((inv) => inv.status !== "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const countFor = (value: Filter) =>
    value === "all"
      ? invoices.length
      : invoices.filter((inv) => inv.status === value).length;

  return (
    <Card className="mx-auto w-full max-w-4xl shadow-none">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <CardTitle className="text-lg">Recent invoices</CardTitle>
          <CardDescription>
            {currency.format(outstanding)} still outstanding across{" "}
            {countFor("due") + countFor("overdue")} invoices
          </CardDescription>
        </div>
        <div>
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            spacing={0}
            value={filter}
            onValueChange={(value) => value && setFilter(value as Filter)}
            aria-label="Filter by status"
          >
            {filters.map((item) => (
              <ToggleGroupItem
                key={item.value}
                value={item.value}
                className="gap-1.5 px-2.5"
              >
                {item.label}
                <span className="text-muted-foreground text-xs tabular-nums">
                  {countFor(item.value)}
                </span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id} className="hover:bg-transparent">
                {group.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "text-muted-foreground",
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
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={
                        (
                          cell.column.columnDef.meta as
                            { className?: string } | undefined
                        )?.className
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
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
                  No invoices match this filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <p className="text-muted-foreground mt-4 text-sm">
          {copiedId ? (
            <span className="text-foreground inline-flex items-center gap-1.5">
              <Check className="size-4" />
              Copied {copiedId} to clipboard
            </span>
          ) : (
            <>
              Showing {rows.length} of {invoices.length} invoices, totaling{" "}
              <span className="text-foreground font-medium tabular-nums">
                {currency.format(visibleTotal)}
              </span>
            </>
          )}
        </p>
      </CardContent>
    </Card>
  );
}
