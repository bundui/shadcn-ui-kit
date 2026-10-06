"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Archive,
  ArchiveRestore,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  Copy,
  CopyPlus,
  Headphones,
  Keyboard,
  Lamp,
  LucideIcon,
  Monitor,
  MoreHorizontal,
  PackageSearch,
  Search,
  Trash2,
  Webcam,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  icon: LucideIcon;
  archived: boolean;
};

const initialProducts: Product[] = [
  {
    id: "p1",
    name: 'Studio Monitor 27"',
    sku: "DSK-2701",
    category: "Displays",
    price: 389,
    stock: 42,
    icon: Monitor,
    archived: false,
  },
  {
    id: "p2",
    name: "Low Profile Keyboard",
    sku: "INP-0412",
    category: "Input",
    price: 119.5,
    stock: 8,
    icon: Keyboard,
    archived: false,
  },
  {
    id: "p3",
    name: "Noise Cancelling Headset",
    sku: "AUD-1180",
    category: "Audio",
    price: 214,
    stock: 0,
    icon: Headphones,
    archived: false,
  },
  {
    id: "p4",
    name: "4K Streaming Webcam",
    sku: "CAM-0907",
    category: "Video",
    price: 159.99,
    stock: 23,
    icon: Webcam,
    archived: false,
  },
  {
    id: "p5",
    name: "Dimmable Desk Lamp",
    sku: "LGT-0330",
    category: "Lighting",
    price: 64.25,
    stock: 117,
    icon: Lamp,
    archived: true,
  },
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function stockState(stock: number) {
  if (stock === 0)
    return { label: "Sold out", className: "text-rose-600 dark:text-rose-400" };
  if (stock < 10)
    return { label: `${stock} left`, className: "font-medium text-foreground" };
  return { label: `${stock} in stock`, className: "text-muted-foreground" };
}

function SortHeader({
  label,
  sorted,
  onClick,
  className,
}: {
  label: string;
  sorted: false | "asc" | "desc";
  onClick: () => void;
  className?: string;
}) {
  const Icon =
    sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown;
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      aria-label={`Sort by ${label}`}
      className={cn("-ml-3 h-8 gap-1.5", className)}
    >
      {label}
      <Icon className={cn("size-3.5", !sorted && "text-muted-foreground")} />
    </Button>
  );
}

export default function ProductCatalogTable() {
  const [products, setProducts] = React.useState<Product[]>(initialProducts);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [query, setQuery] = React.useState("");
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const duplicate = React.useCallback((product: Product) => {
    setProducts((prev) => {
      const index = prev.findIndex((p) => p.id === product.id);
      const copyCount = prev.filter((p) =>
        p.sku.startsWith(product.sku),
      ).length;
      const clone: Product = {
        ...product,
        id: `${product.id}-copy-${copyCount}`,
        name: `${product.name} (copy)`,
        sku: `${product.sku}-C${copyCount}`,
        stock: 0,
      };
      const next = [...prev];
      next.splice(index + 1, 0, clone);
      return next;
    });
  }, []);

  const toggleArchive = React.useCallback((id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, archived: !p.archived } : p)),
    );
  }, []);

  const remove = React.useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const copySku = React.useCallback((product: Product) => {
    navigator.clipboard?.writeText(product.sku).catch(() => undefined);
    setCopiedId(product.id);
    window.setTimeout(
      () => setCopiedId((current) => (current === product.id ? null : current)),
      1500,
    );
  }, []);

  const columns = React.useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <SortHeader
            label="Product"
            sorted={column.getIsSorted()}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ row }) => {
          const product = row.original;
          const Icon = product.icon;
          return (
            <div className="flex items-center gap-3">
              <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-xl border">
                <Icon className="text-foreground size-4.5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-medium">{product.name}</span>
                  {product.archived && (
                    <Badge variant="outline" className="text-muted-foreground">
                      Archived
                    </Badge>
                  )}
                </div>
                <div className="text-muted-foreground font-mono text-xs">
                  {product.sku}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.category}</span>
        ),
      },
      {
        accessorKey: "stock",
        header: ({ column }) => (
          <SortHeader
            label="Inventory"
            sorted={column.getIsSorted()}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ row }) => {
          const state = stockState(row.original.stock);
          return (
            <span className={cn("text-sm tabular-nums", state.className)}>
              {state.label}
            </span>
          );
        },
      },
      {
        accessorKey: "price",
        header: ({ column }) => (
          <div className="flex justify-end">
            <SortHeader
              label="Price"
              sorted={column.getIsSorted()}
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="-mr-3 ml-0"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right font-medium tabular-nums">
            {currency.format(row.original.price)}
          </div>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Actions for ${product.name}`}
                  >
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onSelect={() => copySku(product)}>
                    {copiedId === product.id ? <Check /> : <Copy />}
                    {copiedId === product.id ? "SKU copied" : "Copy SKU"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => duplicate(product)}>
                    <CopyPlus />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => toggleArchive(product.id)}>
                    {product.archived ? <ArchiveRestore /> : <Archive />}
                    {product.archived ? "Restore" : "Archive"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => remove(product.id)}
                  >
                    <Trash2 />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [copiedId, copySku, duplicate, remove, toggleArchive],
  );

  const table = useReactTable({
    data: products,
    columns,
    state: { sorting, globalFilter: query },
    onSortingChange: setSorting,
    onGlobalFilterChange: setQuery,
    globalFilterFn: (row, _columnId, value: string) => {
      const needle = value.trim().toLowerCase();
      if (!needle) return true;
      const { name, sku, category } = row.original;
      return [name, sku, category].some((field) =>
        field.toLowerCase().includes(needle),
      );
    },
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const activeProducts = products.filter((p) => !p.archived);
  const inventoryValue = activeProducts.reduce(
    (sum, p) => sum + p.price * p.stock,
    0,
  );
  const rows = table.getRowModel().rows;

  return (
    <Card className="mx-auto w-full max-w-4xl gap-0 py-0 shadow-none">
      <CardHeader className="flex flex-col gap-4 border-b py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle>Storefront products</CardTitle>
          <CardDescription>
            {activeProducts.length} live listings,{" "}
            {currency.format(inventoryValue)} on hand
          </CardDescription>
        </div>
        <CardAction className="w-full sm:w-64">
          <InputGroup>
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, SKU, category"
              aria-label="Search products"
            />
          </InputGroup>
        </CardAction>
      </CardHeader>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    "text-muted-foreground first:pl-6 last:pr-6",
                    header.column.id === "category" && "hidden md:table-cell",
                    header.column.id === "stock" && "hidden sm:table-cell",
                    header.column.id === "price" && "text-right",
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
              <TableRow
                key={row.id}
                className={cn(
                  row.original.archived && "[&_td:not(:last-child)]:opacity-60",
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      "py-3.5 first:pl-6 last:pr-6",
                      cell.column.id === "name" && "whitespace-normal",
                      cell.column.id === "category" && "hidden md:table-cell",
                      cell.column.id === "stock" && "hidden sm:table-cell",
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="h-40 p-0">
                <Empty className="gap-3 p-4 whitespace-normal">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <PackageSearch />
                    </EmptyMedia>
                    <EmptyTitle className="text-base">
                      No products found
                    </EmptyTitle>
                    <EmptyDescription>
                      {products.length
                        ? "Try a different search term."
                        : "The catalog is empty."}
                    </EmptyDescription>
                  </EmptyHeader>
                  {query && (
                    <EmptyContent>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuery("")}
                      >
                        Clear search
                      </Button>
                    </EmptyContent>
                  )}
                </Empty>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
