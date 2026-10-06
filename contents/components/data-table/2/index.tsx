"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ExpandedState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  ColumnsIcon,
  MoreHorizontal,
  SearchIcon,
  Trash2,
  Download,
  Copy,
  FileText
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group";

function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

const data = [
  {
    id: "ord_m5gr84i9",
    orderNumber: "SO-1001",
    status: "processing",
    createdAt: "2024-01-15",
    customer: {
      name: "Ken Adams",
      email: "ken99@example.com"
    },
    payment: {
      method: "Card",
      last4: "4242",
      status: "paid"
    },
    shipping: {
      method: "Standard",
      address: "123 Main St, New York, NY"
    },
    totals: {
      currency: "USD",
      subtotal: 316,
      shipping: 12,
      tax: 24,
      total: 352
    },
    items: [
      { sku: "SKU-001", name: "Starter Kit", quantity: 1, unitPrice: 199 },
      { sku: "SKU-014", name: "Pro Components Pack", quantity: 1, unitPrice: 117 }
    ]
  },
  {
    id: "ord_3u1reuv4",
    orderNumber: "SO-1002",
    status: "fulfilled",
    createdAt: "2024-01-16",
    customer: {
      name: "Abe Stone",
      email: "abe45@example.com"
    },
    payment: {
      method: "PayPal",
      last4: null,
      status: "paid"
    },
    shipping: {
      method: "Express",
      address: "456 Oak Ave, Los Angeles, CA"
    },
    totals: {
      currency: "USD",
      subtotal: 242,
      shipping: 18,
      tax: 19,
      total: 279
    },
    items: [{ sku: "SKU-008", name: "Marketing Blocks Bundle", quantity: 1, unitPrice: 242 }]
  },
  {
    id: "ord_derv1ws0",
    orderNumber: "SO-1003",
    status: "pending",
    createdAt: "2024-01-17",
    customer: {
      name: "Monserrat Lee",
      email: "monserrat44@example.com"
    },
    payment: {
      method: "Card",
      last4: "0101",
      status: "unpaid"
    },
    shipping: {
      method: "Standard",
      address: "789 Pine Rd, Chicago, IL"
    },
    totals: {
      currency: "USD",
      subtotal: 837,
      shipping: 0,
      tax: 67,
      total: 904
    },
    items: [
      { sku: "SKU-021", name: "Ecommerce Blocks", quantity: 1, unitPrice: 399 },
      { sku: "SKU-033", name: "Dashboard Template", quantity: 1, unitPrice: 438 }
    ]
  },
  {
    id: "ord_5kma53ae",
    orderNumber: "SO-1004",
    status: "fulfilled",
    createdAt: "2024-01-18",
    customer: {
      name: "Silas Chen",
      email: "silas22@example.com"
    },
    payment: {
      method: "Card",
      last4: "7284",
      status: "paid"
    },
    shipping: {
      method: "Standard",
      address: "321 Elm St, Houston, TX"
    },
    totals: {
      currency: "USD",
      subtotal: 874,
      shipping: 14,
      tax: 71,
      total: 959
    },
    items: [
      { sku: "SKU-055", name: "Full UI Kit", quantity: 1, unitPrice: 599 },
      { sku: "SKU-089", name: "Premium Support (1 month)", quantity: 1, unitPrice: 275 }
    ]
  },
  {
    id: "ord_bhqecj4p",
    orderNumber: "SO-1005",
    status: "cancelled",
    createdAt: "2024-01-19",
    customer: {
      name: "Carmella Diaz",
      email: "carmella@example.com"
    },
    payment: {
      method: "Card",
      last4: "1193",
      status: "refunded"
    },
    shipping: {
      method: "Standard",
      address: "654 Maple Dr, Phoenix, AZ"
    },
    totals: {
      currency: "USD",
      subtotal: 721,
      shipping: 0,
      tax: 0,
      total: 721
    },
    items: [{ sku: "SKU-034", name: "Templates Pack", quantity: 1, unitPrice: 721 }]
  }
];

export type Order = (typeof data)[number];

export const columns: ColumnDef<Order>[] = [
  {
    id: "expand",
    header: () => null,
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={(event) => {
          event.stopPropagation();
          row.toggleExpanded();
        }}
        aria-label={row.getIsExpanded() ? "Collapse row" : "Expand row"}
        className="h-8 w-8 p-0">
        <ChevronRight
          className={`transition-transform ${row.getIsExpanded() ? "rotate-90" : ""}`}
        />
      </Button>
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    id: "select",
    header: ({ table }) => (
      <div onClick={(event) => event.stopPropagation()}>
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div onClick={(event) => event.stopPropagation()}>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "orderNumber",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Order
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("orderNumber")}</div>
  },
  {
    id: "customer",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Customer
          <ArrowUpDown />
        </Button>
      );
    },
    accessorFn: (row) => row.customer.email,
    cell: ({ row }) => (
      <div className="space-y-0.5">
        <div className="font-medium">{row.original.customer.name}</div>
        <div className="text-muted-foreground text-sm lowercase">{row.original.customer.email}</div>
      </div>
    )
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>
  },
  {
    id: "date",
    header: "Date",
    accessorFn: (row) => row.createdAt,
    cell: ({ row }) => <div className="text-muted-foreground">{row.original.createdAt}</div>
  },
  {
    id: "total",
    header: () => <div className="text-right">Total</div>,
    accessorFn: (row) => row.totals.total,
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="text-right font-medium">
          {formatCurrency(order.totals.total, order.totals.currency)}
        </div>
      );
    }
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const order = row.original;

      return (
        <div className="text-end" onClick={(event) => event.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.id)}>
                Copy order ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View order</DropdownMenuItem>
              <DropdownMenuItem>View customer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }
  }
];

export default function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    getRowCanExpand: () => true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      expanded
    }
  });

  return (
    <div className="w-full max-w-6xl space-y-4">
      <div className="flex items-center gap-2">
        <InputGroup>
          <InputGroupInput
            placeholder="Filter orders..."
            value={(table.getColumn("orderNumber")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("orderNumber")?.setFilterValue(event.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
        <div className="ml-auto flex items-center gap-2">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Actions
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {table.getFilteredSelectedRowModel().rows.length} selected
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Copy />
                  Copy selected order IDs
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText />
                  Copy as JSON
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Download />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <Trash2 />
                  Cancel selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ColumnsIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => row.toggleExpanded()}
                    className="cursor-pointer">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="bg-muted/50">
                        <div className="space-y-3 py-4">
                          <div className="text-sm font-semibold">Order details</div>
                          <div className="grid gap-3 text-sm">
                            <div className="grid grid-cols-[120px_1fr] gap-2">
                              <span className="text-muted-foreground">Order ID</span>
                              <span className="font-medium">{row.original.id}</span>
                            </div>
                            <div className="grid grid-cols-[120px_1fr] gap-2">
                              <span className="text-muted-foreground">Created</span>
                              <span>{row.original.createdAt}</span>
                            </div>
                            <div className="grid grid-cols-[120px_1fr] gap-2">
                              <span className="text-muted-foreground">Payment</span>
                              <span>
                                {row.original.payment.method}
                                {row.original.payment.last4
                                  ? ` •••• ${row.original.payment.last4}`
                                  : ""}
                                {" · "}
                                <span className="capitalize">{row.original.payment.status}</span>
                              </span>
                            </div>
                            <div className="grid grid-cols-[120px_1fr] gap-2">
                              <span className="text-muted-foreground">Shipping</span>
                              <span>
                                {row.original.shipping.method}
                                {" · "}
                                {row.original.shipping.address}
                              </span>
                            </div>
                            <div className="grid grid-cols-[120px_1fr] gap-2">
                              <span className="text-muted-foreground">Items</span>
                              <div className="space-y-2">
                                {row.original.items.map((item) => (
                                  <div
                                    key={item.sku}
                                    className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                      <div className="font-medium">{item.name}</div>
                                      <div className="text-muted-foreground text-xs">
                                        {item.sku}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-muted-foreground text-xs">
                                        Qty {item.quantity}
                                      </div>
                                      <div className="font-medium">
                                        {formatCurrency(
                                          item.unitPrice * item.quantity,
                                          row.original.totals.currency
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="grid grid-cols-[120px_1fr] gap-2">
                              <span className="text-muted-foreground">Totals</span>
                              <div className="space-y-1">
                                <div className="flex justify-between gap-4">
                                  <span className="text-muted-foreground">Subtotal</span>
                                  <span>
                                    {formatCurrency(
                                      row.original.totals.subtotal,
                                      row.original.totals.currency
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-muted-foreground">Shipping</span>
                                  <span>
                                    {formatCurrency(
                                      row.original.totals.shipping,
                                      row.original.totals.currency
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-muted-foreground">Tax</span>
                                  <span>
                                    {formatCurrency(
                                      row.original.totals.tax,
                                      row.original.totals.currency
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between gap-4 pt-1 font-medium">
                                  <span>Total</span>
                                  <span>
                                    {formatCurrency(
                                      row.original.totals.total,
                                      row.original.totals.currency
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
