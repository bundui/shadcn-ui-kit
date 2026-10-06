"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Cell,
  type ColumnDef,
  type ColumnFiltersState,
  type Header,
  type SortingState,
  type VisibilityState
} from "@tanstack/react-table";
import {
  ChevronDown,
  ColumnsIcon,
  MoreHorizontal,
  SearchIcon,
  Trash2,
  Download,
  Copy,
  FileText,
  GripVertical,
  ArrowUpDown
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  horizontalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

const initialData: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@example.com"
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@example.com"
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@example.com"
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@example.com"
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@example.com"
  }
];

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

function DraggableHeader({ header }: { header: Header<Payment, unknown> }) {
  const isSelectColumn = header.column.id === "select";
  const isActionsColumn = header.column.id === "actions";
  const isNonDraggable = isSelectColumn || isActionsColumn;
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id: header.column.id,
    disabled: isNonDraggable
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition,
    whiteSpace: "nowrap",
    width: header.column.getSize(),
    zIndex: isDragging ? 1 : 0
  };

  if (isNonDraggable) {
    return (
      <TableHead
        className="relative h-10 border-t"
        style={{ width: header.column.getSize() }}
        colSpan={header.colSpan}>
        <div className={isSelectColumn ? "flex items-center" : ""}>
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
        </div>
      </TableHead>
    );
  }

  return (
    <TableHead
      ref={setNodeRef}
      className="relative h-10 border-t"
      style={style}
      colSpan={header.colSpan}>
      <div className="flex items-center justify-start gap-0.5">
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder">
          <GripVertical className="h-3 w-3 opacity-60" aria-hidden="true" />
        </Button>
        {header.column.getCanSort() && (
          <Button
            size="icon"
            variant="ghost"
            className="group h-7 w-7"
            onClick={header.column.getToggleSortingHandler()}
            aria-label="Toggle sorting">
            <ArrowUpDown className="h-4 w-4 shrink-0 opacity-60" aria-hidden="true" />
          </Button>
        )}
        <span className="ms-1 grow truncate">
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
        </span>
      </div>
    </TableHead>
  );
}

function DragAlongCell({ cell }: { cell: Cell<Payment, unknown> }) {
  const isSelectColumn = cell.column.id === "select";
  const isActionsColumn = cell.column.id === "actions";
  const isNonDraggable = isSelectColumn || isActionsColumn;
  const { isDragging, setNodeRef, transform, transition } = useSortable({
    id: cell.column.id,
    disabled: isNonDraggable
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition,
    width: cell.column.getSize(),
    zIndex: isDragging ? 1 : 0
  };

  if (isNonDraggable) {
    return (
      <TableCell
        className={isSelectColumn ? "w-[50px]" : ""}
        style={{ width: cell.column.getSize() }}>
        <div className={isSelectColumn ? "flex items-center" : ""}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </div>
      </TableCell>
    );
  }

  return (
    <TableCell ref={setNodeRef} className="truncate" style={style}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
}

const baseColumns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 50,
    minSize: 50,
    maxSize: 50
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>
  },
  {
    accessorKey: "amount",
    header: () => <div>Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(amount);

      return <div>{formatted}</div>;
    }
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="text-end">Actions</div>,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <div className="text-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }
  }
];

export default function DataTableDemo() {
  const [data] = React.useState<Payment[]>(initialData);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>(() =>
    baseColumns
      .map((col) => (col.id || ("accessorKey" in col ? col.accessorKey : null)) as string)
      .filter((id) => id && id !== "select" && id !== "actions")
  );
  const sortableId = React.useId();

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const columns = React.useMemo<ColumnDef<Payment>[]>(() => {
    const selectColumn = baseColumns.find((col) => col.id === "select");
    const actionsColumn = baseColumns.find((col) => col.id === "actions");
    const otherColumns = columnOrder
      .map((colId) =>
        baseColumns.find(
          (col) => col.id === colId || ("accessorKey" in col && col.accessorKey === colId)
        )
      )
      .filter((col): col is ColumnDef<Payment> => col !== undefined);
    const result: ColumnDef<Payment>[] = [];
    if (selectColumn) result.push(selectColumn);
    result.push(...otherColumns);
    if (actionsColumn) result.push(actionsColumn);
    return result;
  }, [columnOrder]);

  const fullColumnOrder = React.useMemo<string[]>(() => {
    return ["select", ...columnOrder, "actions"];
  }, [columnOrder]);

  const table = useReactTable({
    data,
    columns,
    columnResizeMode: "onChange",
    getRowId: (row) => row.id,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onColumnOrderChange: (updater) => {
      const newOrder = typeof updater === "function" ? updater(fullColumnOrder) : updater;
      const filteredOrder = newOrder.filter((id: string) => id !== "select" && id !== "actions");
      setColumnOrder(filteredOrder);
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      columnOrder: fullColumnOrder
    }
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (
      active &&
      over &&
      active.id !== over.id &&
      active.id !== "select" &&
      active.id !== "actions" &&
      over.id !== "select" &&
      over.id !== "actions"
    ) {
      setColumnOrder((order) => {
        const oldIndex = order.indexOf(active.id as string);
        const newIndex = order.indexOf(over.id as string);
        return arrayMove(order, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="w-full max-w-6xl space-y-4">
      <div className="flex items-center gap-2">
        <InputGroup>
          <InputGroupInput
            placeholder="Filter emails..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
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
                  Copy selected IDs
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
                  Delete selected
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
        <DndContext
          id={sortableId}
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToHorizontalAxis]}
          onDragEnd={handleDragEnd}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-muted/50 [&>th]:border-t-0">
                  <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
                    {headerGroup.headers.map((header) => (
                      <DraggableHeader key={header.id} header={header} />
                    ))}
                  </SortableContext>
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
                      {row.getVisibleCells().map((cell) => (
                        <DragAlongCell key={cell.id} cell={cell} />
                      ))}
                    </SortableContext>
                  </TableRow>
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
        </DndContext>
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
